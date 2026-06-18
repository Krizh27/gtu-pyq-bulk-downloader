# Frontend Architecture & Flow

The frontend is a single-page application (SPA) built with React, bundled by Vite, and styled with TailwindCSS and Shadcn UI components.

## Core Flow

1. **Routing (`src/App.jsx` -> `src/main.jsx`)**:
   The application uses `wouter` for lightweight client-side routing.
   - `/` -> `pages/home.jsx`
   - `/download` -> `pages/download.jsx`
   - `/about` -> `pages/about.jsx`

2. **User Interface (`src/pages/download.jsx`)**:
   The primary interaction point. It uses `react-hook-form` to manage the complex form state (Subject Code, Course, Year ranges, Session mode).

3. **Data Fetching (`src/api/index.js` & `custom-fetch.js`)**:
   When the form is submitted, the frontend calls the backend using a custom hook wrapped around `@tanstack/react-query`. This handles loading states, error catching, and deduplication.

## UI Component Layer

Located in `src/components/ui/`, these are highly reusable, unstyled components (like `Button`, `Select`, `Input`) that have been customized with Tailwind utility classes. They are purely presentational.

## State Management

State is managed entirely locally inside components using standard React hooks (`useState`). 
For asynchronous data (like fetching URLs from the backend), `@tanstack/react-query` is used to cache the results and manage the `isPending`, `isError`, and `data` states automatically.
