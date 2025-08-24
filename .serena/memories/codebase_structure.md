# Codebase Structure

## Root Directory
```
frontend/
├── public/           # Static assets
├── src/             # Source code
├── dist/            # Built output (generated)
├── node_modules/    # Dependencies (generated)
├── package.json     # Project configuration
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── tailwind.config.js # Tailwind CSS configuration
├── eslint.config.js # ESLint configuration
└── .prettierrc     # Prettier configuration
```

## Source Structure (src/)
```
src/
├── components/      # React components
│   ├── ui/         # Reusable UI components (buttons, cards, etc.)
│   ├── home/       # Page-specific components
│   └── [shared]    # Shared components (theme-provider, etc.)
├── routes/         # TanStack Router route definitions
├── lib/            # Utilities and configurations
│   ├── api/        # API client functions
│   ├── queries/    # TanStack Query hooks
│   └── services/   # Service layer functions
├── hooks/          # Custom React hooks
├── store/          # Zustand store definitions
├── types/          # TypeScript type definitions
├── constants/      # Application constants
├── config/         # Application configuration
├── main.tsx        # Application entry point
├── App.tsx         # Main App component
└── index.css       # Global styles
```

## Key Architecture Patterns
- **Component-based**: UI built with reusable React components
- **Route-based**: Pages defined in routes/ using TanStack Router
- **Service layer**: API calls abstracted in lib/api/
- **Custom hooks**: Reusable logic in hooks/
- **Global state**: Managed with Zustand in store/
- **Type safety**: Comprehensive TypeScript types in types/

## Component Organization
- **UI Components**: Generic, reusable components in `components/ui/`
- **Feature Components**: Feature-specific components in `components/{feature}/`
- **Page Components**: Route components in `routes/`
- **Layout Components**: Layout-related components at component root

## Configuration Files
- **Vite**: Build tool config with React, TanStack Router, PWA plugins
- **TypeScript**: Path mapping with `@/*` alias to `src/*`
- **Tailwind**: Extended theme with custom colors and utilities
- **ESLint**: TypeScript + React rules with custom overrides