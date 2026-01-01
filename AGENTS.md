# Repository Guidelines

## Project Structure

- `app/`: Next.js App Router entrypoints (`layout.tsx`, `page.tsx`) and global styles (`globals.css`).
- `components/`: Page sections (e.g., `hero.tsx`, `features.tsx`) and shared providers.
- `components/ui/`: shadcn/ui-style primitives (buttons, dialogs, form controls, etc.).
- `hooks/`: Shared React hooks (e.g., `use-toast.ts`).
- `lib/`: Small utilities (e.g., `utils.ts` with `cn()`).
- `public/`: Static assets (icons and images).
- `styles/`: Additional/legacy global styling (prefer `app/globals.css` unless a page explicitly imports `styles/`).
- Config: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json`.

## Build, Test, and Development Commands

This repo uses Next.js + TypeScript and a `pnpm-lock.yaml` (prefer pnpm).

- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the dev server (default: `http://localhost:3000`).
- `pnpm build`: Production build.
- `pnpm start`: Run the production server (after `pnpm build`).
- `pnpm lint`: Lint the repo (note: `eslint` is not currently installed; add tooling or update the script if linting is required).

## Coding Style & Naming Conventions

- TypeScript + React components in `.tsx`; keep server/client boundaries explicit (`"use client"` only where needed).
- Indentation: 2 spaces; avoid semicolons unless the surrounding file uses them.
- Naming:
  - React components: `PascalCase` exports (`export function Hero()`).
  - Hooks: `useX` (e.g., `useToast`).
  - Files: `kebab-case.tsx` for UI primitives; match existing patterns in the folder you edit.
- Imports: Prefer path aliases from `tsconfig.json` (e.g., `@/components/...`).

## Testing Guidelines

No automated test runner is configured in this repository snapshot. If you add tests, document the framework and add a `pnpm test` script.

## Commit & Pull Request Guidelines

This copy does not include a `.git/` directory, so commit conventions can’t be inferred. Recommended:

- Commits: Conventional Commits (e.g., `feat: add pricing section`, `fix: correct CTA link`).
- PRs: Include a clear description, screenshots for UI changes, and steps to verify (`pnpm dev` / `pnpm build`).

## Configuration Tips

- No environment variables are required for local development.
- The “Generator” UI is currently client-side and mocked; integrate an API route/server only if needed.
