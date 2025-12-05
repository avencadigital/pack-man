# Design Document

## Overview

The Pack-Man VS Code Extension is a TypeScript-based extension that integrates dependency analysis capabilities directly into the Visual Studio Code editor. The extension provides real-time feedback on package dependency health through multiple UI integration points including CodeLens indicators, hover information, diagnostics, status bar items, and rich webview panels.

The extension leverages VS Code's extension API to monitor package files (package.json, requirements.txt, pubspec.yaml), parse their contents, communicate with the Pack-Man API for analysis, and present results through native VS Code UI components. It follows VS Code's extension development best practices including proper activation events, provider patterns, and resource management.

**Important**: All implementation should reference the official VS Code Extension API documentation at https://code.visualstudio.com/api for:
- Extension capabilities and contribution points
- API references and interfaces
- Best practices and patterns
- Sample code and examples

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VS Code Extension Host                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   CodeLens   │  │    Hover     │  │  Diagnostic  │      │
│  │   Provider   │  │   Provider   │  │   Provider   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  Analysis       │                        │
│                   │  Service        │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐     │
│  │   Parser     │  │  API Client  │  │    Cache     │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Status Bar  │  │   Webview    │  │   Terminal   │      │
│  │    Item      │  │    Panel     │  │  Integration │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            ▼
                   ┌────────────────┐
                   │  Pack-Man API  │
                   │  /api/analyze  │
                   └────────────────┘
```

### Component Layers

1. **Presentation Layer**: VS Code UI providers (CodeLens, Hover, Diagnostic, Status Bar, Webview)
2. **Business Logic Layer**: Analysis Service, Parser Service
3. **Data Layer**: API Client Service, Cache Service
4. **Integration Layer**: Terminal Integration, File System Watcher

### Extension Activation

The extension uses activation events to minimize resource usage:
- `onLanguage:json` - Activates when JSON files are opened (for package.json)
- `onLanguage:plaintext` - Activates when text files are opened (for requirements.txt)
- `onLanguage:yaml` - Activates when YAML files are opened (for pubspec.yaml)
- `workspaceContains:**/package.json` - Activates when workspace contains package.json
- `workspaceContains:**/requirements.txt` - Activates when workspace contains requirements.txt
- `workspaceContains:**/pubspec.yaml` - Activates when workspace contains pubspec.yaml

## Components and Interfaces

### 1. Extension Entry Point

**File**: `src/extension.ts`

```typescript
export function activate(context: vscode.ExtensionContext): void {
  // Initialize services
  const cacheService = new CacheService();
  const apiClient = new APIClientService(cacheService);
  const parserService = new ParserService();
  const analysisService = new AnalysisService(apiClient, parserService);
  
  // Register providers
  const codeLensProvider = new DependencyCodeLensProvider(analysisService);
  const hoverProvider = new DependencyHoverProvider(analysisService);
  const diagnosticProvider = new DependencyDiagnosticProvider(analysisService);
  
  // Register UI components
  const statusBarManager = new StatusBarManager(analysisService);
  const webviewManager = new WebviewManager(analysisService, context);
  const terminalManager = new TerminalManager();
  
  // Register commands
  registerCommands(context, analysisService, webviewManager, terminalManager);
  
  // Set up file watchers
  setupFileWatchers(context, analysisService);
  
  // Add to subscriptions for cleanup
  context.subscriptions.push(
    codeLensProvider,
    hoverProvider,
    diagnosticProvider,
    statusBarManager,
    webviewManager
  );
}

export function deactivate(): void {
  // Cleanup handled by subscriptions
}
```

### 2. Analysis Service

**Responsibility**: Orchestrates dependency analysis workflow

```typescript
interface AnalysisService {
  /**
   * Analyzes a package file and returns results
   */
  analyzeFile(uri: vscode.Uri): Promise<AnalysisResult>;
  
  /**
   * Analyzes all package files in workspace
   */
  analyzeWorkspace(): Promise<WorkspaceAnalysisResult>;
  
  /**
   * Gets cached analysis result if available
   */
  getCachedResult(uri: vscode.Uri): AnalysisResult | undefined;
  
  /**
   * Subscribes to analysis updates
   */
  onAnalysisUpdate(callback: (result: AnalysisResult) => void): vscode.Disposable;
}

interface AnalysisResult {
  uri: vscode.Uri;
  packages: PackageAnalysis[];
  statistics: {
    total: number;
    upToDate: number;
    outdated: number;
    errors: number;
  };
  timestamp: number;
}

interface PackageAnalysis {
  name: string;
  currentVersion: string;
  latestVersion: string;
  status: 'up-to-date' | 'outdated' | 'error';
  registry: 'npm' | 'pypi' | 'pub';
  documentationUrl?: string;
  registryUrl?: string;
  error?: string;
  line: number; // Line number in file
}
```

### 3. Parser Service

**Responsibility**: Parses package files and extracts dependency information

```typescript
interface ParserService {
  /**
   * Detects package file type from URI
   */
  detectFileType(uri: vscode.Uri): PackageFileType | undefined;
  
  /**
   * Parses package file content
   */
  parseFile(content: string, fileType: PackageFileType): ParseResult;
}

type PackageFileType = 'package.json' | 'requirements.txt' | 'pubspec.yaml';

interface ParseResult {
  packages: PackageInfo[];
  errors: ParseError[];
}

interface PackageInfo {
  name: string;
  version: string;
  line: number;
  registry: 'npm' | 'pypi' | 'pub';
}

interface ParseError {
  message: string;
  line: number;
  column: number;
}
```

### 4. API Client Service

**Responsibility**: Communicates with Pack-Man API

```typescript
interface APIClientService {
  /**
   * Analyzes packages via API
   */
  analyzePackages(packages: PackageInfo[]): Promise<APIAnalysisResult>;
  
  /**
   * Configures API endpoint
   */
  setEndpoint(endpoint: string): void;
  
  /**
   * Configures GitHub token
   */
  setGitHubToken(token: string | undefined): void;
}

interface APIAnalysisResult {
  results: Array<{
    name: string;
    currentVersion: string;
    latestVersion: string;
    status: 'up-to-date' | 'outdated' | 'error';
    registry: 'npm' | 'pypi' | 'pub';
    documentationUrl?: string;
    registryUrl?: string;
    error?: string;
  }>;
}
```

### 5. Cache Service

**Responsibility**: Manages response caching with TTL

```typescript
interface CacheService {
  /**
   * Gets cached value if not expired
   */
  get<T>(key: string): T | undefined;
  
  /**
   * Sets cached value with TTL
   */
  set<T>(key: string, value: T, ttl: number): void;
  
  /**
   * Clears all cached values
   */
  clear(): void;
  
  /**
   * Removes expired entries
   */
  cleanup(): void;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}
```

### 6. CodeLens Provider

**Responsibility**: Displays inline indicators above dependencies

```typescript
class DependencyCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    // Parse document
    // Get analysis results
    // Create CodeLens for each dependency
  }
  
  resolveCodeLens(
    codeLens: vscode.CodeLens,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens> {
    // Resolve command for CodeLens
  }
}
```

### 7. Hover Provider

**Responsibility**: Displays detailed information on hover

```typescript
class DependencyHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // Detect if position is on a dependency
    // Get analysis result for that dependency
    // Create hover with markdown content
  }
}
```

### 8. Diagnostic Provider

**Responsibility**: Reports issues in Problems panel

```typescript
class DependencyDiagnosticProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;
  
  updateDiagnostics(uri: vscode.Uri, result: AnalysisResult): void {
    const diagnostics: vscode.Diagnostic[] = [];
    
    for (const pkg of result.packages) {
      if (pkg.status === 'outdated') {
        diagnostics.push(new vscode.Diagnostic(
          new vscode.Range(pkg.line, 0, pkg.line, 999),
          `${pkg.name}: Update available (${pkg.currentVersion} → ${pkg.latestVersion})`,
          vscode.DiagnosticSeverity.Warning
        ));
      } else if (pkg.status === 'error') {
        diagnostics.push(new vscode.Diagnostic(
          new vscode.Range(pkg.line, 0, pkg.line, 999),
          `${pkg.name}: ${pkg.error}`,
          vscode.DiagnosticSeverity.Error
        ));
      }
    }
    
    this.diagnosticCollection.set(uri, diagnostics);
  }
}
```

### 9. Status Bar Manager

**Responsibility**: Manages status bar item

```typescript
class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  
  updateStatus(results: AnalysisResult[]): void {
    const stats = this.aggregateStatistics(results);
    
    if (stats.errors > 0) {
      this.statusBarItem.text = `$(error) Dependencies: ${stats.errors} errors`;
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    } else if (stats.outdated > 0) {
      this.statusBarItem.text = `$(warning) Dependencies: ${stats.outdated} outdated`;
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
      this.statusBarItem.text = `$(check) Dependencies: OK`;
      this.statusBarItem.backgroundColor = undefined;
    }
    
    this.statusBarItem.show();
  }
}
```

### 10. Webview Manager

**Responsibility**: Manages rich UI panel

```typescript
class WebviewManager {
  private panel: vscode.WebviewPanel | undefined;
  
  showAnalysis(result: AnalysisResult): void {
    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'packmanAnalysis',
        'Pack-Man Analysis',
        vscode.ViewColumn.Two,
        { enableScripts: true }
      );
    }
    
    this.panel.webview.html = this.generateHTML(result);
    this.panel.reveal();
  }
  
  private generateHTML(result: AnalysisResult): string {
    // Generate HTML with statistics and package list
    // Include update actions
    // Respect VS Code theme
  }
}
```

### 11. Terminal Manager

**Responsibility**: Executes commands in integrated terminal

```typescript
class TerminalManager {
  private terminal: vscode.Terminal | undefined;
  
  runCommand(command: string, cwd: string): Promise<void> {
    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal('Pack-Man');
    }
    
    this.terminal.show();
    this.terminal.sendText(`cd "${cwd}" && ${command}`);
    
    // Wait for command completion
    return this.waitForCompletion();
  }
}
```

## Data Models

### Configuration

```typescript
interface ExtensionConfiguration {
  apiEndpoint: string; // Default: 'https://pack-man.vercel.app'
  githubToken?: string; // Stored in SecretStorage
  cacheSuccessTTL: number; // Default: 300000 (5 minutes)
  cacheErrorTTL: number; // Default: 120000 (2 minutes)
  maxCacheSize: number; // Default: 100
  autoAnalyzeOnSave: boolean; // Default: true
  showCodeLens: boolean; // Default: true
  showDiagnostics: boolean; // Default: true
}
```

### Workspace State

```typescript
interface WorkspaceState {
  analysisResults: Map<string, AnalysisResult>; // URI -> Result
  lastAnalysisTime: Map<string, number>; // URI -> Timestamp
  packageFiles: vscode.Uri[]; // Detected package files
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Extension activation for package files

*For any* workspace containing at least one package file (package.json, requirements.txt, or pubspec.yaml), the extension should activate automatically.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: CodeLens indicators for all dependencies

*For any* package file with dependencies, the extension should display CodeLens indicators above each dependency entry.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Status-specific CodeLens formatting

*For any* dependency with a known status (up-to-date, outdated, or error), the CodeLens indicator should display the appropriate icon and text format matching that status.

**Validates: Requirements 2.4, 2.5, 2.6**

### Property 4: Hover card display

*For any* dependency name in a package file, hovering over it should display a hover card with package details.

**Validates: Requirements 3.1**

### Property 5: Hover card completeness

*For any* hover card displayed, it should include current version, latest version, status, documentation link, and registry URL.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 6: Diagnostic creation for issues

*For any* dependency that is outdated or has an error, the extension should create a corresponding diagnostic in the Problems panel with appropriate severity.

**Validates: Requirements 4.1, 4.2**

### Property 7: Diagnostic content completeness

*For any* diagnostic created, it should include the package name, current version, and latest version (or error message).

**Validates: Requirements 4.3**

### Property 8: Diagnostic cleanup on update

*For any* dependency that is updated from outdated to up-to-date, the corresponding diagnostic should be removed from the Problems panel.

**Validates: Requirements 4.4**

### Property 9: Status bar visibility

*For any* active extension state, a status bar item showing dependency health should be visible.

**Validates: Requirements 5.1**

### Property 10: Status bar content for issues

*For any* workspace with outdated dependencies or errors, the status bar should display the count and appropriate warning/error styling.

**Validates: Requirements 5.3, 5.4**

### Property 11: Status bar click action

*For any* click on the status bar item, the extension should open the detailed analysis webview.

**Validates: Requirements 5.5**

### Property 12: Single dependency update

*For any* CodeLens "Update" action clicked, the extension should update that specific dependency in the package file to the latest version.

**Validates: Requirements 6.1**

### Property 13: File formatting preservation

*For any* dependency update (single or bulk), the file formatting and comments should remain unchanged except for the version number.

**Validates: Requirements 6.2, 7.3**

### Property 14: Update progress feedback

*For any* update operation, the extension should display a progress notification during the update.

**Validates: Requirements 6.3**

### Property 15: Update success notification

*For any* successful dependency update, the extension should display a success notification including the new version.

**Validates: Requirements 6.4**

### Property 16: Update failure notification

*For any* failed dependency update, the extension should display an error notification with the failure reason.

**Validates: Requirements 6.5**

### Property 17: Bulk update execution

*For any* "Update All Dependencies" command execution, all outdated packages in the active file should be updated.

**Validates: Requirements 7.1**

### Property 18: Bulk update progress

*For any* bulk update operation, the extension should show a progress indicator with the current package being updated.

**Validates: Requirements 7.2**

### Property 19: Bulk update summary

*For any* completed bulk update, the extension should display a summary notification with counts of successful and failed updates.

**Validates: Requirements 7.4, 7.5**

### Property 20: Auto-analysis on save

*For any* save event on a package file, the extension should automatically re-analyze all dependencies.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 21: UI update after re-analysis

*For any* completed re-analysis, all UI elements (CodeLens, diagnostics, status bar) should be updated with the new data.

**Validates: Requirements 8.4, 9.4**

### Property 22: Cache usage during re-analysis

*For any* re-analysis with valid cached data, the extension should use cached results instead of making new API calls.

**Validates: Requirements 8.5**

### Property 23: Manual analysis command

*For any* "Analyze Dependencies" command execution, the extension should analyze the active package file.

**Validates: Requirements 9.1**

### Property 24: Workspace analysis command

*For any* "Analyze Workspace" command execution, the extension should analyze all package files in the workspace.

**Validates: Requirements 9.2**

### Property 25: Analysis progress feedback

*For any* analysis operation, the extension should display a progress notification.

**Validates: Requirements 9.3**

### Property 26: Analysis failure notification

*For any* failed analysis, the extension should display an error notification with troubleshooting guidance.

**Validates: Requirements 9.5**

### Property 27: API endpoint validation

*For any* API endpoint change, the extension should validate the new endpoint before saving.

**Validates: Requirements 10.3**

### Property 28: Invalid endpoint handling

*For any* invalid API endpoint, the extension should display an error message and revert to the previous value.

**Validates: Requirements 10.4**

### Property 29: Cache invalidation on endpoint change

*For any* API endpoint change, the extension should clear all cached results and trigger re-analysis.

**Validates: Requirements 10.5, 12.5**

### Property 30: GitHub token inclusion

*For any* configured GitHub token, the extension should include it in all API requests.

**Validates: Requirements 11.2**

### Property 31: Authentication error prompts

*For any* API request failing with authentication errors, the extension should prompt the user to configure a GitHub token.

**Validates: Requirements 11.3**

### Property 32: Invalid token handling

*For any* invalid GitHub token, the extension should display an error message with token setup instructions.

**Validates: Requirements 11.4**

### Property 33: Token removal

*For any* cleared GitHub token, the extension should remove it from all subsequent API requests.

**Validates: Requirements 11.5**

### Property 34: Success response caching

*For any* successful API response, the extension should cache it for 5 minutes.

**Validates: Requirements 12.1**

### Property 35: Error response caching

*For any* error API response, the extension should cache it for 2 minutes.

**Validates: Requirements 12.2**

### Property 36: Cache usage

*For any* analysis request with valid cached data, the extension should use the cached result instead of making an API call.

**Validates: Requirements 12.3**

### Property 37: Cache size management

*For any* cache exceeding 100 entries, the extension should remove the oldest entries.

**Validates: Requirements 12.4**

### Property 38: Webview opening

*For any* "Show Analysis" command execution, the extension should open a webview panel with detailed results.

**Validates: Requirements 13.1**

### Property 39: Webview statistics display

*For any* webview displayed, it should show statistics for up-to-date, outdated, and error packages.

**Validates: Requirements 13.2**

### Property 40: Webview package list

*For any* webview displayed, it should list all packages with their status, current version, and latest version.

**Validates: Requirements 13.3**

### Property 41: Webview update actions

*For any* outdated package in the webview, an update action should be available.

**Validates: Requirements 13.4**

### Property 42: Webview theme support

*For any* VS Code theme (light or dark), the webview should respect and apply the appropriate theme.

**Validates: Requirements 13.5**

### Property 43: Multi-root detection

*For any* multi-root workspace, the extension should detect package files in all workspace folders.

**Validates: Requirements 14.1**

### Property 44: Independent folder analysis

*For any* multi-root workspace, each workspace folder should be analyzed independently.

**Validates: Requirements 14.2**

### Property 45: Status aggregation

*For any* multi-root workspace, the status bar should aggregate dependency health across all workspace folders.

**Validates: Requirements 14.3**

### Property 46: Update isolation

*For any* dependency update in a multi-root workspace, the update should only affect the relevant workspace folder.

**Validates: Requirements 14.4**

### Property 47: Dynamic workspace updates

*For any* workspace folder addition or removal, the extension should update analysis accordingly.

**Validates: Requirements 14.5**

### Property 48: Package.json parsing completeness

*For any* package.json file, the parser should extract both dependencies and devDependencies sections.

**Validates: Requirements 15.1**

### Property 49: Requirements.txt version specifier handling

*For any* requirements.txt file with version specifiers (==, >=, ~=, etc.), the parser should correctly handle all specifier types.

**Validates: Requirements 15.2**

### Property 50: Pubspec.yaml parsing completeness

*For any* pubspec.yaml file, the parser should extract both dependencies and dev_dependencies sections.

**Validates: Requirements 15.3**

### Property 51: Parse error diagnostics

*For any* parsing failure, the extension should display an error diagnostic at the parse error location.

**Validates: Requirements 15.4**

### Property 52: Parse error message quality

*For any* syntax error in a package file, the error message should include the line number.

**Validates: Requirements 15.5**

### Property 53: API retry logic

*For any* API request timeout, the extension should retry up to 3 times with exponential backoff.

**Validates: Requirements 16.1**

### Property 54: Final failure messaging

*For any* API request failing after all retries, the extension should display a user-friendly error message.

**Validates: Requirements 16.2**

### Property 55: Rate limit guidance

*For any* rate limit error, the extension should display a message suggesting GitHub token configuration.

**Validates: Requirements 16.3**

### Property 56: Network error guidance

*For any* unreachable API endpoint, the extension should suggest checking network connectivity and API endpoint configuration.

**Validates: Requirements 16.4**

### Property 57: Error logging

*For any* API error, the extension should log detailed error information for troubleshooting.

**Validates: Requirements 16.5**

### Property 58: CodeLens debouncing

*For any* rapid document changes, CodeLens updates should be debounced by at least 300 milliseconds.

**Validates: Requirements 17.3**

### Property 59: Keybinding command triggering

*For any* configured keybinding press, the extension should trigger the corresponding command.

**Validates: Requirements 18.1, 18.2**

### Property 60: Keybinding functional equivalence

*For any* command triggered by keybinding, it should produce the same result as triggering via command palette.

**Validates: Requirements 18.5**

### Property 61: Update command generation

*For any* package file type, the extension should generate the appropriate update command for that package manager (npm, pip, or pub).

**Validates: Requirements 19.1, 19.2, 19.3**

### Property 62: Clipboard copy action

*For any* update command displayed, a "Copy to Clipboard" action should be available.

**Validates: Requirements 19.4**

### Property 63: Terminal run action

*For any* update command displayed, a "Run in Terminal" action should be available.

**Validates: Requirements 19.5**

### Property 64: Terminal management

*For any* "Run in Terminal" action, the extension should open a new terminal or reuse an existing Pack-Man terminal.

**Validates: Requirements 20.1**

### Property 65: Command execution context

*For any* command run in the terminal, it should execute in the correct workspace folder.

**Validates: Requirements 20.2**

### Property 66: Command completion sequencing

*For any* terminal command execution, the extension should wait for completion before re-analyzing.

**Validates: Requirements 20.3**

### Property 67: Terminal error output

*For any* failed terminal command, the extension should display the terminal output for debugging.

**Validates: Requirements 20.4**

### Property 68: Auto-analysis after terminal success

*For any* successful terminal command, the extension should automatically re-analyze dependencies.

**Validates: Requirements 20.5**

## Error Handling

### Parser Errors

- **Syntax Errors**: Display diagnostic at error location with line number and helpful message
- **Invalid Format**: Show error notification explaining expected format
- **Missing Fields**: Treat as empty dependency list, log warning

### API Errors

- **Network Errors**: Retry with exponential backoff (100ms, 200ms, 400ms), then show user-friendly error
- **Timeout**: Retry up to 3 times, then display timeout error with troubleshooting steps
- **Rate Limiting**: Cache error response, suggest GitHub token configuration
- **Authentication Errors**: Prompt for GitHub token with setup instructions
- **Invalid Response**: Log error details, show generic error to user

### File System Errors

- **File Not Found**: Clear analysis for that file, remove from tracked files
- **Permission Denied**: Show error notification, suggest checking file permissions
- **File Too Large**: Skip analysis, show warning about file size

### Update Errors

- **Write Permission**: Show error notification, suggest checking file permissions
- **Invalid Version**: Show error with valid version format examples
- **Concurrent Modification**: Detect file changes, prompt user to retry

### Configuration Errors

- **Invalid API Endpoint**: Validate URL format, show error and revert to previous value
- **Invalid GitHub Token**: Show error with token format requirements
- **Missing Configuration**: Use default values, log info message

## Testing Strategy

### Unit Testing

The extension will use **Vitest** for unit testing, consistent with the Pack-Man web application.

**Unit Test Coverage:**

- **Parser Service**: Test parsing of package.json, requirements.txt, and pubspec.yaml with various formats
- **Cache Service**: Test TTL expiration, size limits, and cleanup
- **API Client Service**: Test request formatting, retry logic, and error handling (with mocked HTTP)
- **Analysis Service**: Test result aggregation and state management
- **Configuration**: Test validation logic for API endpoint and GitHub token

**Example Unit Test:**

```typescript
import { describe, it, expect } from 'vitest';
import { ParserService } from '../services/parserService';

describe('ParserService', () => {
  it('should extract dependencies from package.json', () => {
    const content = JSON.stringify({
      dependencies: { 'react': '^18.0.0' },
      devDependencies: { 'vitest': '^4.0.0' }
    });
    
    const result = new ParserService().parseFile(content, 'package.json');
    
    expect(result.packages).toHaveLength(2);
    expect(result.packages[0].name).toBe('react');
    expect(result.packages[1].name).toBe('vitest');
  });
});
```

### Property-Based Testing

The extension will use **fast-check** for property-based testing, which is the standard PBT library for TypeScript/JavaScript.

**Property Test Configuration:**
- Minimum 100 iterations per property test
- Each property test tagged with comment referencing design document property
- Format: `// Feature: vscode-extension, Property N: [property text]`

**Property Test Coverage:**

- **Parser Round-Trip**: Generate random package files, parse them, verify structure preservation
- **Cache Behavior**: Generate random cache operations, verify TTL and size limits are respected
- **Update Preservation**: Generate random package files, apply updates, verify formatting is preserved
- **Status Aggregation**: Generate random analysis results, verify statistics are calculated correctly
- **Multi-root Isolation**: Generate random multi-root workspaces, verify updates don't cross boundaries

**Example Property Test:**

```typescript
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { ParserService } from '../services/parserService';

describe('ParserService Properties', () => {
  // Feature: vscode-extension, Property 48: Package.json parsing completeness
  it('should extract all dependencies from any valid package.json', () => {
    fc.assert(
      fc.property(
        fc.record({
          dependencies: fc.dictionary(fc.string(), fc.string()),
          devDependencies: fc.dictionary(fc.string(), fc.string())
        }),
        (packageJson) => {
          const content = JSON.stringify(packageJson);
          const result = new ParserService().parseFile(content, 'package.json');
          
          const expectedCount = 
            Object.keys(packageJson.dependencies || {}).length +
            Object.keys(packageJson.devDependencies || {}).length;
          
          return result.packages.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**VS Code Extension Test Runner:**

- Use `@vscode/test-electron` for integration tests
- Test provider registration and lifecycle
- Test command execution and UI updates
- Test file watcher behavior
- Test multi-root workspace scenarios

**Example Integration Test:**

```typescript
import * as vscode from 'vscode';
import { describe, it, expect } from 'vitest';

describe('Extension Integration', () => {
  it('should activate when package.json is opened', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{"dependencies": {}}',
      language: 'json'
    });
    
    await vscode.window.showTextDocument(doc);
    
    // Verify extension activated
    const extension = vscode.extensions.getExtension('pack-man.vscode-extension');
    expect(extension?.isActive).toBe(true);
  });
});
```

### Manual Testing Checklist

- [ ] Extension activates for each package file type
- [ ] CodeLens indicators appear and update correctly
- [ ] Hover cards display complete information
- [ ] Diagnostics appear in Problems panel
- [ ] Status bar updates reflect workspace state
- [ ] Single dependency updates work correctly
- [ ] Bulk updates work correctly
- [ ] File formatting is preserved after updates
- [ ] Auto-analysis on save works
- [ ] Manual analysis commands work
- [ ] Configuration changes take effect
- [ ] GitHub token authentication works
- [ ] Caching reduces API calls
- [ ] Webview displays correctly in both themes
- [ ] Multi-root workspaces are handled correctly
- [ ] Terminal integration works
- [ ] Keybindings trigger commands
- [ ] Error messages are helpful

## Performance Considerations

### Activation Time

- Lazy load heavy dependencies
- Defer provider registration until needed
- Use activation events to minimize unnecessary activation
- Target: < 500ms activation time

### Parsing Performance

- Use incremental parsing for large files
- Cache parsed results until file changes
- Parse only visible portions for very large files
- Debounce parse operations (300ms)

### API Call Optimization

- Batch multiple package analyses into single API call
- Use cache aggressively (5min success, 2min error)
- Implement request deduplication
- Respect rate limits

### UI Responsiveness

- Debounce CodeLens updates (300ms)
- Use virtual scrolling for large package lists in webview
- Process analysis results asynchronously
- Show progress for long operations

### Memory Management

- Limit cache size to 100 entries
- Clean up expired cache entries periodically
- Dispose providers and subscriptions properly
- Use weak references where appropriate

## Security Considerations

### Token Storage

- Store GitHub tokens in VS Code's SecretStorage API
- Never log tokens or include in error messages
- Clear tokens from memory after use
- Validate token format before storage

### API Communication

- Use HTTPS only for API requests
- Validate API responses before processing
- Implement request timeouts (30 seconds)
- Sanitize user input before sending to API

### File Operations

- Validate file paths before reading/writing
- Check file permissions before updates
- Use atomic writes to prevent corruption
- Backup files before bulk updates

## Deployment

### Extension Packaging

```bash
# Install vsce
npm install -g @vscode/vsce

# Package extension
vsce package

# Output: pack-man-vscode-1.0.0.vsix
```

### Publishing to Marketplace

```bash
# Create publisher account at https://marketplace.visualstudio.com/manage

# Login
vsce login <publisher-name>

# Publish
vsce publish
```

### Extension Manifest (package.json)

```json
{
  "name": "pack-man-vscode",
  "displayName": "Pack-Man Dependency Analyzer",
  "description": "Analyze and update package dependencies directly in VS Code",
  "version": "1.0.0",
  "publisher": "pack-man",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "activationEvents": [
    "onLanguage:json",
    "onLanguage:yaml",
    "onLanguage:plaintext",
    "workspaceContains:**/package.json",
    "workspaceContains:**/requirements.txt",
    "workspaceContains:**/pubspec.yaml"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "packman.analyzeDependencies",
        "title": "Pack-Man: Analyze Dependencies"
      },
      {
        "command": "packman.analyzeWorkspace",
        "title": "Pack-Man: Analyze Workspace"
      },
      {
        "command": "packman.updateDependency",
        "title": "Pack-Man: Update Dependency"
      },
      {
        "command": "packman.updateAll",
        "title": "Pack-Man: Update All Dependencies"
      },
      {
        "command": "packman.showAnalysis",
        "title": "Pack-Man: Show Analysis"
      }
    ],
    "configuration": {
      "title": "Pack-Man",
      "properties": {
        "packman.apiEndpoint": {
          "type": "string",
          "default": "https://pack-man.vercel.app",
          "description": "Pack-Man API endpoint URL"
        },
        "packman.autoAnalyzeOnSave": {
          "type": "boolean",
          "default": true,
          "description": "Automatically analyze dependencies when package files are saved"
        },
        "packman.showCodeLens": {
          "type": "boolean",
          "default": true,
          "description": "Show CodeLens indicators above dependencies"
        },
        "packman.showDiagnostics": {
          "type": "boolean",
          "default": true,
          "description": "Show diagnostics in Problems panel"
        }
      }
    },
    "keybindings": [
      {
        "command": "packman.analyzeDependencies",
        "key": "ctrl+shift+p a",
        "mac": "cmd+shift+p a"
      },
      {
        "command": "packman.updateAll",
        "key": "ctrl+shift+p u",
        "mac": "cmd+shift+p u"
      }
    ]
  }
}
```

## Future Enhancements

- **Monorepo Support**: Detect and handle monorepo structures (Lerna, Nx, Turborepo)
- **Dependency Graph**: Visualize dependency relationships
- **Security Scanning**: Integrate vulnerability scanning
- **Automated PRs**: Create pull requests for dependency updates
- **CI/CD Integration**: Trigger analysis in CI pipelines
- **Custom Registries**: Support private npm/pip/pub registries
- **Dependency Insights**: Show download stats, maintenance status, license info
- **Smart Updates**: Suggest update strategies based on semver and changelog analysis
