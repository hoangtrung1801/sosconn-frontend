# Suggested Commands

## Development Commands
- `pnpm dev` - Start development server (runs on port 3000)
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint to check code quality

## Package Management
- `pnpm install` - Install dependencies (project uses pnpm)
- `pnpm add <package>` - Add new dependency
- `pnpm add -D <package>` - Add development dependency

## Quality Assurance
- `pnpm lint` - Check code with ESLint
- `tsc --noEmit` - Type check without building (if needed manually)

## Git Commands (macOS)
- `git status` - Check repository status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote

## System Commands (macOS)
- `ls` - List directory contents
- `cd <directory>` - Change directory
- `pwd` - Show current directory
- `grep -r "pattern" .` - Search for patterns in files
- `find . -name "*.tsx"` - Find files by pattern

## Development Workflow
1. Run `pnpm dev` to start development server
2. Make changes to code
3. Run `pnpm lint` to check for issues
4. Run `pnpm build` to ensure production build works
5. Test in browser at http://localhost:3000

## Notes
- Project uses **pnpm** as package manager (not npm or yarn)
- Development server runs on port 3000
- TypeScript compilation is included in build process
- ESLint is configured for both TS and React