# Implementation Plan

**Important**: During implementation, always reference the official VS Code Extension API documentation at https://code.visualstudio.com/api for:
- Extension capabilities and contribution points
- API references and interfaces  
- Best practices and patterns
- Sample code and examples

All code will be implemented in the `vscode-extension/` folder as a self-contained, portable extension.

---

- [x] 1. Set up VS Code extension project structure





  - Initialize extension project in vscode-extension/ folder with TypeScript and required dependencies
  - Create package.json with VS Code extension configuration
  - Configure build system (esbuild or webpack) for extension bundling
  - Set up Vitest for unit testing and fast-check for property-based testing
  - Configure VS Code extension test runner for integration tests
  - Create directory structure: vscode-extension/src/extension.ts, vscode-extension/src/providers/, vscode-extension/src/services/, vscode-extension/src/commands/, vscode-extension/src/ui/
  - Create tsconfig.json specific to the extension (isolated from main project)
  - Add .vscodeignore for extension packaging
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Implement core services layer





- [x] 2.1 Implement Cache Service


  - Create CacheService class with get, set, clear, and cleanup methods
  - Implement TTL-based expiration logic
  - Implement size-based eviction (LRU, max 100 entries)
  - Add periodic cleanup mechanism
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ]* 2.2 Write property test for Cache Service
  - **Property 34: Success response caching**
  - **Property 35: Error response caching**
  - **Property 36: Cache usage**
  - **Property 37: Cache size management**
  - **Validates: Requirements 12.1, 12.2, 12.3, 12.4**

- [x] 2.3 Implement Parser Service


  - Create ParserService class in vscode-extension/src/services/parserService.ts
  - Implement package.json parser (extract dependencies and devDependencies)
  - Implement requirements.txt parser (handle version specifiers: ==, >=, ~=, etc.)
  - Implement pubspec.yaml parser (extract dependencies and dev_dependencies)
  - Add error handling with line number tracking
  - Note: This is a self-contained implementation, independent from the main Pack-Man parsers
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 2.4 Write property test for Parser Service
  - **Property 48: Package.json parsing completeness**
  - **Property 49: Requirements.txt version specifier handling**
  - **Property 50: Pubspec.yaml parsing completeness**
  - **Property 51: Parse error diagnostics**
  - **Property 52: Parse error message quality**
  - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5**

- [x] 2.5 Implement API Client Service


  - Create APIClientService class with analyzePackages method
  - Implement HTTP client using axios or node-fetch
  - Add retry logic with exponential backoff (3 retries)
  - Implement timeout handling (30 seconds)
  - Add GitHub token support in request headers
  - Integrate with CacheService for response caching
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 11.2_

- [ ]* 2.6 Write property test for API Client Service
  - **Property 53: API retry logic**
  - **Property 54: Final failure messaging**
  - **Property 30: GitHub token inclusion**
  - **Validates: Requirements 16.1, 16.2, 11.2**

- [x] 2.7 Implement Analysis Service


  - Create AnalysisService class orchestrating parser and API client
  - Implement analyzeFile method combining parsing and API analysis
  - Implement analyzeWorkspace method for multi-file analysis
  - Add result caching and event emitter for updates
  - Implement statistics aggregation
  - _Requirements: 9.1, 9.2, 14.2_

- [ ]* 2.8 Write property test for Analysis Service
  - **Property 23: Manual analysis command**
  - **Property 24: Workspace analysis command**
  - **Property 45: Status aggregation**
  - **Validates: Requirements 9.1, 9.2, 14.3**

- [x] 3. Implement extension activation and lifecycle





- [x] 3.1 Create extension entry point


  - Implement activate() function in src/extension.ts
  - Initialize all services (Cache, Parser, API Client, Analysis)
  - Set up configuration watchers for API endpoint and GitHub token
  - Implement deactivate() function for cleanup
  - Add activation event handlers
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 3.2 Write property test for extension activation
  - **Property 1: Extension activation for package files**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 3.3 Implement configuration management

  - Create configuration getter for packman.apiEndpoint
  - Create configuration getter for packman.githubToken (from SecretStorage)
  - Implement API endpoint validation
  - Add configuration change handlers
  - Implement cache invalidation on configuration change
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1_

- [ ]* 3.4 Write property test for configuration management
  - **Property 27: API endpoint validation**
  - **Property 28: Invalid endpoint handling**
  - **Property 29: Cache invalidation on endpoint change**
  - **Validates: Requirements 10.3, 10.4, 10.5**

- [x] 4. Implement CodeLens provider




- [x] 4.1 Create CodeLens provider class


  - Implement DependencyCodeLensProvider class
  - Implement provideCodeLenses method
  - Implement resolveCodeLens method
  - Add debouncing logic (300ms)
  - Register provider for json, yaml, and plaintext languages
  - _Requirements: 2.1, 2.2, 2.3, 17.3_


- [x] 4.2 Implement CodeLens indicator formatting

  - Create CodeLens for up-to-date dependencies (green checkmark, "Up to date")
  - Create CodeLens for outdated dependencies (yellow warning, "Update available: [version]")
  - Create CodeLens for error dependencies (red error, error message)
  - Add "Update" command to outdated dependency CodeLens
  - _Requirements: 2.4, 2.5, 2.6_

- [ ]* 4.3 Write property test for CodeLens provider
  - **Property 2: CodeLens indicators for all dependencies**
  - **Property 3: Status-specific CodeLens formatting**
  - **Property 58: CodeLens debouncing**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 17.3**

- [x] 5. Implement Hover provider





- [x] 5.1 Create Hover provider class


  - Implement DependencyHoverProvider class
  - Implement provideHover method
  - Detect if cursor position is on a dependency name
  - Register provider for json, yaml, and plaintext languages
  - _Requirements: 3.1_

- [x] 5.2 Implement hover card content


  - Create markdown content with current version, latest version, and status
  - Add documentation link
  - Add registry URL
  - Add error message for error status
  - Style hover card appropriately
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ]* 5.3 Write property test for Hover provider
  - **Property 4: Hover card display**
  - **Property 5: Hover card completeness**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 6. Implement Diagnostic provider




- [x] 6.1 Create Diagnostic provider class


  - Implement DependencyDiagnosticProvider class
  - Create diagnostic collection
  - Implement updateDiagnostics method
  - Subscribe to analysis updates
  - _Requirements: 4.1, 4.2_

- [x] 6.2 Implement diagnostic creation and management



  - Create warning diagnostics for outdated dependencies
  - Create error diagnostics for error dependencies
  - Include package name, current version, and latest version in diagnostic message
  - Implement diagnostic cleanup on update
  - Implement diagnostic clearing when all dependencies are up-to-date
  - _Requirements: 4.3, 4.4, 4.5_

- [ ]* 6.3 Write property test for Diagnostic provider
  - **Property 6: Diagnostic creation for issues**
  - **Property 7: Diagnostic content completeness**
  - **Property 8: Diagnostic cleanup on update**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [x] 7. Implement Status Bar manager


- [x] 7.1 Create Status Bar manager class


  - Implement StatusBarManager class
  - Create status bar item
  - Subscribe to analysis updates
  - Implement status aggregation across all workspace files
  - _Requirements: 5.1_

- [x] 7.2 Implement status bar content updates







  - Display green checkmark with "Dependencies: OK" when all up-to-date
  - Display yellow warning with "Dependencies: [count] outdated" when outdated exist
  - Display red error with "Dependencies: [count] errors" when errors exist
  - Add click handler to open webview
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ]* 7.3 Write property test for Status Bar manager
  - **Property 9: Status bar visibility**
  - **Property 10: Status bar content for issues**
  - **Property 11: Status bar click action**
  - **Validates: Requirements 5.1, 5.3, 5.4, 5.5**

- [x] 8. Implement update functionality





- [x] 8.1 Implement single dependency update


  - Create updateDependency command handler
  - Parse package file to locate dependency
  - Update version in file content
  - Preserve file formatting and comments
  - Write updated content back to file
  - Show progress notification during update
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 8.2 Write property test for single dependency update
  - **Property 12: Single dependency update**
  - **Property 13: File formatting preservation**
  - **Property 14: Update progress feedback**
  - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 8.3 Implement update notifications


  - Display success notification with new version on successful update
  - Display error notification with failure reason on failed update
  - _Requirements: 6.4, 6.5_

- [ ]* 8.4 Write property test for update notifications
  - **Property 15: Update success notification**
  - **Property 16: Update failure notification**
  - **Validates: Requirements 6.4, 6.5**

- [x] 8.5 Implement bulk update functionality


  - Create updateAll command handler
  - Identify all outdated dependencies in active file
  - Update each dependency sequentially
  - Show progress indicator with current package name
  - Preserve file formatting and comments
  - _Requirements: 7.1, 7.2, 7.3_

- [ ]* 8.6 Write property test for bulk update
  - **Property 17: Bulk update execution**
  - **Property 18: Bulk update progress**
  - **Validates: Requirements 7.1, 7.2**

- [x] 8.7 Implement bulk update summary


  - Track successful and failed updates
  - Display summary notification with counts
  - Handle partial failures gracefully
  - _Requirements: 7.4, 7.5_

- [ ]* 8.8 Write property test for bulk update summary
  - **Property 19: Bulk update summary**
  - **Validates: Requirements 7.4, 7.5**

- [x] 9. Implement file watching and auto-analysis





- [x] 9.1 Set up file system watchers


  - Create file watcher for package.json files
  - Create file watcher for requirements.txt files
  - Create file watcher for pubspec.yaml files
  - Add debouncing to prevent excessive analysis
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 9.2 Implement auto-analysis on save


  - Trigger analysis on file save events
  - Update all UI elements after analysis
  - Use cached results when available
  - _Requirements: 8.4, 8.5_

- [ ]* 9.3 Write property test for auto-analysis
  - **Property 20: Auto-analysis on save**
  - **Property 21: UI update after re-analysis**
  - **Property 22: Cache usage during re-analysis**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

- [x] 10. Implement command palette commands





- [x] 10.1 Register analysis commands

  - Register "Pack-Man: Analyze Dependencies" command
  - Register "Pack-Man: Analyze Workspace" command
  - Implement command handlers
  - Show progress notifications during analysis
  - _Requirements: 9.1, 9.2, 9.3_

- [ ]* 10.2 Write property test for analysis commands
  - **Property 25: Analysis progress feedback**
  - **Validates: Requirements 9.3**

- [x] 10.3 Implement analysis error handling

  - Display error notifications on analysis failure
  - Include troubleshooting guidance in error messages
  - Log detailed error information
  - _Requirements: 9.5, 16.5_

- [ ]* 10.4 Write property test for analysis error handling
  - **Property 26: Analysis failure notification**
  - **Property 57: Error logging**
  - **Validates: Requirements 9.5, 16.5**

- [x] 11. Implement Webview panel





- [x] 11.1 Create Webview manager class


  - Implement WebviewManager class
  - Create webview panel with proper configuration
  - Implement showAnalysis method
  - Handle webview lifecycle (create, reveal, dispose)
  - _Requirements: 13.1_

- [ ]* 11.2 Write property test for webview opening
  - **Property 38: Webview opening**
  - **Validates: Requirements 13.1**

- [x] 11.3 Implement webview HTML generation


  - Generate HTML with statistics section (up-to-date, outdated, errors)
  - Generate package list with status, current version, latest version
  - Add update actions for outdated packages
  - Implement theme support (light/dark mode)
  - Add CSS for styling
  - _Requirements: 13.2, 13.3, 13.4, 13.5_

- [ ]* 11.4 Write property test for webview content
  - **Property 39: Webview statistics display**
  - **Property 40: Webview package list**
  - **Property 41: Webview update actions**
  - **Property 42: Webview theme support**
  - **Validates: Requirements 13.2, 13.3, 13.4, 13.5**

- [x] 11.5 Implement webview message handling


  - Set up message passing between webview and extension
  - Handle update action messages from webview
  - Update webview content when analysis changes
  - _Requirements: 13.4_

- [x] 12. Implement multi-root workspace support




- [x] 12.1 Implement workspace folder detection


  - Detect package files in all workspace folders
  - Track analysis results per workspace folder
  - Handle workspace folder addition/removal events
  - _Requirements: 14.1, 14.5_

- [ ]* 12.2 Write property test for multi-root detection
  - **Property 43: Multi-root detection**
  - **Property 47: Dynamic workspace updates**
  - **Validates: Requirements 14.1, 14.5**

- [x] 12.3 Implement independent folder analysis





  - Analyze each workspace folder independently
  - Maintain separate analysis results per folder
  - Aggregate statistics across all folders for status bar
  - _Requirements: 14.2, 14.3_

- [ ]* 12.4 Write property test for multi-root analysis
  - **Property 44: Independent folder analysis**
  - **Property 45: Status aggregation**
  - **Validates: Requirements 14.2, 14.3**


- [x] 12.5 Implement update isolation

  - Ensure updates only affect the relevant workspace folder
  - Verify file paths are resolved correctly per folder
  - _Requirements: 14.4_

- [ ]* 12.6 Write property test for update isolation
  - **Property 46: Update isolation**
  - **Validates: Requirements 14.4**

- [X] 13. Implement Terminal integration




- [x] 13.1 Create Terminal manager class

  - Implement TerminalManager class
  - Create or reuse Pack-Man terminal
  - Implement runCommand method
  - Handle terminal lifecycle
  - _Requirements: 20.1_

- [ ]* 13.2 Write property test for terminal management
  - **Property 64: Terminal management**
  - **Validates: Requirements 20.1**

- [x] 13.3 Implement command execution

  - Execute commands in correct workspace folder
  - Wait for command completion
  - Capture terminal output
  - _Requirements: 20.2, 20.3_

- [ ]* 13.4 Write property test for command execution
  - **Property 65: Command execution context**
  - **Property 66: Command completion sequencing**
  - **Validates: Requirements 20.2, 20.3**

- [x] 13.5 Implement terminal error handling

  - Display terminal output on command failure
  - Trigger re-analysis on command success
  - _Requirements: 20.4, 20.5_

- [ ]* 13.6 Write property test for terminal error handling
  - **Property 67: Terminal error output**
  - **Property 68: Auto-analysis after terminal success**
  - **Validates: Requirements 20.4, 20.5**

- [x] 14. Implement update command generation




- [x] 14.1 Create command generator

  - Generate npm update commands for package.json
  - Generate pip install commands for requirements.txt
  - Generate pub upgrade commands for pubspec.yaml
  - Format commands with proper syntax
  - _Requirements: 19.1, 19.2, 19.3_

- [ ]* 14.2 Write property test for command generation
  - **Property 61: Update command generation**
  - **Validates: Requirements 19.1, 19.2, 19.3**

- [x] 14.3 Implement command actions

  - Add "Copy to Clipboard" action for commands
  - Add "Run in Terminal" action for commands
  - Integrate with TerminalManager for execution
  - _Requirements: 19.4, 19.5_

- [ ]* 14.4 Write property test for command actions
  - **Property 62: Clipboard copy action**
  - **Property 63: Terminal run action**
  - **Validates: Requirements 19.4, 19.5**

- [x] 15. Implement keybindings




- [x] 15.1 Configure keybindings in package.json

  - Add keybinding for "Analyze Dependencies" command
  - Add keybinding for "Update All Dependencies" command
  - Provide default keybinding suggestions
  - _Requirements: 18.1, 18.2, 18.4_

- [ ]* 15.2 Write property test for keybindings
  - **Property 59: Keybinding command triggering**
  - **Property 60: Keybinding functional equivalence**
  - **Validates: Requirements 18.1, 18.2, 18.5**

- [x] 16. Implement error handling for API and authentication




- [x] 16.1 Implement authentication error handling


  - Detect authentication errors from API
  - Prompt user to configure GitHub token
  - Display error message with setup instructions for invalid tokens
  - Remove token from requests when cleared
  - _Requirements: 11.3, 11.4, 11.5_

- [ ]* 16.2 Write property test for authentication handling
  - **Property 31: Authentication error prompts**
  - **Property 32: Invalid token handling**
  - **Property 33: Token removal**
  - **Validates: Requirements 11.3, 11.4, 11.5**


- [x] 16.3 Implement rate limit handling




  - Detect rate limit errors from API
  - Display message suggesting GitHub token configuration
  - Cache rate limit errors appropriately
  - _Requirements: 16.3_

- [ ]* 16.4 Write property test for rate limit handling
  - **Property 55: Rate limit guidance**

  - **Validates: Requirements 16.3**

- [x] 16.5 Implement network error handling




  - Detect unreachable API endpoints
  - Display error with troubleshooting guidance
  - Suggest checking network connectivity and API configuration
  - _Requirements: 16.4_

- [ ]* 16.6 Write property test for network error handling
  - **Property 56: Network error guidance**
  - **Validates: Requirements 16.4**

- [x] 17. Create extension packaging and documentation




- [x] 17.1 Configure extension manifest


  - Complete vscode-extension/package.json with all metadata
  - Add activation events
  - Define commands and keybindings
  - Configure settings contributions
  - Add icon and gallery banner to vscode-extension/ folder
  - Ensure all paths are relative to vscode-extension/ folder
  - _Requirements: All requirements_

- [x] 17.2 Create README documentation


  - Create vscode-extension/README.md with installation instructions
  - Document features with screenshots
  - Add configuration guide
  - Include troubleshooting section
  - Add contribution guidelines
  - Note: This README is specific to the VS Code extension, separate from main Pack-Man README
  - _Requirements: All requirements_

- [x] 17.3 Create CHANGELOG


  - Document initial release features
  - List all implemented requirements
  - Note known limitations
  - _Requirements: All requirements_

- [x] 17.4 Set up extension packaging


  - Install vsce (VS Code Extension Manager)
  - Configure build scripts
  - Test extension packaging
  - Verify extension loads correctly from .vsix
  - _Requirements: All requirements_
