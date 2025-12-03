# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Direktory** is a service marketplace platform built with Next.js 15, connecting customers with verified service workers (plumbers, electricians, cleaners, etc.). The application uses Supabase for authentication and backend services, and shadcn/ui for the component library.

## Development Commands

All commands use **Bun** as the official package manager:

- `bun dev` - Start development server on http://localhost:3000
- `bun run build` - Build production bundle
- `bun start` - Start production server
- `bun format:write` - Format code and fix linting/type errors (use this instead of `bun run lint`)

## Package Management

**Bun is the official package manager for this project.** Always use Bun for installing dependencies and running scripts.

- Install dependencies: `bun install`
- Add a package: `bun add <package-name>`
- Add dev dependency: `bun add -d <package-name>`
- Remove a package: `bun remove <package-name>`

> **Important**: Do not use npm or other package managers. This ensures consistency across the development team.

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
- **Analytics**: Vercel Analytics (integrated for performance monitoring and user insights)

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

## Framework & Runtime Considerations

### React 19
This project uses **React 19**, which includes behavioral changes from React 18:
- Automatic batching improvements
- Enhanced concurrent rendering features
- New hooks and APIs
- Be aware of potential breaking changes when referencing React 18 documentation

### Next.js 15
This project uses **Next.js 15 with App Router exclusively**:
- **No Pages Router**: All routes use the App Router paradigm
- **Server Components by default**: Components are Server Components unless explicitly marked with `"use client"`
- **Always specify `"use client"`** for components that use browser APIs, React hooks, or interactive features
- Nested layouts and loading states are handled via `layout.tsx` and `loading.tsx` files

### Component Rendering Strategy
- **Default**: Server Components (for static content, data fetching, SEO)
- **Client Components**: Use `"use client"` directive when you need:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document, etc.)
  - Event handlers and interactivity
  - Supabase client-side authentication

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

## Security Best Practices

**Never Expose Secret Credentials**

- **NEVER commit secrets to the repository**: API keys, database credentials, private keys, tokens, or any sensitive data must never be committed to version control
- **Use `.env.local` for all secrets**: All sensitive credentials should be stored in `.env.local` (which is gitignored)
- **Keep secrets out of code**: Never hardcode credentials directly in source files
- **Use environment variables**: Always access sensitive data through `process.env.VARIABLE_NAME`
- **Review before committing**: Always check your changes for accidentally exposed credentials before committing
- **Files that commonly contain secrets** (never commit these):
  - `.env.local`
  - `.env.development.local`
  - `.env.production.local`
  - Any config files with API keys or tokens
  - Database connection strings with credentials

**If credentials are accidentally exposed:**
1. Immediately inform the team for urgent discussion
2. Remove them from git history if already committed
3. Update `.gitignore` to prevent future exposure

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

All forms in this project use **React Hook Form** with **Zod** validation and follow specific shadcn/ui patterns consistently used throughout the codebase.

#### Required Imports
```typescript
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
```

#### Form Patterns - MUST Follow These Exactly

**1. Use Controller Pattern (NOT register)**
All form fields MUST use the `Controller` component from React Hook Form. Do NOT use the `register` method.

**2. Form Structure**
- Wrap all fields in `<FieldGroup>`
- Each field must be wrapped in `<Field data-invalid={!!fieldState.error}>`
- Use `<FieldLabel htmlFor="fieldId">` for labels
- Use `<InputGroup>` + `<InputGroupInput>` for all text inputs
- Use `<FieldError>` to display field-level validation errors
- Global errors use `<Alert variant="destructive">`

**3. Text Input Pattern**
```typescript
<Controller
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <Field data-invalid={!!fieldState.error}>
      <FieldLabel htmlFor="email">Email Address</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="email"
          type="email"
          placeholder="you@example.com"
          {...field}
          disabled={form.formState.isSubmitting}
          aria-invalid={!!fieldState.error}
        />
      </InputGroup>
      <FieldError>{fieldState.error?.message}</FieldError>
    </Field>
  )}
/>
```

**4. Password Input Pattern (with show/hide toggle)**
```typescript
const [showPassword, setShowPassword] = useState(false);

<Controller
  control={form.control}
  name="password"
  render={({ field, fieldState }) => (
    <Field data-invalid={!!fieldState.error}>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...field}
          disabled={form.formState.isSubmitting}
          aria-invalid={!!fieldState.error}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setShowPassword(!showPassword)}
            disabled={form.formState.isSubmitting}
            size="icon-sm"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError>{fieldState.error?.message}</FieldError>
    </Field>
  )}
/>
```

**5. Checkbox Pattern (Remember Me, Terms)**
```typescript
<Controller
  control={form.control}
  name="rememberMe"
  render={({ field }) => (
    <Field orientation="horizontal" className="w-fit">
      <Checkbox
        id="rememberMe"
        checked={field.value}
        onCheckedChange={field.onChange}
        disabled={form.formState.isSubmitting}
      />
      <FieldLabel htmlFor="rememberMe">Remember me</FieldLabel>
    </Field>
  )}
/>
```

**6. Submit Button Pattern**
```typescript
<Button
  type="submit"
  className="w-full"
  size="lg"
  disabled={form.formState.isSubmitting}
>
  {form.formState.isSubmitting ? (
    <>
      <Spinner className="mr-2" />
      Loading text...
    </>
  ) : (
    "Normal text"
  )}
</Button>
```

**7. Global Error Display**
```typescript
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

#### Complete Form Example
See `/app/login/page.tsx`, `/app/signup/page.tsx`, `/app/forgot-password/page.tsx`, or `/app/reset-password/page.tsx` for complete working examples.

#### Important Requirements
- ✅ **ALWAYS use Controller**: Never use the `register` method
- ✅ **Disable during submission**: All inputs and buttons must be disabled when `form.formState.isSubmitting` is true
- ✅ **Accessibility**: All inputs must have `aria-invalid={!!fieldState.error}` attribute
- ✅ **Field validation state**: Use `data-invalid={!!fieldState.error}` on Field component
- ✅ **Loading states**: Submit buttons must show Spinner and change text during submission
- ✅ **Password toggles**: Use Eye/EyeOff icons with `tabIndex={-1}` on the toggle button
- ✅ **Horizontal checkboxes**: Use `orientation="horizontal"` for inline checkbox layouts

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