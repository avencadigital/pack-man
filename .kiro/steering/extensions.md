---
inclusion: always
---

# Pack-Man Extensions Development Guidelines

## Overview

Pack-Man provides browser and IDE extensions to bring dependency analysis directly into developers' workflows. This document outlines architecture, development patterns, and best practices for both Chrome and VS Code extensions.

## Shared Principles

### API Integration
- **Unified Endpoint**: All extensions use the same API endpoint (`/api/analyze-packages`)
- **Configurable Base URL**: Support for self-hosted instances
- **Authentication**: GitHub token support for private repositories and rate limit increases
- **Error Handling**: Consistent error messages and retry logic across platforms

### Caching Strategy
- **Success Cache**: 5-minute TTL for successful API responses
- **Error Cache**: 2-minute TTL for failed requests (prevents hammering)
- **Size Limits**: Maximum 100 entries per cache type
- **Automatic Cleanup**: Periodic cleanup of expired entries
- **Cache Invalidation**: Clear cache on API endpoint changes

### User Experience
- **Non-intrusive**: Extensions should enhance, not disrupt workflows
- **Visual Feedback**: Clear indicators for loading, success, and error states
- **Performance**: Minimize impact on page load and editor responsiveness
- **Accessibility**: Follow platform-specific accessibility guidelines

## Chrome Extension

### Architecture Patterns

**Manifest V3 Requirements:**
- Use service workers instead of background pages
- Implement proper message passing between contexts
- Handle service worker lifecycle (activation, termination)
- Use chrome.storage API for persistence

**Content Script Patterns:**
- Detect target pages efficiently (GitHub repository pages)
- Use MutationObserver for dynamic content
- Inject UI elements without breaking page layout
- Clean up on navigation

**Background Service Worker:**
- Handle all API requests (avoid CORS in content scripts)
- Implement request queuing and deduplication
- Manage token storage and validation
- Coordinate between multiple tabs

### Code Organization

```javascript
// background.js - Service worker
class CacheManager {
  // Separate caches for success and errors
  // Size limiting and cleanup
}

class APIClient {
  // Request handling with retry logic
  // Token management
  // Timeout handling
}

// content.js - Content script
class RepositoryDetector {
  // Detect repository context
  // Extract owner/repo from URL
}

class BadgeInjector {
  // Inject visual indicators
  // Handle GitHub layout changes
}

// popup.js - Extension popup
class TokenManager {
  // Token validation
  // Storage management
}

class SettingsManager {
  // API endpoint configuration
  // Preference management
}
```

### Best Practices

**Performance:**
- Debounce DOM observations (300ms minimum)
- Batch API requests when possible
- Use passive event listeners
- Minimize DOM queries

**Security:**
- Never expose tokens in content scripts
- Validate all user inputs
- Use CSP-compliant code (no eval, inline scripts)
- Sanitize injected HTML

**Compatibility:**
- Test across Chrome, Edge, Brave
- Handle GitHub layout changes gracefully
- Provide fallbacks for missing features
- Version detection for API compatibility

## VS Code Extension (Planned)

### Architecture Patterns

**Extension Activation:**
- Activate on workspace containing package files
- Lazy load heavy dependencies
- Register providers on activation
- Clean up on deactivation

**Provider Pattern:**
```typescript
// CodeLens Provider
class DependencyCodeLensProvider implements vscode.CodeLensProvider {
  // Show inline update indicators
  // Provide quick actions
}

// Hover Provider
class DependencyHoverProvider implements vscode.HoverProvider {
  // Show package details on hover
  // Display version information
}

// Diagnostic Provider
class DependencyDiagnosticProvider {
  // Report outdated dependencies
  // Security vulnerability warnings
}
```

**Command Pattern:**
```typescript
// Command registration
vscode.commands.registerCommand('packman.updateDependency', async (pkg) => {
  // Update single dependency
});

vscode.commands.registerCommand('packman.updateAll', async () => {
  // Update all outdated dependencies
});

vscode.commands.registerCommand('packman.analyzeWorkspace', async () => {
  // Scan entire workspace
});
```

### Code Organization

```
src/
├── extension.ts              # Entry point, activation
├── providers/
│   ├── codeLensProvider.ts   # Inline indicators
│   ├── hoverProvider.ts      # Hover information
│   └── diagnosticProvider.ts # Problem reporting
├── commands/
│   ├── updateCommands.ts     # Update operations
│   └── analysisCommands.ts   # Analysis operations
├── services/
│   ├── apiService.ts         # API integration
│   ├── cacheService.ts       # Response caching
│   └── parserService.ts      # File parsing
├── ui/
│   ├── statusBar.ts          # Status bar item
│   └── webview.ts            # Rich UI panels
└── utils/
    ├── fileWatcher.ts        # File system monitoring
    └── terminalRunner.ts     # Terminal integration
```

### Best Practices

**Performance:**
- Use incremental parsing for large files
- Debounce file system events
- Cache parsed results
- Lazy load webview content

**User Experience:**
- Show progress for long operations
- Provide cancellation for async tasks
- Use VS Code's native UI components
- Follow VS Code UX guidelines

**Integration:**
- Respect workspace trust settings
- Honor user's color theme
- Integrate with VS Code's settings
- Support multi-root workspaces

**Testing:**
- Unit tests for core logic
- Integration tests for providers
- E2E tests for commands
- Mock VS Code API in tests

## Shared Code Strategy

### Reusable Modules

**Parsers:**
- Import from `src/lib/parsers/`
- Package.json, requirements.txt, pubspec.yaml parsers
- Consistent PackageInfo interface

**Type Definitions:**
- Import from `src/types/`
- Shared types across web app and extensions
- Version compatibility types

**Utilities:**
- Version comparison logic
- URL generation
- Status determination

### Code Sharing Approach

```typescript
// Shared via npm package or git submodule
import { parsePackageJson } from '@pack-man/parsers';
import { PackageInfo, PackageStatus } from '@pack-man/types';
import { compareVersions } from '@pack-man/utils';

// Platform-specific implementation
class ExtensionAPIClient {
  async analyzePackages(packages: PackageInfo[]): Promise<AnalysisResult> {
    // Use shared types, platform-specific HTTP client
  }
}
```

## Testing Strategy

### Chrome Extension Testing

**Unit Tests:**
- Cache manager logic
- API client retry logic
- Token validation
- URL parsing

**Integration Tests:**
- Message passing between contexts
- Storage API interactions
- API endpoint communication

**E2E Tests:**
- Puppeteer for browser automation
- Test on actual GitHub pages
- Verify badge injection
- Test token flow

### VS Code Extension Testing

**Unit Tests:**
- Parser logic
- Command handlers
- Provider logic

**Integration Tests:**
- VS Code API mocking
- File system operations
- Terminal integration

**E2E Tests:**
- VS Code extension test runner
- Workspace scenarios
- Multi-file operations

## Deployment & Distribution

### Chrome Extension

**Development:**
- Load unpacked from `chrome-extension/` folder
- Enable developer mode in Chrome
- Hot reload with extension reloader

**Production:**
- Build process (if needed for minification)
- Version bump in manifest.json
- Create .zip for Chrome Web Store
- Submit for review

**Release Checklist:**
- Update version in manifest.json
- Update RELEASE_NOTES.md
- Test on Chrome, Edge, Brave
- Verify permissions are minimal
- Check CSP compliance

### VS Code Extension

**Development:**
- Press F5 to launch Extension Development Host
- Use VS Code Extension Test Runner
- Debug with breakpoints

**Production:**
- Build with vsce package
- Version bump in package.json
- Publish to VS Code Marketplace
- Create GitHub release

**Release Checklist:**
- Update version in package.json
- Update CHANGELOG.md
- Test on Windows, macOS, Linux
- Verify activation events
- Check bundle size

## Documentation Requirements

### User Documentation
- Installation instructions
- Configuration guide
- Feature overview with screenshots
- Troubleshooting section
- FAQ

### Developer Documentation
- Architecture overview
- API integration guide
- Contributing guidelines
- Testing instructions
- Release process

## Security Considerations

### Token Management
- Store tokens securely (chrome.storage.local, VS Code SecretStorage)
- Never log tokens
- Validate token format before use
- Clear tokens on logout

### API Communication
- Use HTTPS only
- Validate API responses
- Implement request timeouts
- Rate limit client-side requests

### Content Security
- Sanitize all user inputs
- Escape HTML before injection
- Use CSP headers
- Avoid eval and Function constructor

## Monitoring & Analytics

### Error Tracking
- Log errors with context (not sensitive data)
- Track API failure rates
- Monitor cache hit rates
- Measure performance metrics

### Usage Analytics (Optional)
- Feature usage statistics
- Performance metrics
- Error frequency
- User feedback collection

## Future Enhancements

### Chrome Extension
- Support for GitLab and Bitbucket
- Inline diff view for dependency updates
- Notification system for outdated dependencies
- Team sharing features

### VS Code Extension
- Monorepo support with workspace scanning
- Dependency graph visualization
- Security vulnerability scanning
- Automated PR creation for updates
- Integration with GitHub Actions
