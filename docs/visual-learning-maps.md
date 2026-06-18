# Visual Learning Maps

These diagrams are optimized for beginners to visually trace the exact execution paths of the application. They can be copied directly into Mermaid Live, Obsidian, or GitHub.

---

## 1. Data Flow Map
*Traces the transformation of data across architectural boundaries.*

```mermaid
flowchart TD
    classDef frontend fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef backend fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef network fill:#fef08a,stroke:#ca8a04,stroke-width:2px,stroke-dasharray: 5 5;
    classDef error fill:#fee2e2,stroke:#dc2626,stroke-width:2px;
    classDef transform fill:#f3e8ff,stroke:#9333ea,stroke-width:2px;

    subgraph UserContext ["👤 User Context"]
        U1([Input Form Data])
        U2([Download ZIP])
    end

    subgraph FrontendLayer ["💻 Frontend (React / Vite)"]
        F1[react-hook-form State]:::frontend
        F2{{Format JSON Body}}:::transform
        F3[useCheckPyq Mutation]:::frontend
        F4[setPapers State]:::frontend
        F5{{JSZip Memory Builder}}:::transform
    end

    subgraph HTTPBoundary ["🌐 Network Boundary"]
        N1[POST /api/pyq/check]:::network
        N2[CheckPyqResponse JSON]:::network
    end

    subgraph BackendLayer ["⚙️ Backend (Express / Node)"]
        B1{Zod Validation}:::backend
        B2[400 Error]:::error
        B3{{generateUrls Logic}}:::transform
        B4[Candidate URLs Array]:::backend
    end

    subgraph ExternalBoundary ["🌐 External Network"]
        G1[Fetch PDF Blob]:::network
        G2[GTU Web Server]:::backend
    end

    U1 -->|Fills out form| F1
    F1 -->|Submit| F3
    F3 --> F2
    F2 -->|CheckPyqBody| N1
    N1 -.-> B1
    
    B1 -- Invalid --> B2
    B1 -- Valid Data --> B3
    B3 -->|Computes Permutations| B4
    B4 -->|Serialize JSON| N2
    N2 -.-> F4
    
    F4 -->|Render Links| U2
    U2 -->|handleDownload| G1
    G1 -.-> G2
    G2 -.->|Return PDF Blob| F5
    F5 -->|Generate Blob URI| U2
```

---

## 2. Variable Trace Map
*Answers: Where did this variable come from, and how did it change?*

**Variable: `subjectCode`**

```mermaid
flowchart LR
    classDef origin fill:#dbeafe,stroke:#2563eb,stroke-width:2px;
    classDef transform fill:#f3e8ff,stroke:#9333ea,stroke-width:2px;
    classDef usage fill:#dcfce7,stroke:#16a34a,stroke-width:2px;

    subgraph FrontendState ["Frontend State"]
        A[Origin: Input Field\n'3150703']:::origin --> B{{Transformation: trim()}}:::transform
        B --> C[Usage: req.body.subjectCode]:::usage
    end
    
    subgraph Network ["HTTP POST"]
        C -.-> D[Transmitted Payload]
    end

    subgraph BackendExec ["Backend Execution"]
        D -.-> E[Origin: req.body]:::origin
        E --> F{{Transformation: Zod Parse}}:::transform
        F --> G[Usage: generateUrls arg]:::usage
        G --> H{{Transformation: String Interpolation\n'.../3150703.pdf'}}:::transform
    end

    subgraph FrontendRender ["Frontend Usage"]
        H -.-> I[Usage: PDF Fetch URL]:::usage
        H -.-> J{{Transformation: makeFilename()}}:::transform
        J --> K[Usage: JSZip Filename\n'3150703_BE...pdf']:::usage
    end
```

---

## 3. Object Shape Map
*Answers: What does this object look like, who makes it, and who uses it?*

```mermaid
classDiagram
    class CheckPyqBody {
        <<Shape>>
        +String subjectCode "3150703"
        +String course "BE"
        +Number startYear 2021
        +Number endYear 2023
        +Array~String~ sessions ["S", "W"]
    }

    class Creator_DownloadJSX {
        <<Creator: Frontend>>
        +extracts hook-form values
        +constructs JSON object
    }

    class Consumer_BackendRoute {
        <<Consumer: Backend>>
        +receives Express req.body
        +applies Zod Validation
    }

    Creator_DownloadJSX ..> CheckPyqBody : Instantiates
    CheckPyqBody ..> Consumer_BackendRoute : Transmits Lifecycle
```

---

## 4. Function Call Map
*Answers: Who called this function, and what happens next?*

```mermaid
sequenceDiagram
    participant U as User
    box rgb(224, 242, 254) Frontend
    participant F as download.jsx
    participant A as custom-fetch.js
    end
    box rgb(254, 240, 138) Network Boundary
    participant N as POST /api/pyq/check
    end
    box rgb(220, 252, 231) Backend
    participant R as pyq/index.js
    participant V as CheckPyqBody.safeParse
    participant L as generateUrls()
    end

    U->>F: Click "Get Links"
    F->>F: handleSubmit(onCheck)
    F->>A: useCheckPyq.mutate()
    A->>N: customFetch()
    N->>R: Express Route Matches
    
    R->>V: Validation Request
    alt Validation Failed
        V-->>R: Schema Error
        R-->>N: 400 Bad Request
        N-->>A: ApiError Thrown
        A-->>F: onError (Shows Toast)
    else Validation Success
        V-->>R: Valid Data Object
        R->>L: Business Logic Call
        L-->>R: Array of Strings
        R-->>N: 200 OK (JSON)
        N-->>A: Parsed Body
        A-->>F: onSuccess Callback
        F->>F: setPapers(mapped)
        F-->>U: UI Updates with Links
    end
```

---

## 5. File Interaction Map
*Answers: Which file handles this request, and what does it import?*

```mermaid
flowchart LR
    classDef react fill:#61dafb,stroke:#000,color:#000
    classDef js fill:#f7df1e,stroke:#000,color:#000
    classDef api fill:#4caf50,stroke:#fff,color:#fff
    classDef express fill:#eeeeee,stroke:#333,color:#333

    subgraph Browser ["User Browser"]
        D[pages/download.jsx]:::react -->|Imports hook| A[api/generated/api.js]:::js
        A -->|Uses fetcher| C[api/custom-fetch.js]:::js
    end

    C -.->|HTTP POST| E[src/app.js]:::express

    subgraph Server ["Node.js Server"]
        E -->|Routes to| R1[routes/index.js]:::express
        R1 -->|Routes to| R2[routes/pyq/index.js]:::express
        R2 -->|Imports Zod| Z[api/index.js]:::api
    end
```

---

## 6. Error Propagation Map
*Answers: Where does it break, and how does the user find out?*

```mermaid
flowchart TD
    classDef user fill:#fef3c7,stroke:#d97706;
    classDef sys fill:#e0e7ff,stroke:#4f46e5;
    classDef err fill:#fee2e2,stroke:#dc2626,stroke-width:2px;

    subgraph Validation ["Form Validation Layer"]
        E1[Invalid Year Input]:::user --> Z1{Hook Form Rules}:::sys
        Z1 -- Fails --> R1[UI Red Text]:::err
    end

    subgraph NetworkLayer ["Backend Network Layer"]
        E2[Backend Offline]:::sys --> F1{customFetch API}:::sys
        F1 -- Fails --> R2[Toast: Network Error]:::err
    end

    subgraph BusinessLogic ["Backend Logic Layer"]
        E3[startYear > endYear]:::user --> B1{Express Logic}:::sys
        B1 -- Throws 400 --> F1
    end

    subgraph ExternalSystem ["GTU Download Layer"]
        E4[Click Download ZIP]:::user --> GTU{GTU CORS Policy}:::sys
        GTU -- Blocked --> C1[catch TypeError]:::sys
        C1 --> R3[Warning: Browser Blocked]:::err
        GTU -- 404 Not Found --> C2[Response Not OK]:::sys
        C2 --> R4[UI: Red X icon]:::err
    end
```
