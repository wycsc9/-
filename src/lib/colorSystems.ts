import colorSystemMapping from "@/lib/data/colorSystemMapping.json";
import { EMPTY_BEAD_COLOR } from "@/lib/beadPalette";
import { hexToRgb } from "@/lib/color";
import { BeadColor, BeadPaletteSource } from "@/types/pattern";

type ImportedColorSystem = Exclude<BeadPaletteSource, "default">;
type ColorSystemRecord = Record<ImportedColorSystem, string>;

const mapping = colorSystemMapping as Record<string, ColorSystemRecord>;

export const IMPORTED_COLOR_SYSTEMS: ImportedColorSystem[] = ["MARD", "COCO", "漫漫", "盼盼", "咪小窝"];

export const getImportedPalette = (system: ImportedColorSystem): BeadColor[] => [
  EMPTY_BEAD_COLOR,
  ...Object.entries(mapping).map(([hex, codes]) => {
    const rgb = hexToRgb(hex);
    const code = codes[system];

    return {
      id: `${system}-${code}`.toLowerCase(),
      code,
      name: `${system} ${code}`,
      rgb,
      brand: system
    };
  })
];

export const getPaletteBySource = (source: BeadPaletteSource, defaultPalette: BeadColor[]) => {
  if (source === "default") {
    return defaultPalette;
  }

  return getImportedPalette(source);
};
