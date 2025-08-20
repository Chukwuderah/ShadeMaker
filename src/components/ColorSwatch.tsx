import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import tinycolor from "tinycolor2";
import type { ColorInfo } from "@/utils/colorUtils";

interface ColorSwatchProps {
  color: ColorInfo; // { hex: string; rgb: string }
  index: number;
  outputFormat: "vanilla" | "tailwind";
  onCopy: (text: string) => void;
  triggerGlimmer: boolean; // 👈 parent tells swatch when to animate
}

export const ColorSwatch = ({
  color,
  index,
  outputFormat,
  onCopy,
  triggerGlimmer,
}: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (triggerGlimmer) {
      // kick off glimmer animation whenever parent regenerates
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [triggerGlimmer]);

  const generateCode = () => {
    return outputFormat === "vanilla"
      ? `background-color: ${color.hex};`
      : `bg-[${color.hex}]`;
  };

  const copyToClipboard = async () => {
    try {
      const text = generateCode();
      await navigator.clipboard.writeText(text);
      onCopy(text); // 🔑 notify parent (ColorPalette) for toast/export
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const isLight = tinycolor(color.hex).isLight();
  const textColor = isLight ? "#000000" : "#ffffff";

  return (
    <div
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-lg 
      transition-all duration-500 hover:scale-[1.07] hover:shadow-2xl cursor-pointer animate-slide-in"
      style={{
        backgroundColor: color.hex,
        animationDelay: `${index * 80}ms`,
      }}
      onClick={copyToClipboard} // 🖱 swatch itself is clickable
    >
      {/* ✨ Glimmer sweep */}
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${
          animate ? "animate-glimmer" : ""
        }`}
      >
        <div className="absolute -inset-y-1 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-12" />
      </div>

      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-20 transform rotate-12 pointer-events-none transition-all" />

      {/* Info overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all bg-black/30 backdrop-blur-sm">
        <div
          className="text-sm font-mono font-bold mb-3 text-center"
          style={{ color: textColor }}
        >
          {color.hex.toUpperCase()}
        </div>
        <div className="text-xs mb-3" style={{ color: textColor }}>
          {color.rgb}
        </div>

        <Button
          onClick={copyToClipboard}
          size="sm"
          variant="secondary"
          className="bg-white/95 hover:bg-white text-black rounded-xl shadow-md transition-transform hover:scale-105"
        >
          {copied ? (
            <span className="flex items-center">
              <Check className="w-3 h-3 mr-1 text-green-600" />
              Copied!
            </span>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy {outputFormat === "vanilla" ? "CSS" : "Tailwind"}
            </>
          )}
        </Button>
      </div>

      {/* Floating index */}
      <div
        className="absolute top-3 left-3 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold backdrop-blur-sm opacity-80"
        style={{
          backgroundColor: isLight
            ? "rgba(0,0,0,0.15)"
            : "rgba(255,255,255,0.15)",
          color: textColor,
        }}
      >
        {index + 1}
      </div>

      {/* Hover tooltip */}
      {!copied && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Click to copy
        </div>
      )}
    </div>
  );
};
