# WorkerDir

A modern service marketplace platform connecting customers with verified service workers. Built with Next.js 15, Supabase, and shadcn/ui.

## Overview

WorkerDir is a comprehensive platform that enables customers to discover, book, and manage appointments with professional service workers including plumbers, electricians, cleaners, and more. The platform features real-time messaging, secure authentication, and an intuitive booking system.

## Features

- **Service Discovery** - Search and filter verified service workers by category, location, and ratings
- **Secure Authentication** - Email/password authentication powered by Supabase
- **Worker Profiles** - Detailed profiles with ratings, reviews, and service offerings
- **Booking System** - Real-time booking with calendar availability
- **Messaging** - In-app messaging between customers and workers
- **Worker Dashboard** - Comprehensive dashboard for service providers to manage bookings
- **User Profiles** - Customizable profiles for both customers and workers
- **Dark Mode** - Full dark/light theme support
- **Responsive Design** - Mobile-first responsive UI

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **React**: 19.1.0
- **Language**: TypeScript 5
- **Styling**: [Tailwind CSS 4.1.9](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Backend**: [Supabase](https://supabase.com/) (Authentication & Database)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun
- Supabase account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workers-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

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
  utils.ts             - Utility functions

middleware.ts          - Next.js middleware for auth
```

## Authentication

The application uses Supabase for authentication with cookie-based session management.

### Protected Routes

The following routes require authentication:
- `/dashboard` - Worker dashboard
- `/bookings` - Booking management
- `/messages` - Messaging system
- `/settings` - User settings
- `/profile` - User profile

Unauthenticated users are automatically redirected to `/login`.

### Client vs Server Authentication

```typescript
// Client Component
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

// Server Component / Server Action
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient()
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components will be automatically added to the `components/ui/` directory.

## Styling

- Global styles: `app/globals.css`
- Theme variables: CSS variables in `:root` and `.dark`
- Component styling: Tailwind CSS with `cn()` utility
- Fonts: Geist Sans and Geist Mono

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com/new)
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

The production server will start on port 3000.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits:
   ```
   feat: add new feature
   fix: resolve bug
   docs: update documentation
   style: format code
   refactor: restructure code
   test: add tests
   chore: update dependencies
   ```
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Guidelines

- Use present tense in main commit message
- Use past tense in commit body
- Wrap code references in backticks in commit body

Example:
```
feat: add error validation for identifier fields

- Integrated `NodeDialogContext` for error handling in `Identifiers` component
- Enhanced `TextField` rendering with error and `helperText` props
```

## License

This project is private and proprietary.

## Support

For issues or questions, please open an issue on GitHub.
