import tinycolor from "tinycolor2";

export interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  isLight?: boolean;
  isDark?: boolean;
  brightness?: number;
  luminance?: number;
}

// ----- helpers you already have (unchanged) -----
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export const isValidColor = (colorString: string): boolean =>
  tinycolor(colorString).isValid();

export const getColorInfo = (colorString: string): ColorInfo | null => {
  const color = tinycolor(colorString);
  if (!color.isValid()) return null;

  return {
    hex: color.toHexString(),
    rgb: color.toRgbString(),
    hsl: color.toHslString(),
    isLight: color.isLight(),
    isDark: color.isDark(),
    brightness: color.getBrightness(),
    luminance: color.getLuminance(),
  };
};

// ===== SHADE GENERATOR — ALWAYS light → dark =====
export function generateShades(
  baseColor: string,
  count: number = 10
): ColorInfo[] {
  if (!isValidColor(baseColor)) return [];

  const n = Math.max(10, Math.floor(count)); // enforce minimum 10
  const base = tinycolor(baseColor).toHsl();

  // Keep hue, clamp saturation so extremes keep color identity
  const hue = base.h; // 0..360
  const sat = Math.min(0.92, Math.max(0.15, base.s)); // 0.15..0.92

  // Lightness from very light → very dark
  const L_START = 0.95; // lightest
  const L_END = 0.1; // darkest
  const step = (L_START - L_END) / (n - 1);

  const shades: ColorInfo[] = [];
  for (let i = 0; i < n; i++) {
    const l = L_START - step * i; // 0.95 → 0.10
    const shade = tinycolor({ h: hue, s: sat, l });
    const info = getColorInfo(shade.toHexString());
    if (info) shades.push(info);
  }

  // No extra sorting — generation order is light → dark
  return shades;
}

// ===== HEX VALIDATION =====
export function isValidHex(hex: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

// ===== COLOR NAME MAP =====
export function nameToHex(colorName: string): string | null {
  const colors: Record<string, string> = {
    red: "#ff0000",
    blue: "#0000ff",
    green: "#008000",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    brown: "#a52a2a",
    black: "#000000",
    white: "#ffffff",
    gray: "#808080",
    grey: "#808080",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    lime: "#00ff00",
    indigo: "#4b0082",
    violet: "#ee82ee",
    turquoise: "#40e0d0",
    coral: "#ff7f50",
    salmon: "#fa8072",
    gold: "#ffd700",
    silver: "#c0c0c0",
    navy: "#000080",
    teal: "#008080",
    olive: "#808000",
    maroon: "#800000",
  };
  return colors[colorName.toLowerCase()] || null;
}
