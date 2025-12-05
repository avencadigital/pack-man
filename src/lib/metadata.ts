import type { Metadata } from "next";

export const siteConfig = {
    name: "Pack-Man",
    description: "An application to analyze and check packages from different registries.",
    url: "https://pack-man.tech",
    ogImage: "/og.png",
    keywords: [
        "Pack-Man",
        "NPM",
        "PyPI",
        "Pub",
        "Package Checker",
        "Dependency Checker",
        "Package Analysis",
        "Dependency Analysis",
        "Security Check",
        "Package Manager",
    ],
};

export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = "/favicon.ico",
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
} = {}): Metadata {
    return {
        title,
        description,
        keywords: siteConfig.keywords,
        authors: [{ name: "Pack-Man Team" }],
        creator: "Pack-Man Team",
        openGraph: {
            type: "website",
            locale: "en_US",
            url: siteConfig.url,
            title,
            description,
            siteName: siteConfig.name,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: `${title} - Package Analysis Tool`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@packman",
            site: "@packman",
        },
        icons,
        metadataBase: new URL(siteConfig.url),
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        verification: {
            google: "your-google-verification-code", // Substitua pelo código real do Google Search Console
        },
    };
}

// Função para gerar metadados específicos para páginas de análise de pacotes
export function generatePackageMetadata(packageName: string, registry: string): Metadata {
    const title = `${packageName} - Package Analysis | Pack-Man`;
    const description = `Analyze ${packageName} package from ${registry} registry. Check dependencies, security vulnerabilities, and package information with Pack-Man.`;

    return constructMetadata({
        title,
        description,
    });
}