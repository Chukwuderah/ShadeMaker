import { ColorSwatch } from "@/components/ColorSwatch";

interface ShadeGridProps {
  shades: string[];
  format: "css" | "tailwind";
}

export const ShadeGrid = ({ shades, format }: ShadeGridProps) => {
  if (shades.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-glass flex items-center justify-center shadow-glass animate-float">
          <div className="w-10 h-10 rounded-2xl bg-gradient-subtle"></div>
        </div>
        <p className="text-muted-foreground text-lg font-medium">
          Enter a color above to generate beautiful shades
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="glass-card p-6 rounded-3xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-20 gap-4">
          {shades.map((shade, index) => (
            <div
              key={`${shade}-${index}`}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ColorSwatch color={shade} index={index} format={format} />
            </div>
          ))}
        </div>
      </div>

      <div
        className="text-center animate-fade-in"
        style={{ animationDelay: "0.8s" }}
      >
        <p className="text-muted-foreground font-medium">
          Hover over any swatch to copy its{" "}
          {format === "css" ? "CSS" : "Tailwind"} code
        </p>
      </div>
    </div>
  );
};
