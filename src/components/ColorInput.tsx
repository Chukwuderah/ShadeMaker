import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import tinycolor from "tinycolor2";
import { Wand2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ColorInputProps {
  onColorGenerate: (baseColor: string) => void;
  isGenerating: boolean;
}

export const ColorInput = ({ onColorGenerate, isGenerating }: ColorInputProps) => {
  const [colorInput, setColorInput] = useState("#6366f1");
  const [error, setError] = useState("");

  const popularColors = [
    { name: "Ocean", color: "#0ea5e9" },
    { name: "Forest", color: "#059669" },
    { name: "Sunset", color: "#f97316" },
    { name: "Lavender", color: "#8b5cf6" },
    { name: "Rose", color: "#e11d48" },
    { name: "Sky", color: "#3b82f6" },
    { name: "Mint", color: "#34d399" },
    { name: "Gold", color: "#f59e0b" },
    { name: "Plum", color: "#a855f7" },
    { name: "Charcoal", color: "#374151" },
    { name: "Teal", color: "#14b8a6" },
  ];

  const validateAndGenerate = () => {
    if (!colorInput.trim()) {
      setError("Please enter a color");
      return;
    }

    const color = tinycolor(colorInput.trim());
    if (!color.isValid()) {
      setError("Invalid color format. Try 'purple', '#800080', or 'rgb(128,0,128)'");
      return;
    }

    setError("");
    onColorGenerate(color.toHexString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      validateAndGenerate();
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div className="space-y-3 relative">
          <Input
            type="text"
            placeholder="Enter HEX (#6366f1) or color name (blue)"
            value={colorInput}
            onChange={(e) => {
              setColorInput(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            className="h-14 pr-14 text-center text-lg font-medium bg-white/50 border-none focus:ring-2 focus:ring-primary rounded-2xl transition-smooth focus:shadow-glow focus:scale-[1.02] backdrop-blur-sm"
          />

          {/* Live color preview square */}
          <div
            className="absolute right-4 top-[30%] -translate-y-1/2 w-8 h-8 rounded-lg border-2 border-white/30 shadow-lg"
            style={{ backgroundColor: colorInput }}
          />

          {error && (
            <p className="text-sm text-destructive text-center animate-slide-up">
              {error}
            </p>
          )}
        </div>

        {/* Popular Colors */}
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium">
            Try these popular colors:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularColors.map(({ name, color }, i) => (
              <motion.button
                key={name + color}
                type="button"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{
                  delay: i * 0.05,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1], // easeOut
                }}
                onClick={() => setColorInput(color)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 hover:bg-white/40 border border-glass-border text-foreground/80 text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/30"
                  style={{ backgroundColor: color }}
                />
                {name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={validateAndGenerate}
          disabled={isGenerating || !colorInput.trim()}
          className="w-full h-14 text-lg font-semibold relative overflow-hidden bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {/* Background overlay BELOW text */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

          {/* Content stays visible */}
          <div className="flex items-center justify-center gap-3 relative z-10">
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Generate Shades
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};
