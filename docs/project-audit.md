# GTU PYQ Downloader - Project Audit Report

## 1. Architecture Overview
The system is a full-stack web application designed for downloading GTU previous year question papers in bulk.
- **Backend (`api-server`)**: An Express-based Node.js server that acts as a proxy to fetch PDFs directly from GTU servers. It dynamically zips the downloaded PDFs using `archiver` and streams the binary output directly to the client, negating the need for a database or persistent storage.
- **Frontend (`gtu-pyq`)**: A React application built with Vite and Tailwind CSS. It allows users to input their desired parameters (subject code, branch, year range, session) and initiates a two-step process: checking for paper availability, then streaming the ZIP download.
- **Shared Workspace**: Uses `pnpm` workspaces. API contracts are maintained via an OpenAPI spec (`lib/api-spec`), which is used to auto-generate React Query hooks and Zod schemas.

## 2. Identified Components

**Frontend Folders**: `artifacts/gtu-pyq`
**Backend Folders**: `artifacts/api-server`
**Shared Libraries**: `lib/api-client-react`, `lib/api-spec`, `lib/api-zod`
**Generated Code**: `lib/api-client-react/src/generated/`, `lib/api-zod/src/generated/`
**Dead Code**: `lib/db` (no database required), `scripts` (contains placeholder scripts)
**Replit-specific Code**: `.replit-artifact` directories inside `artifacts/`, `artifacts/mockup-sandbox`, `replit.md`, Replit vite plugins in `pnpm-workspace.yaml`
**Duplicate Functionality**: None detected. Code is well-segregated across workspace packages.

---

## 3. Folder Analysis

### KEEP

**Folder**: `artifacts/gtu-pyq`
**Purpose**: Main frontend React application.
**Required?**: Yes
**Reason**: Contains the UI for users to select parameters and download papers.

**Folder**: `artifacts/api-server`
**Purpose**: Express backend server.
**Required?**: Yes
**Reason**: Handles proxying requests to GTU to bypass bot protections and streams ZIP files.

**Folder**: `lib/api-spec`
**Purpose**: OpenAPI specification source of truth.
**Required?**: Yes
**Reason**: Defines the API contract between frontend and backend.

**Folder**: `lib/api-client-react`
**Purpose**: Auto-generated React Query hooks.
**Required?**: Yes
**Reason**: Used by the frontend to make strongly-typed API requests.

**Folder**: `lib/api-zod`
**Purpose**: Auto-generated Zod schemas.
**Required?**: Yes
**Reason**: Used for payload validation on the backend.

### REMOVE

**Folder**: `lib/db`
**Purpose**: Database configuration and schema setup.
**Required?**: No
**Reason**: The application fetches data directly from GTU on demand. `replit.md` confirms "No database needed". It is dead code.

**Folder**: `artifacts/mockup-sandbox`
**Purpose**: Prototyping sandbox environment (likely Replit-specific).
**Required?**: No
**Reason**: Not part of the production application or build pipeline.

**Folder**: `scripts`
**Purpose**: Helper scripts (contains a hello world script and db push).
**Required?**: No
**Reason**: Contains unused boilerplate and a database push script for a database that isn't used.

### OPTIONAL

**Folder**: `.replit-artifact` (inside `artifacts/*`)
**Purpose**: Replit metadata tracking.
**Required?**: No (unless staying strictly on Replit)
**Reason**: Can be removed if the project is being migrated away from Replit.

**Folder**: `replit.md`
**Purpose**: Replit specific documentation.
**Required?**: No
**Reason**: Can be replaced with a standard `README.md`.
