import Link from 'next/link';
import Image from 'next/image';
import { Zap, Code, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-background relative">
      {/* Diagonal Fade Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-50 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
        }}
      />

      {/* Content */}
      <section className="relative z-10 py-10 sm:py-12 lg:py-16">
        <div className="container text-center">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                <Image
                  src="/logos/packman.svg"
                  alt="Pack-Man Logo"
                  fill
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logos/packman_dark.svg"
                  alt="Pack-Man Logo"
                  fill
                  className="object-contain hidden dark:block"
                />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-2">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-2">
                Pack-Man
              </h1>
              <h2 className="text-md sm:text-xl lg:text-2xl font-semibold text-muted-foreground">
                Documentation & API Reference
              </h2>
            </div>

            {/* Features */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Comprehensive Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">API Reference</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Quick Start</span>
              </div>
            </div>
          </div>

          {/* Main Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-8 py-3 text-lg rounded-full border bg-background hover:bg-accent font-medium transition-all hover:scale-105"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Get Started
            </Link>
            <Link
              href="/docs/api"
              className="inline-flex items-center justify-center px-8 py-3 text-lg rounded-full border bg-background hover:bg-accent font-medium transition-all hover:scale-105"
            >
              <Code className="w-5 h-5 mr-2" />
              API Reference
            </Link>
          </div>

          {/* Package Managers Support */}
          <div className="mx-auto mt-6 flex w-fit flex-col items-center gap-6">
            <div className="text-sm text-muted-foreground font-medium">
              Full support for:
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                  <Image
                    src="/logos/npm.svg"
                    alt="npm logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  npm
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 group">
                <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                  <Image
                    src="/logos/pypi.svg"
                    alt="PyPI logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  PyPI
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 group">
                <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                  <Image
                    src="/logos/pub.svg"
                    alt="Pub.dev logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Pub.dev
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
