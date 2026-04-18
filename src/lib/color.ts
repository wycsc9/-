import { BeadColor, RGBTuple } from "@/types/pattern";

export const clamp = (value: number, min = 0, max = 255) => Math.min(max, Math.max(min, value));

export const rgbDistanceSquared = (a: RGBTuple, b: RGBTuple) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

export const findNearestBeadColor = (rgb: RGBTuple, palette: BeadColor[]) =>
  palette.reduce((closest, color) => {
    if (!closest) {
      return color;
    }

    return rgbDistanceSquared(rgb, color.rgb) < rgbDistanceSquared(rgb, closest.rgb) ? color : closest;
  }, palette[0]);

export const rgbToHex = ([r, g, b]: RGBTuple) =>
  `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")}`;

export const hexToRgb = (hex: string): RGBTuple => {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((c) => `${c}${c}`).join("") : value;
  const int = Number.parseInt(normalized, 16);

  return [int >> 16, (int >> 8) & 255, int & 255];
};

export const rgbToCss = (rgb: RGBTuple, alpha = 1) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

export const mixRgb = (a: RGBTuple, b: RGBTuple, weight = 0.5): RGBTuple => [
  Math.round(a[0] * (1 - weight) + b[0] * weight),
  Math.round(a[1] * (1 - weight) + b[1] * weight),
  Math.round(a[2] * (1 - weight) + b[2] * weight)
];
