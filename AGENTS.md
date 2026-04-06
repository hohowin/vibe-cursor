# AGENTS.md - Coding Guidelines for Vibe Cursor

## Project Overview

This is a Next.js 16 application with:
- **Framework**: Next.js 16.1.6 with App Router
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Auth**: Clerk Authentication
- **UI**: shadcn/ui with Tailwind CSS 4 and Radix UI
- **Language**: TypeScript (strict mode)

## Build/Lint/Test Commands

### Development
```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### Database Commands
```bash
npm run db:generate   # Generate Drizzle migrations
npm run db:push       # Push schema changes to database
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database with initial data
```

### Environment Setup
Create a `.env` file with:
```
DATABASE_URL=postgresql://user:password@host/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Code Style Guidelines

### TypeScript
- **Strict mode enabled**: All TypeScript strict checks are enforced
- Use explicit types for function parameters and return values when not obvious
- Prefer `type` over `interface` for simple type definitions
- Use `$Infer` types from Drizzle for database schema inference

### Naming Conventions
- **Files**: kebab-case for utilities (`utils.ts`), PascalCase for components (`Button.tsx`)
- **Variables/Functions**: camelCase (`createItem`, `userData`)
- **Constants**: SCREAMING_SNAKE_CASE for truly constant values
- **Database tables**: snake_case in DB, camelCase in TypeScript exports (`decks`, `cards`)
- **React components**: PascalCase filenames and exports

### Imports
- Use path aliases (`@/` maps to `./src/`)
- Order: React/next imports → external packages → internal aliases → relative imports
- Prefer named exports over default exports for utilities
- Use default exports for page components only

### React Patterns
- Use Server Components by default; add `"use client"` only when necessary
- Prefer async/await over `.then()` chains
- Use `useTransition` for server action state management in client components

### Data Access Rules

**Reads**: Must happen in server-only contexts (server components, route handlers)
```typescript
// ✅ Valid: read in server component
import { db } from "@/db";
import { items } from "@/db/schema";

export default async function Page() {
  const data = await db.select().from(items);
}
```

**Writes**: Must use Server Actions invoked from client
```typescript
// ✅ Valid: write via server action
"use server";
export async function createItem(input: { name: string }) {
  await db.insert(items).values(input);
}
```

### Authentication (Clerk)
- Always use Clerk helpers (`auth()`, `currentUser()`) - never accept user identity from client
- Scope all queries by Clerk user ID: `where(eq(table.userId, clerkUserId))`
- Never trust client input for identity fields
- Authorization checks must run server-side

### Database (Drizzle)
- Use Drizzle query builder exclusively (no raw SQL in feature code)
- Import schema from `@/db/schema`
- Use `eq`, `and`, `or` for conditions from `drizzle-orm`
- New features should design data access with Drizzle from the start

### UI Components (shadcn/ui)
- Use shadcn/ui components as the default for UI elements
- Install new components: `npx shadcn@latest add <component-name>`
- Initialize shadcn if needed: `npx shadcn@latest init`

### Error Handling
- Use try/catch with async functions
- Log errors with descriptive messages
- Exit with `process.exit(1)` for fatal script errors
- Return appropriate HTTP status codes in API routes (401, 404, etc.)

### Styling
- Use Tailwind CSS utility classes exclusively
- Use CSS variables from `globals.css` for theme values
- Dark mode via `dark:` prefix and `className="dark"` on `<html>`
- Use `cn()` utility for conditional classes (clsx + tailwind-merge)

### File Structure
```
src/
├── app/              # Next.js App Router (layouts, pages, API routes)
├── components/ui/    # shadcn/ui components
├── db/               # Drizzle schema and database utilities
├── lib/              # Utilities and helpers
└── proxy.ts          # Clerk middleware
```

## Cursor Rules

This project includes Cursor AI rules (see `.cursor/rules/`). These are automatically applied:
- **data-access-server.mdc**: Server component and server action patterns
- **auth-clerk.mdc**: Clerk authentication and authorization patterns
- **database-drizzle.mdc**: Drizzle ORM usage patterns
- **shadcn-ui.mdc**: shadcn/ui component patterns
