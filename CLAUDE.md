# hackaton-project

## Stack
Next.js (App Router), TypeScript, Tailwind 4, shadcn/ui, pnpm

## Architecture Rules

### Folder Structure
- `app/` - ONLY routes, layouts, loading, error. Zero business logic
- `components/ui/` - Managed by shadcn CLI. NEVER create/edit manually
- `components/shared/` - Reusable components, ALWAYS composed from ui/
- `features/<name>/` - Self-contained: components/, hooks/, lib/, types/
- `lib/` - Pure functions, clients, configs. No React components
- `hooks/` - Global hooks. Feature hooks live in features/<name>/hooks/
- `types/` - Types shared between features

### Component Rules
- Every visual component MUST use primitives from components/ui/
- NEVER use native <button>, <input>, <select> - use shadcn
- Add new ui components: `pnpm dlx shadcn@latest add <name>`
- Components MUST be reusable. Extract when used 2+ times
- Props typed with interfaces, never any

### Code Rules
- Path aliases: use @/ for all imports (never ../../../)
- Exports: named exports only (never default export except pages)
- Server Components by default. Use "use client" only when necessary
- Pure functions in lib/. Side effects isolated in hooks

### Commit Messages (Conventional Commits)
- Format: `<type>(<scope>): <description>`
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Scope is optional but recommended (e.g., `feat(auth): add login page`)
- Description: imperative mood, lowercase, no period at end
- Breaking changes: add `!` after type/scope (e.g., `feat!: remove legacy API`)
- Use `pnpm commit` for interactive commit wizard (commitizen)

## Required Skills
- USE superpowers:brainstorming BEFORE creating any new feature
- USE frontend-design when creating visual components and pages
- USE superpowers:writing-plans for features touching more than 2 files
- USE superpowers:verification-before-completion before declaring tasks done

## Commands
- `pnpm dev` - dev server
- `pnpm build` - production build
- `pnpm lint` - ESLint
- `pnpm format` - Prettier
- `pnpm commit` - interactive commit (commitizen)
