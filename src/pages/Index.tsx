import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ColorInput } from "@/components/ColorInput";
import { ColorPalette } from "@/components/ColorPalette";
import {
  generateShades,
  isValidHex,
  nameToHex,
  type ColorInfo,
} from "@/utils/colorUtils";

const Index = () => {
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [backgroundGradient, setBackgroundGradient] = useState(
    "from-indigo-900 via-purple-900 to-pink-900"
  );

  const generatePalette = async (inputColor: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    let finalColor = inputColor;

    if (!isValidHex(inputColor)) {
      const hexFromName = nameToHex(inputColor);
      if (hexFromName) {
        finalColor = hexFromName;
      } else {
        setLoading(false);
        return;
      }
    }

    if (!finalColor.startsWith("#")) {
      finalColor = "#" + finalColor;
    }

    if (isValidHex(finalColor)) {
      const newColors = generateShades(finalColor);
      setColors(newColors);
      setBaseColor(finalColor);
      updateBackgroundGradient(finalColor);
    }

    setLoading(false);
  };

  const updateBackgroundGradient = (color: string) => {
    // Generate a range of shades (light → dark)
    const shades = generateShades(color);

    // Pick three stops: lighter, base, darker
    const start = shades[3]?.hex || color; // lighter
    const middle = shades[5]?.hex || color; // mid/base
    const end = shades[9]?.hex || color; // darker

    // Build a custom Tailwind inline style gradient
    setBackgroundGradient(
      `linear-gradient(to bottom right, ${start}, ${middle}, ${end})`
    );
  };

  useEffect(() => {
    generatePalette(baseColor);
  }, []);

  return (
    <div
      className="min-h-screen transition-all duration-1000 relative overflow-hidden"
      style={{ background: backgroundGradient }}
    >
      {/* Ambient floaty background element */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>

      {/* Header */}
      <header className="z-10 border-b border-glass-border bg-glass-bg backdrop-blur-glass sticky top-0">
        <div className="container mx-auto px-4 py-8">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 space-y-12">
        <section className="text-center space-y-8">
          <ColorInput
            onColorGenerate={generatePalette}
            isGenerating={loading}
          />
        </section>

        <section className="max-w-7xl mx-auto">
          <ColorPalette colors={colors} baseColorHex={baseColor} />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border bg-glass-bg backdrop-blur-glass mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Built with <span className="text-accent-purple">React</span>,{" "}
            <span className="text-accent-pink">Tailwind CSS</span>, and{" "}
            <span className="text-primary">TinyColor</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
