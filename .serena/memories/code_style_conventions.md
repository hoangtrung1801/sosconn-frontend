# Code Style and Conventions

## General Style
- **TypeScript** with strict typing
- **ES Modules** (type: "module" in package.json)
- **Functional components** with React hooks
- **React 19 RC** features utilized

## Formatting
- **Prettier** configuration:
  - Tab width: 2 spaces
  - No tabs (spaces only)
  - Automatic formatting

## ESLint Rules
- Uses TypeScript ESLint with recommended rules
- React hooks rules enforced
- React refresh rules for development
- Disabled rules: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-empty-object-type`

## File Structure Conventions
- `@/` alias maps to `src/` directory
- Components in `src/components/`
- UI components in `src/components/ui/`
- Utilities in `src/lib/`
- Types in `src/types/`
- Routes in `src/routes/`

## Component Conventions
- Use `React.forwardRef` for reusable UI components
- Export both component and variants (e.g., `Button`, `buttonVariants`)
- Use Class Variance Authority (CVA) for component variants
- Combine classes with `cn()` utility (clsx + tailwind-merge)
- Props interfaces extend native HTML element props

## Naming Conventions
- **Files**: kebab-case (e.g., `theme-provider.tsx`)
- **Components**: PascalCase (e.g., `ThemeProvider`)
- **Functions/Variables**: camelCase
- **Constants**: camelCase for local, UPPER_SNAKE_CASE for module-level
- **Types**: PascalCase with `.type.ts` suffix

## Import Organization
- External imports first
- Internal imports with `@/` alias
- CSS imports last

## TypeScript Patterns
- Use `type` for object shapes, `interface` for extensible contracts
- Extend HTML element props for component props
- Use `VariantProps` from CVA for component variant types

## Tailwind CSS Usage
- Use utility classes primarily
- Custom CSS variables for theming (HSL format)
- Dark mode support with class strategy
- Responsive design patterns