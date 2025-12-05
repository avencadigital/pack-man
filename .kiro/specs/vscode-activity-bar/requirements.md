# Requirements Document

## Introduction

This feature adds a dedicated Activity Bar icon and sidebar panel to the Pack-Man VS Code extension. The Activity Bar provides quick access to extension settings, dependency analysis results, and configuration options without requiring users to navigate through VS Code's settings or command palette. The panel will serve as a central hub for managing Pack-Man functionality, displaying workspace-wide dependency health, and configuring extension behavior.

## Glossary

- **Activity Bar**: The vertical bar on the far left side of VS Code that contains icons for switching between views (Explorer, Search, Source Control, etc.)
- **Sidebar Panel**: The collapsible panel that appears when an Activity Bar icon is clicked, containing tree views and custom UI elements
- **Tree View**: A hierarchical list component in VS Code sidebars that displays expandable/collapsible items
- **Webview View**: A custom HTML-based view that can be embedded in the sidebar panel
- **Pack-Man**: The dependency analyzer extension that checks package versions across npm, pip, and pub ecosystems
- **GitHub Token**: Personal access token used for authenticating with GitHub API to access private repositories
- **API Endpoint**: The URL of the Pack-Man backend service that performs dependency analysis

## Requirements

### Requirement 1

**User Story:** As a developer, I want to see a Pack-Man icon in the Activity Bar, so that I can quickly access dependency analysis features without searching through menus.

#### Acceptance Criteria

1. WHEN the Pack-Man extension is activated THEN the Extension SHALL display a distinctive icon in the VS Code Activity Bar
2. WHEN a user clicks the Activity Bar icon THEN the Extension SHALL reveal the Pack-Man sidebar panel
3. WHEN the sidebar panel is visible THEN the Extension SHALL display the panel title as "Pack-Man"

### Requirement 2

**User Story:** As a developer, I want to see an overview of my workspace dependency health in the sidebar, so that I can quickly assess the status of all my projects.

#### Acceptance Criteria

1. WHEN the sidebar panel is opened THEN the Extension SHALL display aggregated dependency statistics for the workspace
2. WHEN dependencies are analyzed THEN the Extension SHALL show counts for total, up-to-date, outdated, and error packages
3. WHEN the workspace contains multiple package files THEN the Extension SHALL aggregate statistics across all files
4. WHEN analysis results change THEN the Extension SHALL update the statistics display in real-time

### Requirement 3

**User Story:** As a developer, I want to see a list of analyzed package files in the sidebar, so that I can navigate to specific files and view their dependency status.

#### Acceptance Criteria

1. WHEN package files exist in the workspace THEN the Extension SHALL display them in a tree view
2. WHEN a package file is displayed THEN the Extension SHALL show its name, path, and status indicator (healthy, outdated, error)
3. WHEN a user clicks on a package file item THEN the Extension SHALL open that file in the editor
4. WHEN a user expands a package file item THEN the Extension SHALL show individual package dependencies with their status
5. WHEN a package file is added or removed from the workspace THEN the Extension SHALL update the tree view accordingly

### Requirement 4

**User Story:** As a developer, I want to configure extension settings from the sidebar, so that I can adjust Pack-Man behavior without navigating to VS Code settings.

#### Acceptance Criteria

1. WHEN the sidebar panel is opened THEN the Extension SHALL display a Settings section
2. WHEN the Settings section is displayed THEN the Extension SHALL show the current API endpoint configuration
3. WHEN a user modifies the API endpoint THEN the Extension SHALL validate the URL format before saving
4. WHEN an invalid API endpoint is entered THEN the Extension SHALL display an error message and prevent saving
5. WHEN the Settings section is displayed THEN the Extension SHALL show toggle controls for auto-analyze options

### Requirement 5

**User Story:** As a developer, I want to manage my GitHub token from the sidebar, so that I can configure private repository access in one place.

#### Acceptance Criteria

1. WHEN the sidebar panel is opened THEN the Extension SHALL display a GitHub Token section
2. WHEN no GitHub token is configured THEN the Extension SHALL show a prompt to add a token
3. WHEN a GitHub token is configured THEN the Extension SHALL show a masked indicator that a token exists
4. WHEN a user clicks the add/update token button THEN the Extension SHALL open an input dialog for the token
5. WHEN a user clicks the remove token button THEN the Extension SHALL delete the stored token after confirmation

### Requirement 6

**User Story:** As a developer, I want quick action buttons in the sidebar, so that I can trigger common operations without using the command palette.

#### Acceptance Criteria

1. WHEN the sidebar panel is opened THEN the Extension SHALL display action buttons for common operations
2. WHEN a user clicks the "Analyze Workspace" button THEN the Extension SHALL trigger analysis of all package files
3. WHEN a user clicks the "Refresh" button THEN the Extension SHALL re-analyze all previously analyzed files
4. WHEN analysis is in progress THEN the Extension SHALL show a loading indicator on the relevant button
5. WHEN a user clicks the "Open Settings" button THEN the Extension SHALL open VS Code settings filtered to Pack-Man configuration

### Requirement 7

**User Story:** As a developer, I want the sidebar to show helpful information and links, so that I can access documentation and support resources.

#### Acceptance Criteria

1. WHEN the sidebar panel is opened THEN the Extension SHALL display a Help section
2. WHEN the Help section is displayed THEN the Extension SHALL show links to documentation, changelog, and issue reporting
3. WHEN a user clicks a help link THEN the Extension SHALL open the corresponding URL in the default browser
4. WHEN the Help section is displayed THEN the Extension SHALL show the current extension version

