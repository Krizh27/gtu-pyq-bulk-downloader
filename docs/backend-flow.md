# Backend Architecture & Flow

The backend is built with Express.js running natively on Node.js. It functions as a lightweight API server designed to validate data and compute results without hitting a database.

## Core Flow

1. **Entry Point (`src/index.js`)**:
   Starts the Node.js process. It checks for critical environment variables (like `PORT`), and then binds the Express app to the network.

2. **App Configuration (`src/app.js`)**:
   Sets up the global middleware:
   - `cors`: Allows the frontend to make requests to the backend.
   - `pino-http`: Logs every incoming HTTP request and outgoing response automatically.
   - `express.json()`: Parses incoming JSON request bodies so they can be accessed via `req.body`.
   - Attaches the main router (`/api`).

3. **Routing (`src/routes/index.js`)**:
   Groups all sub-routes together.
   - `/healthz` -> Handled by `health.js` for server uptime checks.
   - `/pyq/check` -> Handled by `pyq/index.js` for the core business logic.

4. **Validation Layer (`src/api/index.js`)**:
   Even though this is JavaScript, we use `zod` schemas to strictly validate incoming data. When the route receives `req.body`, it passes it to a Zod schema. If the input is malicious or malformed, the backend immediately rejects it with a `400 Bad Request` before running any logic.

5. **Business Logic (`src/routes/pyq/index.js`)**:
   Instead of scraping the GTU website (which is slow and error-prone), the backend uses a mathematical approach. It knows GTU's naming conventions (`S` for Summer, `W` for Winter, followed by the year, course, and subject code). It loops through the requested years and generates every possible URL that *might* exist.
