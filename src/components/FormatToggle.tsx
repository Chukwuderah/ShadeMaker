import { Button } from "@/components/ui/button";

interface FormatToggleProps {
  format: "vanilla" | "tailwind";
  onFormatChange: (format: "vanilla" | "tailwind") => void;
}

export const FormatToggle = ({ format, onFormatChange }: FormatToggleProps) => {
  return (
    <div className="glassmorphism-card flex items-center space-x-2 p-2 rounded-2xl">
      <Button
        variant={format === "vanilla" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFormatChange("vanilla")}
        className={`transition-spring rounded-xl font-medium ${
          format === "vanilla"
            ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
            : "hover:bg-white/50 hover:scale-105"
        }`}
      >
        Vanilla CSS
      </Button>
      <Button
        variant={format === "tailwind" ? "default" : "ghost"}
        size="sm"
        onClick={() => onFormatChange("tailwind")}
        className={`transition-spring rounded-xl font-medium ${
          format === "tailwind"
            ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
            : "hover:bg-white/50 hover:scale-105"
        }`}
      >
        Tailwind CSS
      </Button>
    </div>
  );
};
