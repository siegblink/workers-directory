<div align="center">

# Direktory

### Your trusted marketplace for professional service workers

**Connecting customers with verified plumbers, electricians, cleaners, and more.**

Built with Next.js 16 · Supabase · shadcn/ui

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#installation) • [Documentation](#project-structure)

</div>

---

## Overview

**Direktory** is a modern, full-featured service marketplace that empowers customers to discover, book, and manage appointments with professional service workers. Whether you need a plumber, electrician, cleaner, or any other service professional, Direktory provides a seamless experience with real-time messaging, secure authentication, and an intuitive booking system.

## Features

### For Customers

- **Smart Service Discovery** - Search and filter verified service workers by category, location, and ratings
- **Seamless Booking** - Real-time booking with calendar availability and instant confirmations
- **Direct Messaging** - In-app messaging to communicate with service providers
- **Review & Rate** - Share your experience and help others make informed decisions

### For Service Workers

- **Professional Dashboard** - Comprehensive dashboard to manage bookings, schedules, and earnings
- **Profile Showcase** - Build your reputation with detailed profiles, ratings, and reviews
- **Flexible Availability** - Set your own schedule and pricing
- **Customer Management** - Track bookings and communicate with clients efficiently

### Platform Features

- **Secure Authentication** - Email/password authentication powered by Supabase
- **Dark Mode** - Beautiful dark/light theme support for comfortable viewing
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Real-time Updates** - Stay informed with instant notifications and updates

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **React**: 19.2.3
- **Language**: TypeScript 5
- **Styling**: [Tailwind CSS 4.1.9](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Backend**: [Supabase](https://supabase.com/) (Authentication & Database)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## Prerequisites

- **Bun** (official package manager for this project)
- Node.js 18+ (alternative)
- Supabase account (for backend services)

## Installation

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd direktory
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   > **Note:** Never commit your `.env.local` file. It's already included in `.gitignore`.

4. **Run the development server**

   ```bash
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

🎉 You're all set! The app should now be running locally.

## Development Commands

```bash
bun dev              # Start development server
bun run build        # Build production bundle
bun start            # Start production server
bun format:write     # Format code and fix linting issues
```

## Project Structure

```
/app                    - Next.js App Router pages
  /login               - Authentication pages
  /signup
  /forgot-password     - Password recovery
  /reset-password      - Password reset
  /dashboard           - Worker dashboard (protected)
  /profile             - User profile (protected)
  /bookings            - Booking management (protected)
  /messages            - Messaging system (protected)
  /settings            - User settings (protected)
  /search              - Service search
  /worker              - Worker profile pages
  /become-worker       - Worker registration
  /help                - Help/support pages
  /credits             - Credits/payment
  /terms               - Terms of service
  /privacy             - Privacy policy

/components
  /ui                  - shadcn/ui components
  /profile             - Profile editing (header, gallery, about, availability, testimonials)
  /worker              - Worker profile display components
  navigation.tsx       - Main navigation component
  footer.tsx           - Footer component
  theme-provider.tsx   - Theme context provider
  theme-toggle.tsx     - Dark/light mode toggle
  booking-modal.tsx    - Booking dialog component
  compact-filter-panel.tsx - Search filter panel
  more-filters-dialog.tsx  - Extended filters dialog

/lib
  /supabase
    client.ts          - Supabase browser client
    server.ts          - Supabase server client
    middleware.ts      - Supabase session management
  /database            - Database query utilities
  /schemas             - Zod validation schemas
  utils.ts             - Utility functions

proxy.ts               - Next.js 16 proxy for auth
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
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Server Component / Server Action
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
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

| Variable                        | Description            | Required |
| ------------------------------- | ---------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes      |

## Deployment

### Vercel (Recommended)

**Direktory** is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com/new)
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy with one click

Vercel will automatically detect Next.js and configure the build settings.

### Manual Deployment

```bash
bun run build
bun start
```

The production server will start on port 3000.

## Contributing

We welcome contributions to **Direktory**! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and ensure code quality
   ```bash
   bun format:write  # Format and lint your code
   ```
4. **Commit your changes** using conventional commits
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request** with a clear description

### Commit Message Convention

Follow the conventional commits specification:

```
<type>: <description>

[optional body]
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style/formatting changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or dependency updates

**Example:**

```
feat: add error validation for identifier fields

- Integrated `NodeDialogContext` for error handling in `Identifiers` component
- Enhanced `TextField` rendering with error and `helperText` props
```

**Guidelines:**

- Use present tense in the commit message ("add" not "added")
- Use past tense in the commit body when describing what changed
- Wrap code references in backticks

## License

This project is private and proprietary.

## Support

Have questions or found a bug?

- **Issues**: Open an issue on GitHub
- **Documentation**: See [CLAUDE.md](./CLAUDE.md) for development guidelines
- **Questions**: Check existing issues or create a new one

## Acknowledgments

Built with love using:

- [Next.js](https://nextjs.org/) - The React Framework for the Web
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

---

<div align="center">

**Direktory** - Connecting professionals with those who need them

Made with ❤️ by the Direktory team

</div>
