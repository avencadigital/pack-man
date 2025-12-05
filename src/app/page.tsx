"use client";

import { ModernHero } from "@/components/package-checker/ModernHero";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      <Header />

      {/* Diagonal Fade Grid Background - Top Left */}
      <div
        className="absolute inset-0 z-0 opacity-50 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 pt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <ModernHero />
        </div>
      </div>

      <Footer />
    </div>
  );
}
