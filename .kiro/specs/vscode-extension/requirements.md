# Requirements Document

## Introduction

The Pack-Man VS Code Extension brings dependency analysis directly into the development environment, enabling developers to monitor, analyze, and update package dependencies without leaving their IDE. The extension integrates with the Pack-Man API to provide real-time dependency health information for npm (package.json), pip (requirements.txt), and pub (pubspec.yaml) projects.

## Glossary

- **Extension**: The VS Code Extension component of Pack-Man
- **CodeLens**: Inline actionable information displayed above code elements in the editor
- **Hover Provider**: VS Code feature that displays information when hovering over code
- **Diagnostic Provider**: VS Code feature that reports problems in the Problems panel
- **Status Bar**: The bottom bar in VS Code showing workspace information
- **Webview**: Custom HTML/CSS/JS UI panel within VS Code
- **Package File**: A dependency manifest file (package.json, requirements.txt, or pubspec.yaml)
- **Workspace**: The root folder(s) opened in VS Code
- **Pack-Man API**: The backend service at /api/analyze-packages endpoint
- **Dependency Health**: The status of packages (up-to-date, outdated, error)

## Requirements

### Requirement 1

**User Story:** As a developer, I want the extension to automatically activate when I open a project with package files, so that I can immediately see dependency information without manual setup.

#### Acceptance Criteria

1. WHEN a workspace contains a package.json file THEN the Extension SHALL activate automatically
2. WHEN a workspace contains a requirements.txt file THEN the Extension SHALL activate automatically
3. WHEN a workspace contains a pubspec.yaml file THEN the Extension SHALL activate automatically
4. WHEN a workspace contains multiple package file types THEN the Extension SHALL support all detected formats simultaneously
5. WHEN no package files are present THEN the Extension SHALL remain inactive to minimize resource usage

### Requirement 2

**User Story:** As a developer, I want to see inline indicators showing which dependencies are outdated, so that I can quickly identify what needs updating while reviewing my dependency files.

#### Acceptance Criteria

1. WHEN viewing a package.json file THEN the Extension SHALL display CodeLens indicators above each dependency entry
2. WHEN viewing a requirements.txt file THEN the Extension SHALL display CodeLens indicators above each package line
3. WHEN viewing a pubspec.yaml file THEN the Extension SHALL display CodeLens indicators above each dependency entry
4. WHEN a dependency is up-to-date THEN the Extension SHALL display a green checkmark indicator with "Up to date" text
5. WHEN a dependency is outdated THEN the Extension SHALL display a yellow warning indicator with "Update available: [version]" text
6. WHEN a dependency has an error THEN the Extension SHALL display a red error indicator with descriptive error text

### Requirement 3

**User Story:** As a developer, I want to hover over dependencies to see detailed package information, so that I can make informed decisions about updates without leaving the editor.

#### Acceptance Criteria

1. WHEN hovering over a dependency name THEN the Extension SHALL display a hover card with package details
2. WHEN displaying hover information THEN the Extension SHALL include current version, latest version, and status
3. WHEN displaying hover information THEN the Extension SHALL include a link to the package documentation
4. WHEN displaying hover information THEN the Extension SHALL include the package registry URL
5. WHEN a package has an error THEN the Extension SHALL display the error message in the hover card

### Requirement 4

**User Story:** As a developer, I want outdated dependencies to appear in the Problems panel, so that I can track dependency health alongside other code issues.

#### Acceptance Criteria

1. WHEN a dependency is outdated THEN the Extension SHALL create a warning diagnostic in the Problems panel
2. WHEN a dependency has an error THEN the Extension SHALL create an error diagnostic in the Problems panel
3. WHEN displaying diagnostics THEN the Extension SHALL include the package name, current version, and latest version
4. WHEN a dependency is updated THEN the Extension SHALL remove the corresponding diagnostic
5. WHEN all dependencies are up-to-date THEN the Extension SHALL clear all dependency-related diagnostics

### Requirement 5

**User Story:** As a developer, I want a status bar indicator showing overall dependency health, so that I can see project-wide dependency status at a glance.

#### Acceptance Criteria

1. WHEN the Extension is active THEN the Extension SHALL display a status bar item showing dependency health
2. WHEN all dependencies are up-to-date THEN the Extension SHALL display a green checkmark with "Dependencies: OK" text
3. WHEN outdated dependencies exist THEN the Extension SHALL display a yellow warning with "Dependencies: [count] outdated" text
4. WHEN dependency errors exist THEN the Extension SHALL display a red error with "Dependencies: [count] errors" text
5. WHEN clicking the status bar item THEN the Extension SHALL open a detailed analysis webview

### Requirement 6

**User Story:** As a developer, I want to update individual dependencies with a single click, so that I can quickly apply updates without manually editing files or running terminal commands.

#### Acceptance Criteria

1. WHEN clicking a CodeLens "Update" action THEN the Extension SHALL update that specific dependency in the package file
2. WHEN updating a dependency THEN the Extension SHALL preserve file formatting and comments
3. WHEN updating a dependency THEN the Extension SHALL show a progress notification
4. WHEN an update succeeds THEN the Extension SHALL display a success notification with the new version
5. WHEN an update fails THEN the Extension SHALL display an error notification with the failure reason

### Requirement 7

**User Story:** As a developer, I want to update all outdated dependencies at once, so that I can efficiently maintain my project without updating packages one by one.

#### Acceptance Criteria

1. WHEN executing the "Update All Dependencies" command THEN the Extension SHALL update all outdated packages in the active file
2. WHEN updating multiple dependencies THEN the Extension SHALL show a progress indicator with current package being updated
3. WHEN updating multiple dependencies THEN the Extension SHALL preserve file formatting and comments
4. WHEN all updates succeed THEN the Extension SHALL display a summary notification with the count of updated packages
5. WHEN some updates fail THEN the Extension SHALL display a summary with successful and failed update counts

### Requirement 8

**User Story:** As a developer, I want the extension to automatically re-analyze dependencies when I save package files, so that I always see current dependency status without manual refreshes.

#### Acceptance Criteria

1. WHEN saving a package.json file THEN the Extension SHALL automatically re-analyze all dependencies
2. WHEN saving a requirements.txt file THEN the Extension SHALL automatically re-analyze all dependencies
3. WHEN saving a pubspec.yaml file THEN the Extension SHALL automatically re-analyze all dependencies
4. WHEN re-analyzing THEN the Extension SHALL update all CodeLens indicators, diagnostics, and status bar items
5. WHEN re-analyzing THEN the Extension SHALL use cached results when available to minimize API calls

### Requirement 9

**User Story:** As a developer, I want to manually trigger dependency analysis via command palette, so that I can refresh dependency information on demand.

#### Acceptance Criteria

1. WHEN executing "Pack-Man: Analyze Dependencies" command THEN the Extension SHALL analyze the active package file
2. WHEN executing "Pack-Man: Analyze Workspace" command THEN the Extension SHALL analyze all package files in the workspace
3. WHEN analysis is in progress THEN the Extension SHALL display a progress notification
4. WHEN analysis completes THEN the Extension SHALL update all UI elements with new data
5. WHEN analysis fails THEN the Extension SHALL display an error notification with troubleshooting guidance

### Requirement 10

**User Story:** As a developer, I want to configure the Pack-Man API endpoint, so that I can use self-hosted instances or development servers.

#### Acceptance Criteria

1. WHEN opening extension settings THEN the Extension SHALL provide a "packman.apiEndpoint" configuration option
2. WHEN the API endpoint is not configured THEN the Extension SHALL use the default production endpoint
3. WHEN changing the API endpoint THEN the Extension SHALL validate the new endpoint before saving
4. WHEN the API endpoint is invalid THEN the Extension SHALL display an error message and revert to the previous value
5. WHEN the API endpoint changes THEN the Extension SHALL clear cached results and re-analyze

### Requirement 11

**User Story:** As a developer working with private repositories, I want to configure a GitHub token, so that I can analyze dependencies in private packages that require authentication.

#### Acceptance Criteria

1. WHEN opening extension settings THEN the Extension SHALL provide a "packman.githubToken" configuration option stored securely
2. WHEN a GitHub token is configured THEN the Extension SHALL include it in API requests
3. WHEN API requests fail with authentication errors THEN the Extension SHALL prompt the user to configure a GitHub token
4. WHEN the GitHub token is invalid THEN the Extension SHALL display an error message with token setup instructions
5. WHEN the GitHub token is cleared THEN the Extension SHALL remove it from all subsequent API requests

### Requirement 12

**User Story:** As a developer, I want the extension to cache API responses, so that I can work efficiently without repeated network requests for the same data.

#### Acceptance Criteria

1. WHEN analyzing dependencies THEN the Extension SHALL cache successful API responses for 5 minutes
2. WHEN analyzing dependencies THEN the Extension SHALL cache error responses for 2 minutes
3. WHEN cached data is available and not expired THEN the Extension SHALL use cached results instead of making API calls
4. WHEN the cache exceeds 100 entries THEN the Extension SHALL remove the oldest entries
5. WHEN the API endpoint changes THEN the Extension SHALL clear all cached data

### Requirement 13

**User Story:** As a developer, I want to view detailed dependency analysis in a rich UI panel, so that I can see comprehensive information beyond inline indicators.

#### Acceptance Criteria

1. WHEN executing "Pack-Man: Show Analysis" command THEN the Extension SHALL open a webview panel with detailed results
2. WHEN displaying the webview THEN the Extension SHALL show statistics for up-to-date, outdated, and error packages
3. WHEN displaying the webview THEN the Extension SHALL list all packages with their status, current version, and latest version
4. WHEN displaying the webview THEN the Extension SHALL provide update actions for each outdated package
5. WHEN displaying the webview THEN the Extension SHALL respect the user's VS Code theme (light/dark mode)

### Requirement 14

**User Story:** As a developer, I want the extension to handle multi-root workspaces, so that I can manage dependencies across multiple projects simultaneously.

#### Acceptance Criteria

1. WHEN opening a multi-root workspace THEN the Extension SHALL detect package files in all workspace folders
2. WHEN analyzing a multi-root workspace THEN the Extension SHALL analyze each workspace folder independently
3. WHEN displaying status THEN the Extension SHALL aggregate dependency health across all workspace folders
4. WHEN updating dependencies THEN the Extension SHALL apply updates only to the relevant workspace folder
5. WHEN a workspace folder is added or removed THEN the Extension SHALL update analysis accordingly

### Requirement 15

**User Story:** As a developer, I want the extension to parse package files correctly, so that I can trust the accuracy of dependency information.

#### Acceptance Criteria

1. WHEN parsing package.json THEN the Extension SHALL extract dependencies and devDependencies sections
2. WHEN parsing requirements.txt THEN the Extension SHALL handle version specifiers (==, >=, ~=, etc.)
3. WHEN parsing pubspec.yaml THEN the Extension SHALL extract dependencies and dev_dependencies sections
4. WHEN parsing fails THEN the Extension SHALL display an error diagnostic at the parse error location
5. WHEN a package file contains syntax errors THEN the Extension SHALL provide helpful error messages with line numbers

### Requirement 16

**User Story:** As a developer, I want the extension to handle API errors gracefully, so that temporary network issues don't disrupt my workflow.

#### Acceptance Criteria

1. WHEN an API request times out THEN the Extension SHALL retry up to 3 times with exponential backoff
2. WHEN an API request fails after retries THEN the Extension SHALL display a user-friendly error message
3. WHEN rate limits are exceeded THEN the Extension SHALL display a message suggesting GitHub token configuration
4. WHEN the API endpoint is unreachable THEN the Extension SHALL suggest checking network connectivity and API endpoint configuration
5. WHEN API errors occur THEN the Extension SHALL log detailed error information for troubleshooting

### Requirement 17

**User Story:** As a developer, I want the extension to perform efficiently, so that it doesn't slow down my editor or consume excessive resources.

#### Acceptance Criteria

1. WHEN activating the extension THEN the Extension SHALL complete activation in under 500 milliseconds
2. WHEN parsing package files THEN the Extension SHALL use incremental parsing to minimize CPU usage
3. WHEN displaying CodeLens indicators THEN the Extension SHALL debounce updates by at least 300 milliseconds
4. WHEN analyzing large workspaces THEN the Extension SHALL process files asynchronously without blocking the UI
5. WHEN the extension is inactive THEN the Extension SHALL consume minimal memory and CPU resources

### Requirement 18

**User Story:** As a developer, I want keyboard shortcuts for common actions, so that I can work efficiently without reaching for the mouse.

#### Acceptance Criteria

1. WHEN pressing the configured keybinding THEN the Extension SHALL trigger the "Analyze Dependencies" command
2. WHEN pressing the configured keybinding THEN the Extension SHALL trigger the "Update All Dependencies" command
3. WHEN keybindings conflict with other extensions THEN the Extension SHALL allow users to customize keybindings
4. WHEN no keybindings are configured THEN the Extension SHALL provide suggested default keybindings
5. WHEN keybindings are used THEN the Extension SHALL provide the same functionality as command palette actions

### Requirement 19

**User Story:** As a developer, I want to see update commands generated for my package manager, so that I can manually run updates in the terminal if I prefer.

#### Acceptance Criteria

1. WHEN viewing update information THEN the Extension SHALL generate npm update commands for package.json files
2. WHEN viewing update information THEN the Extension SHALL generate pip install commands for requirements.txt files
3. WHEN viewing update information THEN the Extension SHALL generate pub upgrade commands for pubspec.yaml files
4. WHEN displaying update commands THEN the Extension SHALL provide a "Copy to Clipboard" action
5. WHEN displaying update commands THEN the Extension SHALL provide a "Run in Terminal" action

### Requirement 20

**User Story:** As a developer, I want the extension to integrate with VS Code's built-in terminal, so that I can execute update commands directly from the extension.

#### Acceptance Criteria

1. WHEN executing "Run in Terminal" action THEN the Extension SHALL open a new terminal or reuse an existing Pack-Man terminal
2. WHEN running commands in the terminal THEN the Extension SHALL execute the command in the correct workspace folder
3. WHEN running commands in the terminal THEN the Extension SHALL wait for command completion before re-analyzing
4. WHEN terminal commands fail THEN the Extension SHALL display the terminal output for debugging
5. WHEN terminal commands succeed THEN the Extension SHALL automatically re-analyze dependencies
