# Plain ASCII Mermaid Diagrams

These diagrams are formatted specifically for maximum compatibility with Mermaid Live Editor, Excalidraw, and other parsers. They do not contain any custom styling, HTML, or special characters inside labels.

## Data Flow Map
```mermaid
flowchart TD
    subgraph UserContext [User Context]
        U1([Input Form Data])
        U2([Download ZIP])
    end

    subgraph FrontendLayer [Frontend Layer]
        F1[Hook Form State]
        F2{{Format JSON Body}}
        F3[CheckPyq Mutation]
        F4[setPapers State]
        F5{{JSZip Memory Builder}}
    end

    subgraph HTTPBoundary [Network Boundary]
        N1[POST pyq check]
        N2[JSON Response]
    end

    subgraph BackendLayer [Backend Layer]
        B1{Zod Validation}
        B2[400 Error]
        B3{{generateUrls Logic}}
        B4[Candidate URLs Array]
    end

    subgraph ExternalBoundary [External Network]
        G1[Fetch PDF Blob]
        G2[GTU Web Server]
    end

    U1 -->|Fills form| F1
    F1 -->|Submit| F3
    F3 --> F2
    F2 -->|CheckPyqBody| N1
    N1 -.-> B1
    
    B1 -- Invalid --> B2
    B1 -- Valid Data --> B3
    B3 -->|Permutations| B4
    B4 -->|Serialize JSON| N2
    N2 -.-> F4
    
    F4 -->|Render Links| U2
    U2 -->|handleDownload| G1
    G1 -.-> G2
    G2 -.->|Return PDF Blob| F5
    F5 -->|Generate Blob URI| U2
```

## Variable Trace Map
```mermaid
flowchart LR
    subgraph FrontendState [Frontend State]
        A[Origin Input Field] --> B{{Transform trim}}
        B --> C[Usage req body]
    end
    
    subgraph Network [HTTP POST]
        C -.-> D[Transmitted Payload]
    end

    subgraph BackendExec [Backend Execution]
        D -.-> E[Origin req body]
        E --> F{{Transform Zod Parse}}
        F --> G[Usage function arg]
        G --> H{{Transform Interpolate}}
    end

    subgraph FrontendRender [Frontend Usage]
        H -.-> I[Usage Fetch URL]
        H -.-> J{{Transform Filename}}
        J --> K[Usage JSZip Filename]
    end
```

## Object Shape Map
```mermaid
flowchart TD
    subgraph CheckPyqBody [CheckPyqBody Shape]
        P1[subjectCode String]
        P2[course String]
        P3[startYear Number]
        P4[endYear Number]
        P5[sessions String Array]
    end

    subgraph Creator [Frontend Creator]
        C1[Extracts form values]
        C2[Constructs JSON object]
    end

    subgraph Consumer [Backend Consumer]
        B1[Receives Express body]
        B2[Applies Zod Validation]
    end

    C1 --> C2
    C2 --> P1
    P1 -.-> B1
    B1 --> B2
```

## Function Call Map
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Network
    participant Backend

    User->>Frontend: Click Get Links
    Frontend->>Frontend: handleSubmit
    Frontend->>Network: customFetch
    Network->>Backend: Express Route
    
    Backend->>Backend: Validation Request
    alt Validation Failed
        Backend-->>Network: 400 Bad Request
        Network-->>Frontend: ApiError
        Frontend-->>User: Show Toast
    else Validation Success
        Backend->>Backend: generateUrls
        Backend-->>Network: 200 OK
        Network-->>Frontend: Parsed JSON
        Frontend->>Frontend: setPapers
        Frontend-->>User: Render Links
    end
```

## File Interaction Map
```mermaid
flowchart LR
    subgraph Browser [User Browser]
        D[download jsx] -->|Imports hook| A[generated api js]
        A -->|Uses fetcher| C[custom fetch js]
    end

    C -.->|HTTP POST| E[src app js]

    subgraph Server [Node Server]
        E -->|Routes to| R1[routes index js]
        R1 -->|Routes to| R2[routes pyq index js]
        R2 -->|Imports Zod| Z[api index js]
    end
```

## Error Propagation Map
```mermaid
flowchart TD
    subgraph Validation [Form Validation]
        E1[Invalid Year Input] --> Z1{Hook Form Rules}
        Z1 -- Fails --> R1[UI Red Text]
    end

    subgraph NetworkLayer [Backend Network]
        E2[Backend Offline] --> F1{customFetch API}
        F1 -- Fails --> R2[Toast Network Error]
    end

    subgraph BusinessLogic [Backend Logic]
        E3[startYear over endYear] --> B1{Express Logic}
        B1 -- Throws 400 --> F1
    end

    subgraph ExternalSystem [GTU Download]
        E4[Click Download ZIP] --> GTU{GTU CORS Policy}
        GTU -- Blocked --> C1[catch TypeError]
        C1 --> R3[Warning Browser Blocked]
        GTU -- Not Found --> C2[Response Not OK]
        C2 --> R4[UI Red X icon]
    end
```
