import { useEffect, useMemo, useState } from "react";
import { Download, CheckCircle } from "lucide-react";
import { ColorSwatch } from "./ColorSwatch";
import type { ColorInfo } from "@/utils/colorUtils";
import { FormatToggle } from "@/components/FormatToggle";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import tinycolor from "tinycolor2";

interface ColorPaletteProps {
  colors: ColorInfo[];
  baseColorHex: string;
}

/**
 * Local shade generator so we can control the exact shade count.
 * Produces a balanced dark→base→light ramp using lighten/darken.
 */
function makeShades(baseHex: string, count: number): ColorInfo[] {
  const n = Math.max(count, 10);
  const center = (n - 1) / 2;

  const result: ColorInfo[] = Array.from({ length: n }, (_, i) => {
    const c = tinycolor(baseHex);
    const delta = ((i - center) / center) * 40; // spread ±40
    const adjusted =
      delta >= 0
        ? c.lighten(Math.min(40, delta))
        : c.darken(Math.min(40, -delta));
    const hex = adjusted.toHexString();
    const rgb = adjusted.toRgb();
    const hslObj = adjusted.toHsl();
    const hsl = `hsl(${Math.round(hslObj.h)}, ${Math.round(
      hslObj.s * 100
    )}%, ${Math.round(hslObj.l * 100)}%)`;
    return { hex, rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, hsl };
  });

  return result;
}

export function ColorPalette({ colors, baseColorHex }: ColorPaletteProps) {
  const [outputFormat, setOutputFormat] = useState<"vanilla" | "tailwind">(
    "vanilla"
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [shadeCount, setShadeCount] = useState(10);
  const [triggerGlimmer, setTriggerGlimmer] = useState(false);

  // What we actually render: prioritize our own generated shades (exact count),
  // but if parent already provided >= desired, we’ll just slice theirs.
  const desired = Math.max(shadeCount, 10);

  const displayedColors = useMemo<ColorInfo[]>(() => {
    if (colors && colors.length >= desired) {
      return colors.slice(0, desired);
    }
    return makeShades(baseColorHex, desired);
  }, [colors, baseColorHex, desired]);

  // Fire the sheen/glimmer when the rendered set changes
  useEffect(() => {
    if (displayedColors.length) {
      setTriggerGlimmer(true);
      const t = setTimeout(() => setTriggerGlimmer(false), 1200);
      return () => clearTimeout(t);
    }
  }, [displayedColors]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const exportPalette = () => {
    const paletteData = displayedColors
      .map((color, index) =>
        outputFormat === "vanilla"
          ? `  --color-${index + 1}: ${color.hex};`
          : `  '${baseColorHex.slice(1)}-${(index + 1) * 100}': '${color.hex}',`
      )
      .join("\n");

    const exportText =
      outputFormat === "vanilla"
        ? `:root {\n${paletteData}\n}`
        : `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        custom: {\n${paletteData}\n        }\n      }\n    }\n  }\n}`;

    handleCopy(exportText);
  };

  if (!displayedColors.length) return null;

  return (
    <div className="glassmorphism-card p-8">
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slideInRight z-50">
          <CheckCircle className="w-5 h-5" />
          Copied to clipboard!
        </div>
      )}

      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-white">Your Color Palette</h2>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Format toggle */}
          <FormatToggle
            format={outputFormat}
            onFormatChange={setOutputFormat}
          />

          <div className="flex items-center gap-2">
            {/* Shade count selector */}
            <Select
              value={String(shadeCount)}
              onValueChange={(val) => setShadeCount(Math.max(Number(val), 10))}
            >
              <SelectTrigger className="w-36 py-2 bg-white/10 text-white border border-white/20 focus:ring-0">
                <SelectValue placeholder="Shades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Shades</SelectItem>
                <SelectItem value="12">12 Shades</SelectItem>
                <SelectItem value="15">15 Shades</SelectItem>
                <SelectItem value="20">20 Shades</SelectItem>
                <SelectItem value="30">30 Shades</SelectItem>
                <SelectItem value="50">50 Shades</SelectItem>
              </SelectContent>
            </Select>

            {/* Export button */}
            <button
              onClick={exportPalette}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Color grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedColors.map((color, index) => (
          <ColorSwatch
            key={`${color.hex}-${index}`}
            color={color}
            index={index}
            outputFormat={outputFormat}
            onCopy={handleCopy}
            triggerGlimmer={triggerGlimmer}
          />
        ))}
      </div>

      {/* Usage tips */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm">
          Click any swatch to copy its code • Toggle between CSS formats •
          Choose how many shades to generate • Export your palette
        </p>
      </div>
    </div>
  );
}
