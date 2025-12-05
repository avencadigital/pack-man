# Implementation Plan

- [ ] 1. Set up workspace and install Fumadocs
  - Configure pnpm workspace in root package.json
  - Run `pnpm create fumadocs-app docs-app` to bootstrap documentation app
  - Configure docs-app package.json with correct name and scripts
  - Install concurrently for running both apps simultaneously
  - Update root scripts for dev, build, and deployment
  - _Requirements: 2.1, 9.1_

- [ ] 2. Configure development environment and proxy
  - Update main app next.config.ts with development rewrites to localhost:3001
  - Configure docs-app to run on port 3001
  - Test proxy routing from /docs to docs-app
  - Verify hot reload works for both applications
  - _Requirements: 1.1, 1.3_

- [ ] 3. Customize Fumadocs branding and theme
  - Update docs-app layout with Pack-Man logo and branding
  - Configure shared theme system using next-themes
  - Align CSS variables with main app theme
  - Add navigation link back to main application
  - Configure favicon and metadata
  - _Requirements: 1.5, 10.1_

- [ ] 4. Configure documentation structure
  - Create source.config.ts with documentation sections (Getting Started, Features, Extensions, API, Guides)
  - Define frontmatter schema with Zod validation
  - Configure MDX options (remark/rehype plugins)
  - Set up page tree structure
  - _Requirements: 4.1, 9.1, 9.2_

- [ ] 5. Migrate existing documentation content
  - [ ] 5.1 Create content directory structure
    - Create content/docs folder with section subdirectories
    - Set up index.mdx as documentation homepage
    - _Requirements: 1.1, 4.1_

  - [ ] 5.2 Migrate docs/ folder content
    - Convert existing markdown files to MDX format
    - Add frontmatter metadata to each file
    - Organize files into appropriate sections
    - _Requirements: 7.1, 7.3_

  - [ ] 5.3 Migrate chrome-extension documentation
    - Convert chrome-extension/*.md files to MDX
    - Add frontmatter metadata
    - Place in extensions/ section
    - _Requirements: 7.2, 7.3_

  - [ ] 5.4 Convert and validate internal links
    - Update relative links to work with new structure
    - Convert links to use new /docs paths
    - Validate all internal links resolve correctly
    - _Requirements: 7.5_

- [ ]* 5.5 Write property test for migration completeness
  - **Property 15: Migration completeness**
  - **Validates: Requirements 7.1, 7.2, 7.3**

- [ ]* 5.6 Write property test for link conversion
  - **Property 16: Link conversion in migrated content**
  - **Validates: Requirements 7.5**

- [ ] 6. Implement search functionality
  - Configure Orama search index generation
  - Create search API route in docs-app
  - Customize search dialog UI
  - Test search with keyboard shortcuts (Ctrl+K / Cmd+K)
  - _Requirements: 3.1, 3.5_

- [ ]* 6.1 Write property test for search functionality
  - **Property 8: Search functionality**
  - **Validates: Requirements 3.2, 3.3**

- [ ] 7. Configure code blocks and syntax highlighting
  - Configure Shiki for syntax highlighting
  - Set up supported languages (TypeScript, JavaScript, Python, Dart, Bash, JSON, YAML)
  - Implement copy-to-clipboard functionality
  - Configure line numbers for long code blocks
  - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [ ]* 7.1 Write property test for syntax highlighting
  - **Property 11: Syntax highlighting**
  - **Validates: Requirements 5.1, 5.4**

- [ ]* 7.2 Write property test for line numbers
  - **Property 12: Line numbers for long code blocks**
  - **Validates: Requirements 5.5**

- [ ] 8. Implement navigation components
  - Configure sidebar navigation with page tree
  - Implement table of contents generation
  - Add previous/next page navigation
  - Implement breadcrumbs
  - Style active page highlighting in sidebar
  - _Requirements: 1.2, 1.4, 4.3, 6.1_

- [ ]* 8.1 Write property test for sidebar navigation
  - **Property 2: Sidebar navigation completeness**
  - **Validates: Requirements 1.2, 4.1, 4.3, 4.5**

- [ ]* 8.2 Write property test for TOC generation
  - **Property 4: Table of contents generation**
  - **Validates: Requirements 1.4**

- [ ]* 8.3 Write property test for pagination navigation
  - **Property 13: Pagination navigation**
  - **Validates: Requirements 6.1, 6.3, 6.4**

- [ ] 9. Implement responsive design
  - Configure mobile sidebar with toggle button
  - Implement sidebar overlay with backdrop for mobile
  - Add responsive TOC button for small screens
  - Test layouts at different breakpoints (mobile, tablet, desktop)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 10. Configure SEO and metadata
  - Implement metadata generation from frontmatter
  - Add Open Graph tags for social sharing
  - Configure canonical URLs
  - Generate sitemap for documentation pages
  - Add robots.txt configuration
  - _Requirements: 10.1, 10.2, 10.4, 10.5_

- [ ]* 10.1 Write property test for metadata generation
  - **Property 20: SEO and social metadata**
  - **Validates: Requirements 10.1, 10.2, 10.5**

- [ ]* 10.2 Write property test for sitemap generation
  - **Property 21: Sitemap generation**
  - **Validates: Requirements 10.4**

- [ ] 11. Implement custom MDX components
  - Create Callout component for notes, warnings, tips
  - Create custom link component with external link styling
  - Create image component with captions
  - Register components in MDX configuration
  - _Requirements: 2.3, 6.5_

- [ ]* 11.1 Write property test for MDX component rendering
  - **Property 7: MDX component rendering**
  - **Validates: Requirements 2.3**

- [ ]* 11.2 Write property test for link styling
  - **Property 14: Link styling differentiation**
  - **Validates: Requirements 6.5**

- [ ] 12. Configure production build
  - Update main app next.config.ts with production rewrites
  - Configure docs-app for static export (if needed)
  - Set up build scripts in root package.json
  - Test production build locally
  - Optimize bundle size
  - _Requirements: 2.5_

- [ ]* 12.1 Write property test for build process
  - **Property 6: MDX file discovery and compilation**
  - **Validates: Requirements 2.1, 2.2, 2.5**

- [ ] 13. Implement error handling
  - Create custom 404 page for docs
  - Add error boundaries for MDX components
  - Implement search error handling
  - Add build-time validation for source config
  - Test error scenarios
  - _Requirements: 9.5_

- [ ]* 13.1 Write property test for build validation
  - **Property 19: Build-time validation**
  - **Validates: Requirements 9.5**

- [ ] 14. Add documentation content
  - Write Getting Started guide
  - Document all Pack-Man features
  - Document Chrome extension usage
  - Document API endpoints
  - Add troubleshooting guides
  - _Requirements: 1.1, 4.1_

- [ ] 15. Testing and quality assurance
  - [ ] 15.1 Run all property-based tests
    - Execute all property tests with 100+ iterations
    - Verify all properties pass
    - _Requirements: All_

  - [ ]* 15.2 Perform browser automation testing
    - Test responsive layouts on different devices
    - Test search functionality with keyboard shortcuts
    - Test navigation and routing
    - Test theme switching
    - _Requirements: 1.3, 3.5, 8.1, 8.2, 8.3_

  - [ ]* 15.3 Perform accessibility testing
    - Test keyboard navigation
    - Verify ARIA labels
    - Check color contrast
    - Test screen reader compatibility
    - _Requirements: All_

- [ ] 16. Documentation and deployment preparation
  - Update main README with docs information
  - Document workspace setup for contributors
  - Create deployment guide for docs-app
  - Document future subdomain migration process
  - _Requirements: All_

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
