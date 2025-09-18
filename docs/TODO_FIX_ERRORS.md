# Fix TypeScript Errors - Phase 1

## 1. NextAuth Import Issues
- [ ] Fix `getServerSession` import in multiple files
- [ ] Fix `NextAuthOptions` import in auth-options files
- [ ] Fix `NextAuth` function call in auth route files

## 2. Session User Type Issues
- [ ] Define proper session type with user property
- [ ] Update all API routes using session.user to handle undefined user
- [ ] Add proper type guards for session.user access

## 3. Next.js 15 Route Parameter Issues
- [ ] Update dynamic route handlers to handle Promise-based params
- [ ] Fix GET handlers in documents/[id], employees/[id], leaves/[id], payroll/[id]

## 4. Agent Task Type Mismatches
- [ ] Align AgentTaskType definitions between lib/ai-agents.ts and types/ai-agents.ts
- [ ] Fix type casting issues in ai/dispatch/route.ts
- [ ] Update test files to use correct AgentTaskType

## 5. Prisma Type Issues
- [ ] Fix user.id type mismatch (string vs number)
- [ ] Fix employee queries with correct ID types

## 6. Component Type Issues
- [ ] Fix session.user property access in React components
- [ ] Add proper null checks for session.user

## 7. Test File Issues
- [ ] Fix mock setup for Prisma and NextAuth
- [ ] Update test expectations to match new AgentResponse structure

## 8. Build Error in /api/cb
- [ ] Fix the runtime error causing build failure
- [ ] Ensure all dependencies are properly imported
