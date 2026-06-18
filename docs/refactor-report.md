# Refactoring Report & Migration Checklist

## 1. Simplification Strategy
To remove monorepo complexity and Replit-specific configurations, we will restructure the application into two standalone packages: `frontend` and `backend`. All shared libraries (`lib/`) will be flattened into their respective consumers to avoid workspace dependencies. Dead code and mock environments will be removed.

## 2. Target Structure
The repository will be flattened to:
```
docs/
  project-audit.md
  refactor-report.md
frontend/ (standalone React/Vite app)
backend/  (standalone Express app)
```

## 3. Detailed Changes

### Removed Files
- `lib/db/`: **Reason**: Dead code. The application fetches data directly from GTU and doesn't use a database.
- `artifacts/mockup-sandbox/`: **Reason**: Unnecessary Replit prototype sandbox.
- `scripts/`: **Reason**: Dead code. Contains unused boilerplate.
- `.replit-artifact` (all instances): **Reason**: Replit-generated complexity, not needed for standard deployments.
- `replit.md`: **Reason**: Replit specific, will be replaced by standard documentation if needed.
- `pnpm-workspace.yaml`: **Reason**: Removing monorepo complexity.
- `lib/api-client-react/package.json`, `lib/api-zod/package.json`, `lib/api-spec/package.json`: **Reason**: No longer needed as separate workspace packages.

### Moved Files
- `artifacts/gtu-pyq/` -> `frontend/`
  **Reason**: Renamed to clearly indicate it is the standalone frontend.
- `artifacts/api-server/` -> `backend/`
  **Reason**: Renamed to clearly indicate it is the standalone backend.
- `lib/api-client-react/src/` -> `frontend/src/api/`
  **Reason**: The React Query hooks and custom fetch logic are only consumed by the frontend.
- `lib/api-zod/src/` -> `backend/src/api/`
  **Reason**: The Zod schemas are used by the backend for payload validation.
- `lib/api-spec/openapi.yaml` -> `backend/openapi/openapi.yaml`
  **Reason**: API definition serves as the source of truth; placing it in the backend where the API is implemented.

### Kept Files
- Source code in `artifacts/gtu-pyq/src/*` (moving to `frontend/src/*`)
  **Reason**: Contains the core UI logic.
- Source code in `artifacts/api-server/src/*` (moving to `backend/src/*`)
  **Reason**: Contains the core proxy and zip streaming logic.
- `docs/project-audit.md`
  **Reason**: Architecture documentation.

## 4. Migration Checklist
- [ ] **Delete Dead Code**: Remove `lib/db`, `artifacts/mockup-sandbox`, `scripts`, `.replit-artifact` folders, and Replit markdown files.
- [ ] **Remove Monorepo Configs**: Delete `pnpm-workspace.yaml` and root workspace definitions.
- [ ] **Move Folders**: Rename `artifacts/gtu-pyq` to `frontend` and `artifacts/api-server` to `backend`.
- [ ] **Flatten API Libraries**:
  - Move `lib/api-client-react/src` contents to `frontend/src/api`.
  - Move `lib/api-zod/src` contents to `backend/src/api`.
  - Move `lib/api-spec/openapi.yaml` to `backend/openapi.yaml`.
- [ ] **Update Imports**: Update all `@workspace/*` imports in `frontend` and `backend` to use relative paths.
- [ ] **Clean Dependencies**: Remove Replit Vite plugins and workspace dependencies from `package.json` and `vite.config.ts`.
- [ ] **Verify Builds**: Run `npm install` and build scripts independently in `frontend/` and `backend/` to ensure they compile without workspace symlinks.
