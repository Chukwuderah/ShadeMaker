import { Palette } from "lucide-react";

export function Header() {
  return (
    <div className="text-center">
      {/* Icon + glow */}
      <div className="mx-auto mb-4 flex items-center justify-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow animate-glow-pulse">
            <Palette className="w-7 h-7 text-white drop-shadow-sm" />
          </div>
          {/* soft outer glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl opacity-40 bg-gradient-hero" />
        </div>
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-heading font-extrabold bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tight leading-tight animate-gradient-x">
          Shade Maker
        </h1>
      </div>

      {/* Subtitle */}
      <p className="mt-3 text-base sm:text-lg text-muted-foreground">
        Transform any color into a palette of beautiful, harmonious shades.
      </p>
    </div>
  );
}
