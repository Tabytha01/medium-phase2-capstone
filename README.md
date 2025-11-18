# # Medium Clone - Publishing Platform

A full-featured publishing platform inspired by Medium, built with Next.js, React, TypeScript, and Tailwind CSS.

## Features Implemented (Labs 1-3)

### ✅ Lab 1: Project Setup & Routing
- Next.js 16 with App Router and TypeScript
- Clean folder structure with organized components
- Responsive layout with Header and Footer
- Navigation with active link highlighting
- Tailwind CSS for styling
- ESLint and Prettier configured

### ✅ Lab 2: Authentication & User Profiles
- NextAuth.js integration with credentials provider
- Signup and login pages with form validation (React Hook Form + Zod)
- Protected routes with client-side guards
- User profile page with avatar and stats
- Session management with JWT
- Dynamic header showing auth state

### ✅ Lab 3: Editor & Rich Content
- Jodit rich text editor integration
- Support for bold, italic, headings, lists, links, images
- Image upload with base64 conversion (Cloudinary-ready)
- Draft and publish workflow
- Preview mode for posts before publishing
- Tag management for posts
- Cover image support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: Jodit React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medium-phase2-capstone
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your configuration:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── auth/         # NextAuth configuration
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── profile/          # User profile page
│   ├── write/            # Editor page
│   ├── explore/          # Explore posts page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   ├── Editor.tsx        # Rich text editor (Jodit)
│   ├── ProtectedRoute.tsx # Auth guard component
│   └── Providers.tsx     # Context providers
├── lib/                   # Utilities and helpers
│   ├── api/              # API client functions
│   ├── types/            # TypeScript types
│   ├── validations/      # Zod schemas
│   ├── auth.ts           # Auth utilities
│   └── cloudinary.ts     # Image upload helpers
├── types/                 # Global TypeScript declarations
└── hooks/                 # Custom React hooks
```

## Key Features

### Authentication
- Secure signup and login with form validation
- Session-based authentication using NextAuth.js
- Protected routes that require authentication
- Dynamic navigation based on auth state

### Rich Text Editor
- Full-featured WYSIWYG editor
- Image upload support
- Tag management
- Draft/publish workflow
- Preview mode

### User Experience
- Responsive design with Tailwind CSS
- Dark mode support
- Loading states and error handling
- Optimistic UI updates

## Backend API Requirements

The application expects the following API endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `GET /api/posts/my-posts` - Get user's posts

## Next Steps

Continue with the remaining labs:
- **Lab 4**: Posts CRUD & Media Handling
- **Lab 5**: Feeds, Tags, and Search
- **Lab 6**: Comments, Reactions & Social Features
- **Lab 7**: State Management & Data Fetching
- **Lab 8**: TypeScript & Quality
- **Lab 9**: SEO, Performance & SSG/SSR
- **Lab 10**: Deployment & Observability

## License

MIT