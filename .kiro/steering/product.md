# Pack-Man - Dependency Analyzer

Pack-Man is a modern web application for package dependency analysis that helps developers quickly check if their dependencies are up-to-date across different development ecosystems.

## Core Features

- **Multi-format Support**: Analyzes package.json (npm), requirements.txt (pip), and pubspec.yaml (Flutter/Dart)
- **File Upload & Manual Input**: Upload dependency files or paste content directly
- **GitHub Integration**: Analyze dependencies directly from GitHub repositories via URL
- **Real-time Analysis**: Checks dependencies against official package registries (npm, PyPI, pub.dev)
- **Visual Statistics**: Displays comprehensive stats on outdated, up-to-date, and problematic packages
- **Update Command Generation**: Automatically generates update commands for each package manager
- **Documentation Links**: Direct access to official package documentation
- **Dark/Light Mode**: Full theme support with system preference detection
- **Analytics & Monitoring**: Integrated Vercel Analytics and Speed Insights

## Target Users

- Frontend/Backend developers managing JavaScript/Node.js projects
- Python developers working with pip dependencies  
- Flutter/Dart developers managing pub dependencies
- DevOps engineers maintaining multiple project dependencies
- Teams looking to automate dependency health monitoring

## Key Value Propositions

- **Speed**: Quick dependency analysis without manual registry checking
- **Accuracy**: Real-time data from official package registries
- **Multi-ecosystem**: Single tool for multiple package managers
- **User Experience**: Clean, intuitive interface with comprehensive feedback
- **Browser Integration**: Chrome extension for in-context GitHub repository analysis
- **IDE Integration**: VS Code extension for analyzing dependencies without leaving the editor

## Browser & IDE Extensions

### Chrome Extension
The Pack-Man Chrome Extension provides seamless dependency analysis directly on GitHub repository pages.

**Key Features:**
- Automatic repository detection on GitHub pages
- Visual badges showing package status with color-coding
- Private repository support with GitHub token authentication
- Configurable API endpoint for self-hosted instances
- Advanced caching strategy (5min success, 2min error TTL)
- Rate limit optimization (60/hour without token, 5000/hour with token)
- Support for npm, pip, and pub package managers

**Use Cases:**
- Quick dependency health checks while browsing repositories
- Code review workflows - assess dependency status before merging
- Repository evaluation - check maintenance status before adoption
- Team collaboration - share dependency insights via GitHub

### VS Code Extension (Planned)
The Pack-Man VS Code Extension will bring dependency analysis directly into the development environment.

**Planned Features:**
- Inline dependency status indicators in package files
- CodeLens integration showing update availability
- Quick actions to update individual or all dependencies
- Workspace-wide dependency scanning
- Integration with VS Code's built-in terminal for updates
- Status bar indicators for project dependency health
- Automatic analysis on file save
- Support for monorepo structures

**Use Cases:**
- Real-time dependency monitoring during development
- Proactive security vulnerability detection
- Streamlined dependency update workflow
- Project health dashboard in the IDE
- CI/CD integration preparation