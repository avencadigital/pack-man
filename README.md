# 🚀 Pack-Man - Dependency Analyzer

A modern web application for package dependency analysis, allowing you to quickly check if your dependencies are up-to-date across different development ecosystems.

> **📦 This is the main monorepo** containing all Pack-Man components: Web Application, Chrome Extension, and VS Code Extension.

## 📂 Related Repositories

| Repository | Description |
|------------|-------------|
| [pack-man-chrome](https://github.com/avencadigital/pack-man-chrome) | Chrome Extension - Standalone repository |
| [pack-man-vscode](https://github.com/avencadigital/pack-man-vscode) | VS Code Extension - Standalone repository |
| [pack-man-docs](https://github.com/avencadigital/pack-man-docs) | Documentation - User guides and API docs |

## ✨ About Pack-Man

Pack-Man is a dependency analysis tool that allows developers to:

- **� Check toutdated packages** in dependency files
- **� Anaulyze multiple formats** including package.json (npm), requirements.txt (pip), and pubspec.yaml (Flutter/Dart)
- **📊 Visualize statistics** about the state of project dependencies
- **🔄 Get updated information** directly from official package registries

## � Key Features

- **📤 File Upload** - Upload dependency files or paste content manually
- **🔄 Automatic Detection** - Automatically identifies file type (npm, pip, pub)
- **�  Detailed Analysis** - Checks each dependency against the latest available version
- **📈 Statistical Summary** - View how many packages are up-to-date, outdated, or have errors
- **🔗 Documentation Links** - Easily access the official page of each package
- **🌓 Dark/Light Mode** - Interface adaptable to your preferences
- **🧩 Chrome Extension** - Analyze dependencies directly on GitHub pages
- **💻 VS Code Extension** - Inline dependency analysis in your editor

## 📁 Monorepo Structure

```
pack-man/
├── src/                    # Web Application (Next.js)
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and services
│   └── types/             # TypeScript definitions
├── chrome-extension/       # Chrome Extension (Manifest V3)
├── vscode-extension/       # VS Code Extension (Planned)
├── docs/                   # Documentation
└── .kiro/                  # Kiro AI configuration and steering
```

## 🛠️ Technologies Used

### 🎯 Core Framework

- **⚡ Next.js 16** - React framework with App Router
- **📘 TypeScript 5** - Statically typed JavaScript
- **🎨 Tailwind CSS 4** - Utility-first CSS framework
- **⚛️ React 19** - Latest React with concurrent features

## 🚀 How to Use

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test:run

# Lint code
npm run lint
```

Access [http://localhost:3000](http://localhost:3000) to see the application running.

## 🔌 Supported APIs

Pack-Man integrates with the following package registries:

- **�  npm Registry** - For JavaScript/Node.js packages
- **🐍 PyPI** - For Python packages
- **💙 pub.dev** - For Flutter/Dart packages

## 🧩 Extensions

### Chrome Extension

Located in `chrome-extension/` - Provides dependency analysis directly on GitHub repository pages.

**Features:**
- Automatic repository detection on GitHub
- Visual badges showing package status
- Private repository support with GitHub token
- Configurable API endpoint

� [Chroome Extension Guide](chrome-extension/README.md) | 🔗 [Standalone Repo](https://github.com/avencadigital/pack-man-chrome)

### VS Code Extension (Planned)

Located in `vscode-extension/` - Brings dependency analysis directly into your development environment.

**Planned Features:**
- Inline dependency status indicators
- CodeLens integration
- Quick actions for updates
- Status bar indicators

� [VS Code Extension Guide](vscode-extension/README.md) | 🔗 [Standalone Repo](https://github.com/avencadigital/pack-man-vscode)

## 🎨 Credits

- **LOGO**: [SVG Repo - Pacman](https://www.svgrepo.com/svg/390729/online-arcade-pc-game-pacman) | AUTHOR: wishforge.games
- **FONT**: [Chainsaw Geometric Font](https://www.1001fonts.com/chainsaw-geometric-font.html) | AUTHOR: Nick Curtis

## 🗺️ Roadmap

Pack-Man is actively evolving! Here's what we're working on and planning for the future.

### ✅ Recently Completed

- **🌓 Dark Mode Support** - Comprehensive theming with system preference detection
- **🧩 Chrome Extension** - GitHub integration for dependency analysis

### 📋 Planned Features

- **🆚 VS Code Extension** - Analyze dependencies directly in your editor
- **📊 Dependency Graph Visualization** - Interactive visual representation
- **🛡️ Security Vulnerability Scanner** - Integration with security databases
- **� CoLI Tool** - Command-line interface with CI/CD integration
- **🐹 Go Modules Support** - `go.mod` and `go.sum` analysis
- **🦀 Rust Cargo Support** - `Cargo.toml` analysis
- **🐳 Docker Support** - Dockerfile analysis for base image updates
- **🏗️ Monorepo Support** - Workspace detection and cross-package analysis

## 🤝 Contributing

Contributions are welcome! Whether you're fixing bugs, adding features, improving documentation, or helping with design - every contribution matters.

### 🎯 Priority Areas

- **VS Code Extension** - Highly requested by the community
- **GitHub Integration** - Major workflow improvement
- **Security Vulnerability Scanner** - High impact for user safety

### 🚀 Getting Started

1. Fork the repository and clone it locally
2. Check our issues for "good first issue" labels
3. Submit a PR with your improvements

---

Developed with ❤️ for the developer community.

📖 [Documentation](https://github.com/avencadigital/pack-man-docs) | 🐛 [Report Bug](https://github.com/gzpaitch/pack-man/issues) | 💡 [Request Feature](https://github.com/gzpaitch/pack-man/issues/new?label=enhancement)
