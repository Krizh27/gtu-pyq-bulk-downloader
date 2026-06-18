# System Architecture

The GTU PYQ Downloader has been completely rewritten to use standard, vanilla web technologies. This architecture is designed for extreme simplicity, maximizing learning potential for students studying full-stack development.

## The "Single Server" Model

Unlike modern web applications that separate the frontend (e.g., a React/Vite development server on port 5173) from the backend (an Express server on port 8080), this application runs everything on a single Node.js instance.

### Component Breakdown

1. **Frontend (Static Files)**
   - `frontend/index.html`: The structural foundation of the UI.
   - `frontend/style.css`: All visual styling.
   - `frontend/app.js`: All client-side logic (DOM manipulation, fetching, zipping).
   - *Note*: These files are pure and do not require compilation or bundling.

2. **Backend (Express)**
   - The backend server (`backend/src/index.js`) listens on port 8080.
   - It is configured using `express.static()` to directly serve the `frontend/` directory. When you visit `http://localhost:8080`, Express automatically returns `index.html`.
   - It also hosts an API endpoint at `/api/pyq/check` which the frontend talks to via `fetch()`.

### Benefits for Learning

- **No CORS**: Because the frontend is served from the exact same origin (`localhost:8080`) as the API, Cross-Origin Resource Sharing (CORS) errors are impossible.
- **No Bundlers**: You can edit `app.js` or `style.css`, refresh the page, and instantly see changes. No waiting for Webpack or Vite to recompile.
- **Native APIs**: You learn exactly how the native browser `fetch` API and native JavaScript DOM APIs work without React abstracting them away.
