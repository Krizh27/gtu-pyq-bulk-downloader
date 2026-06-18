# TypeScript to JavaScript Migration Report

This document tracks the incremental removal of TypeScript from the GTU PYQ project, aimed at making the codebase accessible to a student learning JavaScript.

## Removed Features

### 1. Build Tools (esbuild, tsc)
**Why removed**: Modern Node.js natively supports ES Modules. Bundling/compiling the backend with `esbuild` added a complex layer of configuration. Removing it simplifies the `npm start` flow to a native `node src/index.js` command.

### 2. Type Annotations & Interfaces
**Why removed**: Explicit types (e.g., `req: Request, res: Response`) and `interface` declarations act as blockers for someone who only understands JavaScript.
**Replacement**: Clear JSDoc comments (`/** @type {...} */`) are used instead, providing similar intellisense without the strict compilation barrier.

### 3. Zod Type Inference (`z.infer`)
**Why removed**: Extracting types from Zod schemas uses complex TypeScript utilities. 
**Replacement**: The Zod schemas themselves remain to provide robust runtime validation, but the exported types are replaced with simple JSDoc object shape descriptions.

### 4. Orval React Query Types (Frontend)
**Why removed**: Auto-generated API hooks are robust but contain nested generics (`useQuery<TData, TError>`) which are unintelligible to beginners.
**Replacement**: Simplified `.js` hooks with JSDoc outlining exactly what data is passed and returned.

*Migration ongoing...*
