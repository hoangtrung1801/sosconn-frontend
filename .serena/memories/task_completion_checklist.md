# Task Completion Checklist

## When a Development Task is Completed

### 1. Code Quality Checks
- [ ] Run `pnpm lint` to check for ESLint errors
- [ ] Fix any linting errors or warnings
- [ ] Ensure TypeScript compilation passes (included in build)

### 2. Build Verification  
- [ ] Run `pnpm build` to verify production build works
- [ ] Check that no TypeScript errors occur during build
- [ ] Verify that all imports and dependencies resolve correctly

### 3. Functionality Testing
- [ ] Test the feature/fix in development mode (`pnpm dev`)
- [ ] Test in different viewports (mobile/desktop) if UI-related
- [ ] Test PWA functionality if offline features are affected
- [ ] Test internationalization if text changes are made

### 4. Code Review Checklist
- [ ] Follow established naming conventions
- [ ] Use proper TypeScript types
- [ ] Implement responsive design patterns
- [ ] Use existing utility functions and components
- [ ] Add proper error handling where needed
- [ ] Update relevant type definitions if needed

### 5. Git Workflow (if committing)
- [ ] Stage relevant changes only
- [ ] Write clear, descriptive commit messages
- [ ] Ensure no sensitive data is committed
- [ ] Verify .env files are not committed

### 6. Documentation (if applicable)
- [ ] Update README.md if new features are added
- [ ] Update component documentation if API changes
- [ ] Add/update TypeScript interfaces for new data structures

## Common Issues to Check
- **Import errors**: Ensure all imports use correct paths and aliases
- **TypeScript errors**: Check for any type mismatches or missing types
- **Tailwind classes**: Verify custom classes are properly configured
- **React hooks**: Ensure hooks follow rules of hooks
- **Accessibility**: Basic accessibility for new UI components
- **Performance**: Avoid unnecessary re-renders or heavy computations

## Quality Gates
- ✅ `pnpm lint` passes without errors
- ✅ `pnpm build` completes successfully  
- ✅ Application runs without console errors
- ✅ New functionality works as expected
- ✅ No regressions in existing functionality