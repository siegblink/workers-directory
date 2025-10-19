# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorkerDir is a service marketplace platform built with Next.js 15, connecting customers with verified service workers (plumbers, electricians, cleaners, etc.). The application uses Supabase for authentication and backend services, and shadcn/ui for the component library.

## Development Commands

### Core Commands
- `npm run dev` or `bun dev` - Start development server on http://localhost:3000
- `npm run build` or `bun run build` - Build production bundle
- `npm start` or `bun start` - Start production server
- `npm run lint` or `bun run lint` - Run ESLint

### Package Management
This project supports both npm and bun. Use whichever is consistent with existing lock files.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **React**: 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (authentication, database)
- **Analytics**: Vercel Analytics

### Project Structure

```
/app                    - Next.js App Router pages
  /login               - Authentication pages
  /signup
  /dashboard           - Worker dashboard (protected)
  /profile             - User profile (protected)
  /bookings            - Booking management (protected)
  /messages            - Messaging system (protected)
  /settings            - User settings (protected)
  /search              - Service search
  /worker              - Worker profile pages
  /become-worker       - Worker registration
  /help                - Help/support pages
  globals.css          - Global styles and CSS variables
  layout.tsx           - Root layout with Navigation, Footer, ThemeProvider
  page.tsx             - Homepage

/components
  /ui                  - shadcn/ui components
  navigation.tsx       - Main navigation component
  footer.tsx           - Footer component
  theme-provider.tsx   - Theme context provider
  theme-toggle.tsx     - Dark/light mode toggle
  booking-modal.tsx    - Booking dialog component

/lib
  /supabase
    client.ts          - Supabase browser client
    server.ts          - Supabase server client
    middleware.ts      - Supabase session management
  utils.ts             - Utility functions (cn, etc.)

middleware.ts          - Next.js middleware for auth
```

### Authentication & Protected Routes

The application uses Supabase for authentication with cookie-based session management.

**Protected Routes** (require authentication):
- `/dashboard` - Worker dashboard
- `/bookings` - Booking management
- `/messages` - Messaging system
- `/settings` - User settings
- `/profile` - User profile

**Middleware Flow**:
1. `middleware.ts` calls `updateSession()` from `lib/supabase/middleware.ts`
2. Session is validated via `supabase.auth.getUser()`
3. Unauthenticated users are redirected to `/login` for protected routes

**Client vs Server Authentication**:
- **Client-side**: Use `createClient()` from `lib/supabase/client.ts` in Client Components
- **Server-side**: Use `createClient()` from `lib/supabase/server.ts` in Server Components, Server Actions, and Route Handlers
- **Important**: Never store the server client in a global variable (Fluid compute compatibility)

### Styling System

- **CSS Framework**: Tailwind CSS 4 with CSS variables for theming
- **Component Library**: shadcn/ui (New York style)
- **Theme**: Supports dark/light mode via `next-themes`
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`
- **Base Color**: Neutral (defined in `components.json`)

### Path Aliases

```typescript
@/*          -> ./*
@/components -> ./components
@/lib        -> ./lib
@/hooks      -> ./hooks
```

## Key Implementation Patterns

### Client Components
Use `"use client"` directive for:
- Components using React hooks (useState, useEffect, etc.)
- Components using browser APIs
- Interactive UI components
- Supabase client-side authentication

### Server Components (Default)
Prefer Server Components when possible for:
- Static content rendering
- Data fetching
- SEO-critical pages
- Initial page loads

### Authentication Pattern
```typescript
// Client Component
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Server Component / Server Action
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

### Component Pattern with shadcn/ui
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

## Environment Variables

Required environment variables (should be in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Common Tasks

### Adding a New shadcn/ui Component
```bash
npx shadcn@latest add [component-name]
```
Components will be added to `components/ui/` directory.

### Creating a New Protected Page
1. Create page under `/app/[page-name]/page.tsx`
2. Add route to `protectedPaths` array in `lib/supabase/middleware.ts:41`
3. Implement authentication check in the page component if needed

### Working with Forms
Use React Hook Form with Zod for validation:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
```

### Theme Customization
- Global styles: `app/globals.css`
- CSS variables for light/dark themes defined in `:root` and `.dark`
- Use `className` utilities from `lib/utils.ts` (cn function)

## Database & Backend

This project uses Supabase for:
- User authentication (email/password)
- Database (PostgreSQL)
- Real-time subscriptions (potential use)
- Row-level security (RLS)

When working with database operations, always use the appropriate Supabase client (browser vs server).

## Notes

- The app uses React 19 which may have different behavior than React 18
- Next.js 15 uses the App Router exclusively (no Pages Router)
- Server Components are the default; explicitly mark Client Components
- The project includes Vercel Analytics integration
- Forms should use controlled components pattern with proper TypeScript types
- On this project, we always use Bun as our official package manager. We will never use NPM.
- After doing a change, avoid running `bun run lint`, instead, always use `bun format:write` to catch any potential type and lint errors.
- When building a form, always use the newest shadcn best practices by using the newly introduced components: Field, InputGroup, Item, Spinner, etc. The guideline is accessible through this link: https://ui.shadcn.com/docs/forms/react-hook-form