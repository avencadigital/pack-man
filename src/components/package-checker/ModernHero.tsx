"use client";

import { Star, CheckCircle, Zap, Shield, Code } from "lucide-react";
import React from "react";
import Image from "next/image";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeImage } from "@/components/ui/theme-image";

interface ModernHeroProps {
  heading?: string;
  subtitle?: string;
  description?: string;
  button?: {
    text: string;
    onClick: () => void;
  };
  features?: {
    icon: React.ReactNode;
    text: string;
  }[];
  packageManagers?: {
    name: string;
    logo: string;
    alt: string;
  }[];
}

const ModernHero = ({
  heading = "Pack-Man",
  subtitle = "All-in-One Open-Source Dependency Analyzer",
  description = "Analyze and keep your dependencies up to date with ease. Complete support for npm, PyPI and Pub.dev in a modern and intuitive interface.",
  button = {
    text: "Start Analysis",
    onClick: () => {
      const analyzeSection = document.querySelector("[data-analyze-section]");
      analyzeSection?.scrollIntoView({ behavior: "smooth" });
    },
  },
  features = [
    {
      icon: <Zap className="w-4 h-4" />,
      text: "Fast Analysis",
    },
    {
      icon: <Shield className="w-4 h-4" />,
      text: "Safe & Reliable",
    },
    {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "Always Updated",
    },
    {
      icon: <Code className="w-4 h-4" />,
      text: "Open Source",
    },
  ],
  packageManagers = [
    {
      name: "npm",
      logo: "/logos/npm.svg",
      alt: "npm logo",
    },
    {
      name: "PyPI",
      logo: "/logos/pypi.svg",
      alt: "PyPI logo",
    },
    {
      name: "Pub.dev",
      logo: "/logos/pub.svg",
      alt: "Pub.dev logo",
    },
  ],
}: ModernHeroProps) => {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <div className="container text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
              <ThemeImage
                srcLight="/logos/packman.svg"
                srcDark="/logos/packman_dark.svg"
                alt="Pack-Man Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "PAC-FONT, sans-serif" }}
            >
              {heading}
            </h1>
            <h2 className="text-md sm:text-xl lg:text-2xl font-semibold text-muted-foreground">
              {subtitle}
            </h2>
          </div>

          {/* Description */}
          <p className="text-balance text-muted-foreground lg:text-lg max-w-3xl mx-auto">
            {description}
          </p>

          {/* Features */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground mt-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                {feature.icon}
                <span className="hidden sm:inline">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Button */}
        <Button
          size="lg"
          className="mt-10 text-lg px-8 py-6"
          onClick={button.onClick}
        >
          <div className="relative w-5 h-5 mr-2">
            <ThemeImage
              srcLight="/logos/pacman_white.svg"
              srcDark="/logos/pacmonster.svg"
              alt="Pack-Man Logo"
              fill
              className="object-contain"
            />
          </div>
          {button.text}
        </Button>

        {/* Package Managers Support */}
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-6">
          <div className="text-sm text-muted-foreground font-medium">
            Full support for:
          </div>

          <div className="flex items-center justify-center gap-8">
            {packageManagers.map((pm, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 transition-transform group-hover:scale-110">
                  <Image
                    src={pm.logo}
                    alt={pm.alt}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {pm.name}
                </span>
              </div>
            ))}
          </div>

          {/* Reviews/Stats Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <a
              href="https://github.com/gzpaitch/pack-man"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-medium">Star our Repo</span> • Open Source
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ModernHero };
