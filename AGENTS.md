# AGENTS.md - Coding Agent Guide

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes TypeScript check)
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build
- `tsc --noEmit` - Type check only (manual)
- **No test framework configured** - check with maintainers if tests needed

## Code Style
- **TypeScript** with strict typing, React 19 RC, functional components with hooks
- **Formatting**: Prettier (2 spaces, no tabs), ESLint with TypeScript rules
- **Imports**: External first, then `@/` alias imports, CSS last
- **Files**: kebab-case, Components: PascalCase, functions: camelCase
- **Types**: Use `type` for shapes, `interface` for extensible contracts, `.type.ts` suffix

## Architecture
- **Structure**: `@/` → `src/`, components in `components/ui/`, utils in `lib/`
- **Components**: Use `forwardRef`, CVA for variants, `cn()` for class merging
- **State**: Zustand store, React Query for server state
- **Routing**: TanStack Router with file-based routing
- **Styling**: Tailwind CSS with HSL theme variables, dark mode support

## Package Management
- Uses **pnpm** (not npm/yarn) - always use pnpm commands