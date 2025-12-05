"use client";

import Link from "next/link";
import { Github, SearchCode, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeImage } from "@/components/ui/theme-image";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8">
                        <ThemeImage
                            srcLight="/logos/packman.svg"
                            srcDark="/logos/packman_dark.svg"
                            alt="Pack-Man Logo"
                            fill
                            className="object-contain transition-transform group-hover:scale-110"
                        />
                    </div>
                    <span
                        className="text-lg font-bold hidden sm:inline"
                        style={{ fontFamily: "PAC-FONT, sans-serif" }}
                    >
                        Pack-Man
                    </span>
                </Link>

                {/* Navigation + Actions */}
                <div className="flex items-center gap-1">
                    <nav className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/web" className="flex items-center gap-2">
                                <SearchCode className="w-4 h-4" />
                                <span className="hidden sm:inline">Analyze</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/features" className="flex items-center gap-2">
                                <Map className="w-4 h-4" />
                                <span className="hidden sm:inline">Features</span>
                            </Link>
                        </Button>
                    </nav>

                    <div className="flex items-center gap-1 ml-1">
                        <Button variant="ghost" size="icon" asChild>
                            <a
                                href="https://github.com/avencadigital/pack-man"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub Repository"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
