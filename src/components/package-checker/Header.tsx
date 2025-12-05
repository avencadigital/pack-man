"use client";

import { Smartphone, Monitor, Package } from "lucide-react";

export function Header() {
  return (
    <div className="text-center space-y-3 sm:space-y-4">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
          <Package className="w-full h-full text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Pack-Man
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
          Package Version Checker
        </h2>
      </div>
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
        Verifique as versões mais recentes dos seus pacotes e mantenha seu
        projeto atualizado
      </p>
      <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Smartphone className="w-4 h-4" />
          <span>Mobile Friendly</span>
        </div>
        <div className="flex items-center gap-1">
          <Monitor className="w-4 h-4" />
          <span>Desktop Optimized</span>
        </div>
      </div>
    </div>
  );
}
