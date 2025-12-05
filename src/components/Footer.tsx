"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, Sparkles, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeImage } from "@/components/ui/theme-image";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const packageManagers = [
    {
      name: "npm",
      logo: "/logos/npm.svg",
      alt: "npm logo",
      url: "https://www.npmjs.com/",
    },
    {
      name: "PyPI",
      logo: "/logos/pypi.svg",
      alt: "PyPI logo",
      url: "https://pypi.org/",
    },
    {
      name: "Pub.dev",
      logo: "/logos/pub.svg",
      alt: "Pub.dev logo",
      url: "https://pub.dev/",
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/avencadigital/pack-man",
      description: "View source code",
    },
  ];

  // Feature requests URL provided by the project owner
  const requestFeatureUrl =
    "/features";

  return (
    <footer
      className={`mt-20 border-none relative z-10 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <ThemeImage
                  srcLight="/logos/packman.svg"
                  srcDark="/logos/packman_dark.svg"
                  alt="Pack-Man Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: "PAC-FONT, sans-serif" }}
              >
                Pack-Man
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-lg text-sm sm:text-base">
              Modern dependency manager that helps you analyze and keep your
              packages up to date across npm, PyPI, and Pub.dev ecosystems.
            </p>

            {/* Social Links and Request Feature - Side by Side */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-all duration-200 group w-fit cursor-pointer relative z-20 hover:bg-accent/30 rounded-lg px-2 sm:px-3 py-2"
                  >
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gradient-to-br from-gray-600 to-gray-700 text-white transition-transform group-hover:scale-110">
                      {social.icon}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium">
                        {social.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {social.description}
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </Link>
                ))}

                <Link
                  href={requestFeatureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all duration-200 group w-fit cursor-pointer relative z-20 hover:bg-accent/30 rounded-lg px-2 sm:px-3 py-2"
                >
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gradient-to-br from-gray-500 to-gray-600 text-white transition-transform group-hover:scale-110">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="font-medium">Request Feature</div>
                    <div className="text-xs text-muted-foreground">
                      Suggest improvements
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>
              </div>
            </div>
          </div>

          {/* Extensions */}
          <div className="flex flex-col justify-start">
            <div>
              {/* Package Managers Support */}
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Supported Package Managers:
                </p>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {packageManagers.map((pm, index) => (
                    <Link
                      key={index}
                      href={pm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer relative z-20 hover:bg-accent/30 rounded-md px-2 py-1"
                    >
                      <div className="relative w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110">
                        <Image
                          src={pm.logo}
                          alt={pm.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">{pm.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full max-w-[200px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
                  <Image
                    src="/VSCODE.svg"
                    alt="VS Code Extension"
                    className="object-contain w-full h-auto"
                    width={180}
                    height={18}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div className="relative w-full max-w-[200px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
                  <Image
                    src="/CHROME.svg"
                    alt="Chrome Extension"
                    className="object-contain w-full h-auto"
                    width={180}
                    height={18}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6 sm:mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>© {currentYear} Pack-Man. Made with</span>
            <div className="relative w-3 h-3 sm:w-4 sm:h-4">
              <ThemeImage
                srcLight="/logos/pacmonster.svg"
                srcDark="/logos/pacman_white.svg"
                alt="Pack-Man Logo"
                fill
                className="object-contain"
              />
            </div>
            <span>for developers</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground cursor-pointer relative z-20 text-xs sm:text-sm"
              onClick={(e) => {
                console.log("Button clicked!", e);
                const analyzeSection = document.querySelector(
                  "[data-analyze-section]"
                );
                if (analyzeSection) {
                  analyzeSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  console.log("Analyze section not found");
                }
              }}
            >
              Start Analysis
            </Button>
            <div className="text-xs text-muted-foreground">v1.0.0</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
