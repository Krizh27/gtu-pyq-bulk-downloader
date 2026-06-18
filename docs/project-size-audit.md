# Project Size Audit

This document analyzes the directories within the project to identify bloat and safe deletion candidates.

## Phase 1 Analysis

### `frontend/node_modules`
- **Size:** ~269 MB
- **Purpose:** Contains all downloaded third-party dependencies required for the React/Vite frontend (e.g., React, Tailwind, Framer Motion).
- **Required?:** Yes, for running the app. No, for version control.
- **Can Be Regenerated?:** Yes, via `npm install` inside the frontend directory.
- **Action:** **DELETE** (Safe to remove for storage, regenerates automatically)

### `backend/node_modules`
- **Size:** ~144 MB
- **Purpose:** Contains all downloaded third-party dependencies required for the Express/Node backend (e.g., Express, Zod, Pino).
- **Required?:** Yes, for running the app. No, for version control.
- **Can Be Regenerated?:** Yes, via `npm install` inside the backend directory.
- **Action:** **DELETE** (Safe to remove for storage, regenerates automatically)

### `frontend/src`
- **Size:** < 1 MB
- **Purpose:** Contains the actual React source code, components, and pages.
- **Required?:** Yes.
- **Can Be Regenerated?:** No.
- **Action:** **KEEP**

### `backend/src`
- **Size:** < 1 MB
- **Purpose:** Contains the actual Node.js/Express server logic and routes.
- **Required?:** Yes.
- **Can Be Regenerated?:** No.
- **Action:** **KEEP**

### `docs`
- **Size:** < 1 MB
- **Purpose:** Contains all system architecture maps, flowcharts, and documentation.
- **Required?:** Yes.
- **Can Be Regenerated?:** No.
- **Action:** **KEEP**

### `frontend/dist` & `backend/dist` & `backend/openapi.yaml`
- **Status:** Already cleaned up in previous steps.
- **Action:** **N/A**
