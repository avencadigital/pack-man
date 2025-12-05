export interface Feature {
    id: number;
    title: string;
    description: string;
    status: "Planned" | "In Progress" | "Completed" | "Research";
    upvotes: number;
    priority: "Critical" | "High" | "Medium" | "Low";
    impact: "Major" | "Minor" | "Patch";
    category: string;
    estimatedRelease: string;
    difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
    tags: string[];
}

export const initialFeatures: Feature[] = [
    {
        id: 0,
        title: "Roadmap Voting System",
        description:
            "Implement a voting system for the roadmap features with user authentication and real-time updates.",
        status: "In Progress",
        upvotes: 0,
        priority: "High",
        impact: "Minor",
        category: "User Experience",
        estimatedRelease: "v1.2.0",
        difficulty: "Medium",
        tags: ["voting", "authentication", "real-time"],
    },
    {
        id: 1,
        title: "Dark Mode Support",
        description:
            "Implement a comprehensive dark mode theme for the entire application with system preference detection.",
        status: "Completed",
        upvotes: 0,
        priority: "Medium",
        impact: "Minor",
        category: "User Interface",
        estimatedRelease: "v1.1.0",
        difficulty: "Easy",
        tags: ["theme", "accessibility", "ui"],
    },
    {
        id: 2,
        title: "VS Code Extension",
        description:
            "Create a VS Code extension to analyze dependencies directly from the editor with inline warnings and suggestions.",
        status: "Planned",
        upvotes: 0,
        priority: "High",
        impact: "Major",
        category: "Developer Tools",
        estimatedRelease: "v2.0.0",
        difficulty: "Hard",
        tags: ["vscode", "extension", "ide-integration"],
    },
    {
        id: 3,
        title: "Support for Go Modules",
        description:
            "Add comprehensive support for analyzing `go.mod` and `go.sum` files for Go projects with vulnerability scanning.",
        status: "Planned",
        upvotes: 0,
        priority: "Medium",
        impact: "Minor",
        category: "Language Support",
        estimatedRelease: "v1.3.0",
        difficulty: "Medium",
        tags: ["golang", "modules", "security"],
    },
    {
        id: 4,
        title: "GitHub Integration",
        description:
            "Integrate with GitHub API to automatically analyze repositories, create PRs for updates, and track dependency health over time.",
        status: "Planned",
        upvotes: 0,
        priority: "High",
        impact: "Major",
        category: "Integration",
        estimatedRelease: "v2.1.0",
        difficulty: "Hard",
        tags: ["github", "automation", "ci-cd"],
    },
    {
        id: 5,
        title: "Rust Cargo Support",
        description:
            "Add support for analyzing Cargo.toml and Cargo.lock files for Rust projects with crate vulnerability detection.",
        status: "Planned",
        upvotes: 0,
        priority: "Medium",
        impact: "Minor",
        category: "Language Support",
        estimatedRelease: "v1.4.0",
        difficulty: "Medium",
        tags: ["rust", "cargo", "security"],
    },
    {
        id: 6,
        title: "Dependency Graph Visualization",
        description:
            "Interactive dependency graph visualization showing relationships, conflicts, and update paths between packages.",
        status: "Planned",
        upvotes: 0,
        priority: "High",
        impact: "Major",
        category: "Visualization",
        estimatedRelease: "v1.5.0",
        difficulty: "Hard",
        tags: ["visualization", "graph", "dependencies"],
    },
    {
        id: 7,
        title: "Security Vulnerability Scanner",
        description:
            "Integrate with security databases to identify known vulnerabilities in dependencies with severity ratings and fix suggestions.",
        status: "Planned",
        upvotes: 0,
        priority: "Critical",
        impact: "Major",
        category: "Security",
        estimatedRelease: "v1.6.0",
        difficulty: "Hard",
        tags: ["security", "vulnerabilities", "scanning"],
    },
    {
        id: 8,
        title: "Docker Support",
        description:
            "Analyze Dockerfile and docker-compose.yml files for base image updates and security recommendations.",
        status: "Planned",
        upvotes: 0,
        priority: "Medium",
        impact: "Minor",
        category: "DevOps",
        estimatedRelease: "v1.7.0",
        difficulty: "Medium",
        tags: ["docker", "containers", "devops"],
    },
    {
        id: 9,
        title: "API Rate Limiting & Caching",
        description:
            "Implement intelligent rate limiting and caching mechanisms to improve performance and reduce API calls to package registries.",
        status: "Planned",
        upvotes: 0,
        priority: "Medium",
        impact: "Patch",
        category: "Performance",
        estimatedRelease: "v1.2.1",
        difficulty: "Medium",
        tags: ["performance", "caching", "optimization"],
    },
    {
        id: 10,
        title: "Monorepo Support",
        description:
            "Enhanced support for monorepos with workspace detection, cross-package dependency analysis, and bulk update suggestions.",
        status: "Planned",
        upvotes: 0,
        priority: "Medium",
        impact: "Major",
        category: "Architecture",
        estimatedRelease: "v2.2.0",
        difficulty: "Hard",
        tags: ["monorepo", "workspace", "architecture"],
    },
    {
        id: 11,
        title: "CLI Tool",
        description:
            "Command-line interface for Pack-Man with CI/CD integration, automated reporting, and configuration file support.",
        status: "Planned",
        upvotes: 0,
        priority: "High",
        impact: "Major",
        category: "Developer Tools",
        estimatedRelease: "v2.0.0",
        difficulty: "Medium",
        tags: ["cli", "automation", "ci-cd"],
    },
    {
        id: 12,
        title: "Package Update Automation",
        description:
            "Automated package updates with testing integration, rollback capabilities, and smart conflict resolution.",
        status: "Research",
        upvotes: 0,
        priority: "High",
        impact: "Major",
        category: "Automation",
        estimatedRelease: "v3.0.0",
        difficulty: "Very Hard",
        tags: ["automation", "updates", "testing"],
    },
];