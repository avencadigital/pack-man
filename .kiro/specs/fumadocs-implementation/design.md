# Design Document: Fumadocs Implementation for Pack-Man

## Overview

This design document outlines the implementation of Fumadocs as the documentation framework for Pack-Man. Fumadocs is a modern, feature-rich documentation framework built specifically for Next.js applications using the App Router. The implementation will create a comprehensive documentation site at `/docs` that consolidates all existing documentation, provides powerful search capabilities, and delivers an excellent user experience with responsive design and theme support.

The documentation site will be built as a **completely independent Next.js application** using Fumadocs UI components and Fumadocs MDX for content management. This decoupled architecture allows for future migration to a separate subdomain (docs.packman.com) without any code changes. All existing documentation from the `docs/` folder and `chrome-extension/` documentation files will be migrated and reorganized into a logical structure.

### Installation Approach

The implementation will use the official Fumadocs CLI to bootstrap the documentation application:

```bash
pnpm create fumadocs-app docs-app
```

This will create a new, independent Next.js application with:
- Pre-configured Fumadocs UI and MDX setup
- Optimized Tailwind CSS configuration
- Search functionality with Orama
- TypeScript configuration
- Example content structure

After creation, we'll customize the generated app to:
- Match Pack-Man's branding and theme
- Configure workspace integration
- Set up development proxy for `/docs` route
- Migrate existing documentation content

## Architecture

### High-Level Architecture

The Fumadocs documentation will be implemented as a **completely decoupled module** within the Pack-Man monorepo structure. This design allows for easy migration to a separate subdomain (docs.packman.com) in the future without code changes.

```
Pack-Man Monorepo
├── src/                        # Main Pack-Man application
│   └── app/
│       ├── docs/               # Proxy route to docs app
│       │   └── [[...slug]]/
│       │       └── page.tsx    # Redirects to /docs-app
│       └── ...
├── docs-app/                   # INDEPENDENT Fumadocs application
│   ├── app/
│   │   ├── layout.tsx          # Docs root layout with RootProvider
│   │   ├── page.tsx            # Documentation homepage
│   │   ├── [[...slug]]/
│   │   │   └── page.tsx        # Dynamic documentation pages
│   │   └── api/
│   │       └── search/
│   │           └── route.ts    # Search API endpoint
│   ├── content/
│   │   └── docs/               # MDX documentation files
│   │       ├── index.mdx
│   │       ├── getting-started/
│   │       ├── features/
│   │       ├── extensions/
│   │       ├── api/
│   │       └── guides/
│   ├── components/             # Docs-specific components
│   ├── lib/
│   │   └── source.ts           # Generated source utilities
│   ├── public/                 # Docs-specific assets
│   ├── styles/                 # Docs-specific styles
│   ├── source.config.ts        # Fumadocs content configuration
│   ├── next.config.ts          # Docs-specific Next.js config
│   ├── package.json            # Docs-specific dependencies
│   ├── tsconfig.json           # Docs-specific TypeScript config
│   └── tailwind.config.ts      # Docs-specific Tailwind config
└── package.json                # Root package.json (workspace)
```

### Decoupling Strategy

**Current Setup (Phase 1):**
- Docs accessible at `/docs` via Next.js rewrites
- Fumadocs runs as independent Next.js app on different port (e.g., 3001)
- Main app proxies requests to docs app
- Shared theme configuration via environment variables

**Future Migration (Phase 2):**
- Deploy docs-app to docs.packman.com
- Remove proxy routes from main app
- Update internal links to use subdomain
- Zero code changes in docs-app required

### Deployment Architecture

```
Development:
- Main App: localhost:3000
- Docs App: localhost:3001
- Access: localhost:3000/docs → proxies to localhost:3001

Production (Current):
- Main App: packman.com
- Docs App: packman.com/docs (via rewrites)

Production (Future):
- Main App: packman.com
- Docs App: docs.packman.com (separate deployment)
```

### Workspace Configuration

The project will be configured as a pnpm workspace to manage both applications:

**Root package.json:**
```json
{
  "name": "pack-man-monorepo",
  "private": true,
  "workspaces": [
    ".",
    "docs-app"
  ],
  "scripts": {
    "dev": "concurrently \"pnpm --filter pack_man dev\" \"pnpm --filter docs-app dev\"",
    "dev:main": "pnpm --filter pack_man dev",
    "dev:docs": "pnpm --filter docs-app dev",
    "build": "pnpm --filter pack_man build && pnpm --filter docs-app build",
    "build:main": "pnpm --filter pack_man build",
    "build:docs": "pnpm --filter docs-app build"
  }
}
```

**Main App next.config.ts (Development Proxy):**
```typescript
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/docs',
          destination: 'http://localhost:3001',
        },
        {
          source: '/docs/:path*',
          destination: 'http://localhost:3001/:path*',
        },
      ],
    };
  },
};
```

**Main App next.config.ts (Production):**
```typescript
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/docs',
          destination: '/docs-app',
        },
        {
          source: '/docs/:path*',
          destination: '/docs-app/:path*',
        },
      ],
    };
  },
};
```

### Theme Synchronization

To maintain consistent theming between main app and docs:

**Shared Theme Configuration:**
- Both apps use `next-themes` with same configuration
- Theme preference stored in localStorage with shared key
- CSS variables defined consistently across both apps

**Cross-App Communication (Future Subdomain):**
```typescript
// Main app sends theme updates
window.postMessage({ type: 'THEME_CHANGE', theme: 'dark' }, 'https://docs.packman.com');

// Docs app listens for theme updates
window.addEventListener('message', (event) => {
  if (event.data.type === 'THEME_CHANGE') {
    setTheme(event.data.theme);
  }
});
```

### Component Hierarchy (docs-app)

```
RootProvider (docs-app/app/layout.tsx)
└── DocsLayout (docs-app/app/[[...slug]]/layout.tsx)
    ├── Navbar
    │   ├── Logo (Pack-Man logo, links to main app)
    │   ├── Navigation Links
    │   ├── Search Trigger
    │   └── Theme Toggle
    ├── Sidebar
    │   ├── Banner (optional)
    │   ├── Navigation Tree
    │   └── Footer Links (back to main app)
    ├── Main Content Area
    │   ├── Breadcrumbs
    │   ├── Page Title
    │   ├── MDX Content
    │   │   ├── Headings
    │   │   ├── Code Blocks (with syntax highlighting)
    │   │   ├── Callouts/Admonitions
    │   │   ├── Images
    │   │   └── Custom Components
    │   └── Previous/Next Navigation
    └── Table of Contents (TOC)
        └── Page Headings
```

### Data Flow

1. **Build Time (docs-app):**
   - Fumadocs MDX plugin scans `docs-app/content/docs/` directory
   - Parses MDX files and extracts frontmatter metadata
   - Generates page tree structure from file system
   - Creates search index from content
   - Compiles MDX to optimized React components
   - Builds independent Next.js application

2. **Runtime (Development):**
   - User navigates to `localhost:3000/docs/[...slug]`
   - Main app rewrites request to `localhost:3001/[...slug]`
   - Docs app serves the documentation page
   - DocsLayout renders with sidebar navigation
   - Search API provides real-time search results

3. **Runtime (Production - Current):**
   - User navigates to `packman.com/docs/[...slug]`
   - Next.js rewrites to docs-app build output
   - Static pages served from docs-app/.next
   - Client-side navigation within docs

4. **Runtime (Production - Future with Subdomain):**
   - User navigates to `docs.packman.com/[...slug]`
   - Separate deployment serves docs-app
   - No changes to docs-app code required
   - Cross-origin theme sync via postMessage

## Components and Interfaces

### Core Components

#### 1. RootProvider
**Location:** `docs-app/app/layout.tsx`

**Purpose:** Provides global context for theme management and Fumadocs configuration. Independent from main app's RootProvider.

**Props:**
```typescript
interface RootProviderProps {
  children: ReactNode;
  theme?: {
    enabled?: boolean;
    defaultTheme?: 'light' | 'dark' | 'system';
  };
}
```

**Responsibilities:**
- Theme context management
- System preference detection
- Theme persistence in localStorage
- CSS variable injection for theming

#### 2. DocsLayout
**Location:** `docs-app/app/layout.tsx` or `docs-app/app/[[...slug]]/layout.tsx`

**Purpose:** Main layout component for documentation pages with sidebar, navigation, and TOC.

**Props:**
```typescript
interface DocsLayoutProps {
  tree: PageTree;              // Navigation structure
  nav?: {
    title?: ReactNode;
    url?: string;
    children?: ReactNode;
  };
  sidebar?: {
    enabled?: boolean;
    banner?: ReactNode;
    footer?: ReactNode;
    tabs?: SidebarTab[] | false;
  };
  links?: LinkItem[];          // Additional navigation links
  children: ReactNode;
}

interface PageTree {
  name: string;
  children: PageTreeNode[];
}

interface PageTreeNode {
  type: 'page' | 'folder' | 'separator';
  name: string;
  url?: string;
  icon?: ReactNode;
  children?: PageTreeNode[];
}

interface SidebarTab {
  title: string;
  description?: string;
  url: string;
}

interface LinkItem {
  text: string;
  url: string;
  icon?: ReactNode;
  external?: boolean;
}
```

**Responsibilities:**
- Render sidebar navigation from page tree
- Display table of contents for current page
- Handle responsive layout (mobile/desktop)
- Manage sidebar state (expanded/collapsed)
- Render previous/next page navigation

#### 3. DocsPage
**Location:** `docs-app/app/[[...slug]]/page.tsx`

**Purpose:** Dynamic page component that renders MDX content.

**Interface:**
```typescript
interface DocsPageProps {
  params: Promise<{ slug?: string[] }>;
}

interface PageData {
  title: string;
  description?: string;
  body: MDXContent;
  toc: TOCItem[];
  structuredData?: object;
}

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}
```

**Responsibilities:**
- Load MDX content based on slug
- Generate metadata for SEO
- Render MDX content with custom components
- Handle 404 for non-existent pages
- Generate structured data for search engines

#### 4. SearchDialog
**Location:** Provided by `fumadocs-ui/components/dialog/search`

**Purpose:** Full-text search interface with keyboard shortcuts.

**Props:**
```typescript
interface SearchDialogProps {
  api?: string;              // Search API endpoint
  placeholder?: string;
  hotKey?: {
    display: string;
    key: string;
  };
}
```

**Responsibilities:**
- Display search input with keyboard shortcut (Ctrl+K / Cmd+K)
- Fetch search results from API
- Display results with highlighted matches
- Navigate to selected result
- Handle loading and error states

### Custom MDX Components

#### CodeBlock
**Purpose:** Syntax-highlighted code blocks with copy functionality.

```typescript
interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}
```

**Features:**
- Syntax highlighting using Shiki
- Copy to clipboard button
- Line numbers (optional)
- Line highlighting
- Language badge

#### Callout
**Purpose:** Highlighted information boxes for notes, warnings, tips.

```typescript
interface CalloutProps {
  type: 'note' | 'warning' | 'tip' | 'danger' | 'info';
  title?: string;
  children: ReactNode;
}
```

**Features:**
- Color-coded by type
- Icon based on type
- Collapsible (optional)
- Custom title

## Data Models

### Page Metadata (Frontmatter)

```typescript
interface PageFrontmatter {
  title: string;                    // Required: Page title
  description?: string;             // Optional: Page description for SEO
  icon?: string;                    // Optional: Icon name for sidebar
  full?: boolean;                   // Optional: Full-width layout
  toc?: boolean;                    // Optional: Show/hide TOC (default: true)
  lastModified?: Date;              // Optional: Last update date
  authors?: string[];               // Optional: Page authors
  tags?: string[];                  // Optional: Tags for categorization
}
```

### Source Configuration

```typescript
// source.config.ts
interface SourceConfig {
  docs: {
    dir: string;                    // Content directory
    schema?: ZodSchema;             // Frontmatter validation schema
    mdxOptions?: MDXOptions;        // MDX compilation options
  };
}

interface MDXOptions {
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  format?: 'mdx' | 'md';
}
```

### Search Index Entry

```typescript
interface SearchIndexEntry {
  id: string;                       // Unique identifier
  title: string;                    // Page title
  description?: string;             // Page description
  url: string;                      // Page URL
  content: string;                  // Searchable content
  section?: string;                 // Section within page
  keywords?: string[];              // Additional keywords
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

1.1 WHEN a user navigates to `/docs` THEN the system SHALL display a documentation homepage with an overview of Pack-Man
  Thoughts: This is testing a specific route behavior. We can test that navigating to /docs returns a successful response and contains expected content markers.
  Testable: yes - example

1.2 WHEN a user views the documentation site THEN the system SHALL provide a sidebar navigation showing all available documentation sections
  Thoughts: This is about the UI structure being present. We can test that the rendered page contains sidebar navigation elements with the expected sections.
  Testable: yes - property

1.3 WHEN a user clicks on a documentation link in the sidebar THEN the system SHALL navigate to that documentation page without full page reload
  Thoughts: This is testing SPA navigation behavior. This is a UI interaction test that requires browser automation.
  Testable: yes - property

1.4 WHEN a user views any documentation page THEN the system SHALL display a table of contents for that page in a right sidebar
  Thoughts: This is testing that TOC is present for pages with headings. We can test that pages with headings render TOC elements.
  Testable: yes - property

1.5 WHEN a user accesses the documentation site THEN the system SHALL respect the user's theme preference (light/dark mode) consistent with the main application
  Thoughts: This is testing theme consistency. We can test that theme state is shared between main app and docs.
  Testable: yes - property

2.1 WHEN a developer creates a new MDX file in the content directory THEN the system SHALL automatically include it in the documentation site
  Thoughts: This is testing the build system's file discovery. We can test that adding a file to content/docs results in it being accessible.
  Testable: yes - property

2.2 WHEN a developer writes frontmatter metadata in an MDX file THEN the system SHALL use that metadata for page title, description, and navigation
  Thoughts: This is testing frontmatter parsing and usage. We can test that frontmatter values appear in the rendered output.
  Testable: yes - property

2.3 WHEN a developer includes React components in MDX content THEN the system SHALL render those components correctly in the documentation page
  Thoughts: This is testing MDX component rendering. We can test that JSX in MDX files renders as React components.
  Testable: yes - property

2.4 WHEN a developer updates an MDX file during development THEN the system SHALL hot-reload the documentation page with the changes
  Thoughts: This is testing the development server's hot reload feature. This is a development-time behavior that's hard to test automatically.
  Testable: no

2.5 WHEN a developer builds the application for production THEN the system SHALL compile all MDX files into optimized static pages
  Thoughts: This is testing the build process. We can test that running build generates static HTML for all MDX pages.
  Testable: yes - property

3.1 WHEN a user opens the search interface THEN the system SHALL display a search dialog with a text input field
  Thoughts: This is testing UI presence. We can test that triggering search displays the expected UI elements.
  Testable: yes - example

3.2 WHEN a user types a search query THEN the system SHALL display matching results in real-time as the user types
  Thoughts: This is testing search functionality across all possible queries. We can generate random queries and verify results match the query.
  Testable: yes - property

3.3 WHEN a user views search results THEN the system SHALL highlight the matching text snippets from the documentation
  Thoughts: This is testing that search results contain highlighted matches. We can test that result HTML includes highlight markup.
  Testable: yes - property

3.4 WHEN a user clicks on a search result THEN the system SHALL navigate to that documentation page and scroll to the relevant section
  Thoughts: This is testing navigation behavior from search. This requires browser automation to test properly.
  Testable: yes - property

3.5 WHEN a user presses keyboard shortcuts (Ctrl+K or Cmd+K) THEN the system SHALL open the search dialog
  Thoughts: This is testing keyboard shortcut handling. This requires browser automation to test keyboard events.
  Testable: yes - example

4.1 WHEN a user views the documentation sidebar THEN the system SHALL organize content into logical sections (Getting Started, Features, Extensions, API Reference, Guides)
  Thoughts: This is testing the sidebar structure. We can test that the rendered sidebar contains the expected sections.
  Testable: yes - example

4.2 WHEN a user expands a documentation section THEN the system SHALL show all pages within that section
  Thoughts: This is testing UI interaction. This requires browser automation to test expand/collapse behavior.
  Testable: yes - property

4.3 WHEN a user views a documentation page THEN the system SHALL highlight the current page in the sidebar navigation
  Thoughts: This is testing active state styling. We can test that the current page has active styling in the sidebar.
  Testable: yes - property

4.4 WHEN a user navigates between documentation pages THEN the system SHALL maintain the sidebar's expanded/collapsed state
  Thoughts: This is testing state persistence during navigation. This requires browser automation to test.
  Testable: yes - property

4.5 WHEN a user views the documentation structure THEN the system SHALL display pages in a logical order defined by the content configuration
  Thoughts: This is testing that page order matches configuration. We can test that sidebar order matches source config order.
  Testable: yes - property

5.1 WHEN a user views a code block in the documentation THEN the system SHALL apply syntax highlighting appropriate to the code language
  Thoughts: This is testing syntax highlighting across all languages. We can test that code blocks have syntax highlighting classes.
  Testable: yes - property

5.2 WHEN a user hovers over a code block THEN the system SHALL display a copy button to copy the code to clipboard
  Thoughts: This is testing UI interaction. This requires browser automation to test hover behavior.
  Testable: yes - example

5.3 WHEN a user clicks the copy button THEN the system SHALL copy the code content and show a confirmation message
  Thoughts: This is testing clipboard functionality. This requires browser automation to test.
  Testable: yes - example

5.4 WHEN a user views code examples THEN the system SHALL support multiple languages (TypeScript, JavaScript, Python, Dart, Bash, JSON, YAML)
  Thoughts: This is testing language support. We can test that each language renders with appropriate highlighting.
  Testable: yes - property

5.5 WHEN a user views code blocks THEN the system SHALL display line numbers for code blocks longer than 10 lines
  Thoughts: This is testing conditional line number display. We can test that blocks > 10 lines have line numbers.
  Testable: yes - property

6.1 WHEN a user reaches the bottom of a documentation page THEN the system SHALL display links to the previous and next pages in the documentation sequence
  Thoughts: This is testing pagination navigation presence. We can test that pages have prev/next links.
  Testable: yes - property

6.2 WHEN a user clicks on a previous/next page link THEN the system SHALL navigate to that page
  Thoughts: This is testing navigation functionality. This requires browser automation to test.
  Testable: yes - example

6.3 WHEN a user views the first page in a section THEN the system SHALL only display a next page link
  Thoughts: This is testing edge case for first page. We can test that first pages don't have previous links.
  Testable: edge-case

6.4 WHEN a user views the last page in a section THEN the system SHALL only display a previous page link
  Thoughts: This is testing edge case for last page. We can test that last pages don't have next links.
  Testable: edge-case

6.5 WHEN a user views an internal documentation link THEN the system SHALL style it distinctly from external links
  Thoughts: This is testing link styling. We can test that internal and external links have different classes.
  Testable: yes - property

7.1 WHEN the migration is complete THEN the system SHALL include all content from existing markdown files in the docs folder
  Thoughts: This is testing migration completeness. We can test that all original files have corresponding MDX files.
  Testable: yes - property

7.2 WHEN the migration is complete THEN the system SHALL include all content from chrome-extension documentation files
  Thoughts: This is testing migration completeness. We can test that all chrome-extension docs are migrated.
  Testable: yes - property

7.3 WHEN the migration is complete THEN the system SHALL preserve all existing documentation content without loss of information
  Thoughts: This is testing content preservation. We can compare content before and after migration.
  Testable: yes - property

7.4 WHEN the migration is complete THEN the system SHALL organize content into appropriate sections based on topic
  Thoughts: This is testing organization logic. This is subjective and hard to test automatically.
  Testable: no

7.5 WHEN the migration is complete THEN the system SHALL convert relative links in migrated content to work with the new documentation structure
  Thoughts: This is testing link conversion. We can test that all links in migrated content are valid.
  Testable: yes - property

8.1 WHEN a user views the documentation on a mobile device THEN the system SHALL hide the sidebar by default and provide a menu button to toggle it
  Thoughts: This is testing responsive behavior. This requires browser automation with viewport resizing.
  Testable: yes - example

8.2 WHEN a user views the documentation on a tablet THEN the system SHALL adapt the layout to the available screen width
  Thoughts: This is testing responsive layout. This requires browser automation with different viewports.
  Testable: yes - example

8.3 WHEN a user views the documentation on a small screen THEN the system SHALL hide the table of contents sidebar and make it accessible via a button
  Thoughts: This is testing responsive TOC behavior. This requires browser automation.
  Testable: yes - example

8.4 WHEN a user interacts with the mobile sidebar THEN the system SHALL overlay it on top of the content with a backdrop
  Thoughts: This is testing mobile sidebar behavior. This requires browser automation.
  Testable: yes - example

8.5 WHEN a user taps outside the mobile sidebar THEN the system SHALL close the sidebar
  Thoughts: This is testing click-outside behavior. This requires browser automation.
  Testable: yes - example

9.1 WHEN a developer creates a `source.config.ts` file THEN the system SHALL use it to define the documentation structure
  Thoughts: This is testing configuration loading. We can test that source config is read and applied.
  Testable: yes - property

9.2 WHEN a developer defines documentation sections in the config THEN the system SHALL generate the sidebar navigation from that configuration
  Thoughts: This is testing config-to-UI mapping. We can test that sidebar matches config structure.
  Testable: yes - property

9.3 WHEN a developer specifies page metadata in the config THEN the system SHALL use it for SEO and social sharing
  Thoughts: This is testing metadata usage. We can test that meta tags match config values.
  Testable: yes - property

9.4 WHEN a developer updates the source config during development THEN the system SHALL reflect changes after restarting the dev server
  Thoughts: This is testing development workflow. This is hard to test automatically.
  Testable: no

9.5 WHEN a developer builds for production THEN the system SHALL validate the source config and report any errors
  Thoughts: This is testing build-time validation. We can test that invalid configs cause build failures.
  Testable: yes - property

10.1 WHEN a search engine crawls a documentation page THEN the system SHALL provide appropriate title and description meta tags
  Thoughts: This is testing SEO metadata presence. We can test that pages have required meta tags.
  Testable: yes - property

10.2 WHEN a documentation page is shared on social media THEN the system SHALL provide Open Graph metadata with title, description, and image
  Thoughts: This is testing OG metadata. We can test that pages have OG meta tags.
  Testable: yes - property

10.3 WHEN a user shares a documentation link THEN the system SHALL generate a preview card with relevant information
  Thoughts: This is testing social sharing preview. This is external behavior we can't directly test.
  Testable: no

10.4 WHEN a search engine indexes the documentation THEN the system SHALL provide a sitemap including all documentation pages
  Thoughts: This is testing sitemap generation. We can test that sitemap.xml includes all doc pages.
  Testable: yes - property

10.5 WHEN a user views documentation page metadata THEN the system SHALL include canonical URLs to prevent duplicate content issues
  Thoughts: This is testing canonical URL presence. We can test that pages have canonical link tags.
  Testable: yes - property

### Property Reflection

After reviewing all testable properties, I've identified the following redundancies and consolidations:

**Redundant Properties:**
- 6.3 and 6.4 (first/last page edge cases) can be combined into a single property about prev/next link presence based on position
- 7.1 and 7.2 (migration of docs and chrome-extension files) can be combined into a single property about complete migration
- 10.1 and 10.2 (meta tags and OG tags) can be combined into a single comprehensive metadata property

**Consolidated Properties:**
- Properties 1.2, 4.1, 4.3, 4.5 all test sidebar structure and can be combined into one comprehensive sidebar property
- Properties 2.1, 2.2, 2.5 all test the build/compilation process and can be combined
- Properties 3.2 and 3.3 both test search results and can be combined

These consolidations will reduce redundancy while maintaining comprehensive test coverage.

### Correctness Properties

Property 1: Documentation homepage accessibility
*For the specific route* `/docs`, accessing it should return a successful response with expected content markers (title, description, navigation)
**Validates: Requirements 1.1**

Property 2: Sidebar navigation completeness
*For any* documentation page, the rendered sidebar should contain all configured sections in the correct order, with the current page highlighted
**Validates: Requirements 1.2, 4.1, 4.3, 4.5**

Property 3: Client-side navigation
*For any* documentation link in the sidebar, clicking it should navigate without full page reload (SPA behavior)
**Validates: Requirements 1.3**

Property 4: Table of contents generation
*For any* documentation page with headings, the page should render a table of contents containing all headings
**Validates: Requirements 1.4**

Property 5: Theme consistency
*For any* theme preference (light/dark/system), the documentation site should apply the same theme as the main application
**Validates: Requirements 1.5**

Property 6: MDX file discovery and compilation
*For any* valid MDX file added to the content directory, the build process should generate an accessible page with correct metadata
**Validates: Requirements 2.1, 2.2, 2.5**

Property 7: MDX component rendering
*For any* React component included in MDX content, it should render correctly as a React component in the output
**Validates: Requirements 2.3**

Property 8: Search functionality
*For any* search query, the results should contain only pages matching the query with highlighted text snippets
**Validates: Requirements 3.2, 3.3**

Property 9: Search navigation
*For any* search result clicked, the browser should navigate to that page and scroll to the relevant section
**Validates: Requirements 3.4**

Property 10: Sidebar state persistence
*For any* navigation between documentation pages, the sidebar's expanded/collapsed state should be maintained
**Validates: Requirements 4.2, 4.4**

Property 11: Syntax highlighting
*For any* code block with a specified language, the rendered output should include syntax highlighting classes appropriate to that language
**Validates: Requirements 5.1, 5.4**

Property 12: Line numbers for long code blocks
*For any* code block with more than 10 lines, the rendered output should include line numbers
**Validates: Requirements 5.5**

Property 13: Pagination navigation
*For any* documentation page, it should display previous and/or next links based on its position in the sequence (first page: next only, last page: previous only, middle pages: both)
**Validates: Requirements 6.1, 6.3, 6.4**

Property 14: Link styling differentiation
*For any* link in documentation content, internal links should have different styling classes than external links
**Validates: Requirements 6.5**

Property 15: Migration completeness
*For all* existing documentation files (docs/ and chrome-extension/), there should be corresponding MDX files in the new structure with preserved content
**Validates: Requirements 7.1, 7.2, 7.3**

Property 16: Link conversion in migrated content
*For any* link in migrated documentation content, it should be a valid URL that resolves correctly in the new structure
**Validates: Requirements 7.5**

Property 17: Source configuration application
*For any* valid source.config.ts file, the sidebar navigation should match the structure defined in the configuration
**Validates: Requirements 9.1, 9.2**

Property 18: Metadata from configuration
*For any* page with metadata defined in frontmatter or config, the rendered HTML should include corresponding meta tags
**Validates: Requirements 9.3**

Property 19: Build-time validation
*For any* invalid source configuration, the build process should fail with a descriptive error message
**Validates: Requirements 9.5**

Property 20: SEO and social metadata
*For any* documentation page, the HTML should include title, description, Open Graph, and canonical URL meta tags
**Validates: Requirements 10.1, 10.2, 10.5**

Property 21: Sitemap generation
*For all* documentation pages, the sitemap.xml should include entries for each page
**Validates: Requirements 10.4**

## Error Handling

### Build-Time Errors

1. **Invalid MDX Syntax**
   - Detection: MDX compilation fails
   - Handling: Display clear error message with file path and line number
   - Recovery: Fix MDX syntax and rebuild

2. **Missing Frontmatter Fields**
   - Detection: Zod schema validation fails
   - Handling: Show validation error with missing fields
   - Recovery: Add required frontmatter fields

3. **Invalid Source Configuration**
   - Detection: TypeScript compilation or runtime validation fails
   - Handling: Display configuration error with specific issue
   - Recovery: Fix source.config.ts and rebuild

4. **Broken Internal Links**
   - Detection: Link validation during build
   - Handling: Warning in build output with broken link details
   - Recovery: Fix links in MDX files

### Runtime Errors

1. **Page Not Found (404)**
   - Detection: No matching page for slug
   - Handling: Display custom 404 page with search and navigation
   - Recovery: User navigates to valid page

2. **Search API Failure**
   - Detection: Search API returns error or times out
   - Handling: Display error message in search dialog
   - Recovery: Retry search or close dialog

3. **Theme Loading Failure**
   - Detection: Theme context initialization fails
   - Handling: Fall back to light theme
   - Recovery: Automatic on next page load

4. **MDX Component Error**
   - Detection: React error boundary catches component error
   - Handling: Display error message in place of component
   - Recovery: Fix component code and hot reload

### User Input Validation

1. **Search Query**
   - Validation: Sanitize input to prevent XSS
   - Max length: 200 characters
   - Handling: Trim and escape special characters

2. **URL Parameters**
   - Validation: Validate slug format
   - Handling: Reject invalid characters, return 404 for invalid slugs

## Testing Strategy

### Unit Testing

Unit tests will verify specific functionality and edge cases:

1. **Frontmatter Parsing**
   - Test valid frontmatter extraction
   - Test invalid frontmatter handling
   - Test optional field defaults

2. **Link Conversion**
   - Test relative link conversion
   - Test absolute link preservation
   - Test anchor link handling

3. **Search Index Generation**
   - Test content extraction from MDX
   - Test keyword extraction
   - Test index structure

4. **Metadata Generation**
   - Test meta tag generation from frontmatter
   - Test Open Graph tag generation
   - Test canonical URL generation

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** library for TypeScript:

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with format: `**Feature: fumadocs-implementation, Property {number}: {property_text}**`

**Test Categories:**

1. **Navigation Properties (Properties 2, 3, 10, 13)**
   - Generate random page trees and verify navigation structure
   - Test sidebar state persistence across random navigation sequences
   - Verify prev/next links for pages at different positions

2. **Content Processing Properties (Properties 6, 7, 11, 12)**
   - Generate random valid MDX content and verify compilation
   - Generate random code blocks with different languages
   - Test component rendering with random props

3. **Search Properties (Properties 8, 9)**
   - Generate random search queries and verify result relevance
   - Test search result highlighting with various query patterns

4. **Metadata Properties (Properties 18, 20, 21)**
   - Generate random frontmatter and verify meta tag generation
   - Test sitemap generation with random page sets

5. **Migration Properties (Properties 15, 16)**
   - Verify all source files have corresponding output files
   - Test link conversion with random link patterns

**Example Property Test Structure:**
```typescript
import fc from 'fast-check';

describe('Property 6: MDX file discovery and compilation', () => {
  /**
   * Feature: fumadocs-implementation, Property 6: MDX file discovery and compilation
   * For any valid MDX file added to the content directory, the build process 
   * should generate an accessible page with correct metadata
   */
  it('should compile any valid MDX file with frontmatter', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.option(fc.string({ maxLength: 200 })),
          content: fc.string({ minLength: 10 })
        }),
        async (mdxData) => {
          // Test implementation
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

Integration tests will verify component interactions:

1. **DocsLayout Integration**
   - Test sidebar rendering with page tree
   - Test TOC generation from page content
   - Test theme switching

2. **Search Integration**
   - Test search API with index
   - Test search dialog with keyboard shortcuts
   - Test result navigation

3. **Build Process Integration**
   - Test full build with sample content
   - Test hot reload during development
   - Test static export generation

### Browser Automation Testing

Using Chrome DevTools MCP for UI testing:

1. **Responsive Design**
   - Test mobile sidebar behavior
   - Test tablet layout adaptation
   - Test desktop layout

2. **User Interactions**
   - Test search keyboard shortcuts
   - Test code block copy functionality
   - Test sidebar expand/collapse
   - Test theme toggle

3. **Navigation**
   - Test client-side routing
   - Test scroll-to-section from search
   - Test prev/next navigation

### Test Execution Order

1. Unit tests (fast, no dependencies)
2. Property-based tests (comprehensive coverage)
3. Integration tests (component interactions)
4. Browser automation tests (full user flows)

### Continuous Integration

- Run unit and property tests on every commit
- Run integration tests on pull requests
- Run browser tests before releases
- Generate coverage reports (target: >80% coverage)
