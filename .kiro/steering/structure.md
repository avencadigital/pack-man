# Project Structure & Organization

## Root Directory Structure
```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── api/            # API route handlers
│   │   ├── analyze-packages/  # Package analysis endpoint
│   │   └── health/     # Health check endpoint
│   ├── package/        # Package analysis pages
│   │   └── [registry]/[name]/  # Dynamic package detail pages
│   ├── globals.css     # Global styles and CSS variables
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page
│   ├── opengraph-image.tsx  # Dynamic OG image generation
│   └── sitemap.ts      # Sitemap generation
├── components/          # Reusable React components
│   ├── debug/          # Debug utilities (GitHubDebug)
│   ├── package-checker/ # Package analysis specific components
│   │   └── update-packages/  # Update packages sub-components
│   ├── roadmap/        # Roadmap feature components
│   ├── theme/          # Theme-related components
│   ├── ui/             # shadcn/ui base components
│   └── *.tsx           # Shared layout components (Footer, Navigation, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
│   ├── formatters/     # Data formatting utilities
│   ├── generators/     # Update command generators
│   │   └── strategies/ # Package manager specific strategies
│   ├── package/        # Package-related utilities
│   └── parsers/        # File parsers (package.json, requirements.txt, pubspec.yaml)
│       └── __tests__/  # Parser unit tests
├── types/              # TypeScript type definitions
├── utils/              # Helper utilities
│   └── __tests__/      # Utility unit tests
├── constants/          # Application constants
└── test/               # Test setup and configuration
```

## Architecture Patterns

### Component Organization
- **Feature-based grouping**: Components grouped by functionality (package-checker/, roadmap/)
- **Shared UI components**: Base components in ui/ directory following shadcn/ui patterns
- **Layout components**: Top-level shared components (Footer, Hero) in components root

### File Naming Conventions
- **Components**: PascalCase for component files (Footer.tsx, ModernHero.tsx)
- **Hooks**: kebab-case with "use-" prefix (use-package-analysis.ts)
- **Utilities**: kebab-case (package-utils.ts, roadmap-utils.ts)
- **Types**: Singular nouns (package.ts, roadmap.ts)

### Import Patterns
- Use path aliases: `@/components`, `@/lib`, `@/hooks`, `@/types`
- Absolute imports preferred over relative imports
- Group imports: external libraries first, then internal modules

### State Management
- **Local state**: React useState/useReducer for component-specific state
- **Form state**: React Hook Form for form handling

### API Structure
- API routes in `src/app/api/` following Next.js App Router conventions
- Service functions in `src/lib/` for external API integrations
- Type definitions for API responses in `src/types/`

## Extensions Structure

### Chrome Extension (`chrome-extension/`)
```
chrome-extension/
├── icons/              # Extension icons (16x16, 48x48, 128x128)
├── background.js       # Service worker for background tasks
├── content.js          # Content script injected into GitHub pages
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic and GitHub token management
├── styles.css          # Extension-specific styles
├── manifest.json       # Chrome extension manifest (v3)
└── *.md               # Documentation (README, guides, release notes)
```

**Architecture:**
- **Manifest V3**: Uses service worker instead of background pages
- **Content Script**: Detects GitHub repositories and injects analysis UI
- **Background Worker**: Handles API requests, caching, and token management
- **Storage API**: Persists GitHub tokens and API endpoint configuration
- **Message Passing**: Communication between content script and background worker

**Key Files:**
- `manifest.json`: Extension configuration, permissions, and content script rules
- `background.js`: Cache management, API calls, retry logic, error handling
- `content.js`: DOM manipulation, repository detection, badge injection
- `popup.js`: Token configuration UI, API endpoint settings, validation

### VS Code Extension (`vscode-extension/`) - Planned
```
vscode-extension/
├── src/
│   ├── extension.ts        # Extension entry point
│   ├── providers/          # CodeLens, Hover, and Diagnostic providers
│   ├── commands/           # Command implementations
│   ├── services/           # API integration and caching
│   ├── ui/                 # Webview panels and UI components
│   └── utils/              # Helper functions
├── resources/              # Icons and assets
├── package.json            # Extension manifest and dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md              # Extension documentation
```

**Planned Architecture:**
- **Language Server Protocol**: For real-time diagnostics
- **CodeLens Provider**: Inline update indicators above dependencies
- **Hover Provider**: Detailed package information on hover
- **Command Palette**: Quick actions for dependency management
- **Status Bar**: Project-wide dependency health indicator
- **Webview Panels**: Rich UI for detailed analysis results
- **File System Watcher**: Auto-analysis on package file changes

**Integration Points:**
- Shared API endpoint with web app and Chrome extension
- Reusable parsers from `src/lib/parsers/`
- Common type definitions from `src/types/`
- Consistent caching strategy across platforms