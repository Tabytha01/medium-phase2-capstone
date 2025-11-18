# Agent Instructions for Medium Clone Project

## Commands

### Development
- `npm run dev` - Start development server on port 3000
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
├── hooks/                 # Custom React hooks
└── styles/               # Additional styles
```

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: Jodit React
- **HTTP Client**: Axios

## Environment Variables

Required in `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

## Coding Conventions

- Use TypeScript for all new files
- Follow existing component patterns (client/server components)
- Use Tailwind CSS for styling
- Forms must use React Hook Form with Zod validation
- API calls should go through the `lib/api` directory
- Protected routes must use the `ProtectedRoute` component
- Use React Query for server state management

## Labs Completed

✅ **Lab 1**: Project Setup & Routing
- Next.js project initialized with TypeScript
- Folder structure established
- Global layout, header, footer, and navigation implemented

✅ **Lab 2**: Authentication & User Profiles
- NextAuth configured with credentials provider
- Signup and login pages with validation
- Protected routes implemented
- User profile page created

✅ **Lab 3**: Editor & Rich Content
- Jodit Editor integrated
- Image upload with base64 conversion (ready for Cloudinary)
- Draft and publish workflow
- Preview mode for posts

## Next Steps

Continue with:
- Lab 4: Posts CRUD & Media Handling
- Lab 5: Feeds, Tags, and Search
- Lab 6: Comments, Reactions & Social Features
- Lab 7-10: Advanced features, testing, and deployment
