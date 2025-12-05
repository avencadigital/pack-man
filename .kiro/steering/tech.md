# Technology Stack & Build System

## Core Framework
- **Next.js ^16** with App Router - React framework for production
- **TypeScript ^5** - Type-safe JavaScript with strict configuration
- **React ^19** - Latest React with concurrent features

## Styling & UI
- **Tailwind CSS ^4** - Utility-first CSS framework with CSS variables
- **shadcn/ui** - High-quality components built on Radix UI (New York style)
- **Lucide React** - Icon library
- **next-themes** - Dark/light mode support
- **Recharts** - Chart library for data visualization
- **Sonner** - Toast notifications

## State Management & Data
- **React Hook Form ^7** - Form handling with validation
- **Axios** - HTTP client for API requests
- **p-limit** - Concurrency control for async operations

## Additional Libraries
- **semver ^7** - Semantic version parsing and comparison
- **next-intl ^4** - Internationalization support
- **@vercel/analytics** - Analytics integration
- **@vercel/speed-insights** - Performance monitoring

## Development Tools
- **ESLint ^9** - Linting with relaxed rules for rapid development
- **Vitest ^4** - Unit testing framework
- **TypeScript** - Configured with path aliases (@/* -> ./src/*)

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once

# Package Management
npm install          # Install dependencies
```

## Extensions Technology

### Chrome Extension
- **Manifest V3** - Latest Chrome extension platform
- **Vanilla JavaScript** - No build step required for rapid development
- **Chrome Storage API** - Token and settings persistence
- **Service Workers** - Background task handling
- **Content Scripts** - GitHub page integration

### VS Code Extension (Planned)
- **TypeScript** - Type-safe extension development
- **VS Code Extension API** - Native IDE integration
- **Language Server Protocol** - Real-time diagnostics
- **Webview API** - Rich UI components
- **vsce** - Extension packaging and publishing

## Key Configuration Notes
- TypeScript build errors are ignored in production builds
- ESLint rules are relaxed (most warnings disabled)
- CSS variables used for theming with HSL color system
- Path aliases configured: @/* maps to ./src/*
- shadcn/ui components use "new-york" style variant
- Chrome extension uses Manifest V3 with service workers
- Extensions share API endpoint with web application