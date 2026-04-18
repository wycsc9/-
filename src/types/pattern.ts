export type RGBTuple = [number, number, number];

export type BeadColor = {
  id: string;
  code: string;
  name: string;
  rgb: RGBTuple;
  brand?: string;
};

export type PatternData = {
  id?: string;
  title?: string;
  creationType?: "manual" | "photo" | "preset";
  width: number;
  height: number;
  grid: string[][];
  palette: BeadColor[];
  usage: Record<string, number>;
  previewDataUrl?: string;
};

export type PatternCellState = {
  key: string;
  x: number;
  y: number;
  colorId: string;
  done: boolean;
};

export type HoverInfo = {
  x: number;
  y: number;
  colorId: string;
};

export type EditorSettings = {
  selectedColorId: string | null;
  showOnlySelectedColor: boolean;
  showOnlySelectedIncomplete: boolean;
  showGridLines: boolean;
  showCoordinates: boolean;
  zoom: number;
};

export type PatternSummary = {
  id: string;
  title: string;
  width: number;
  height: number;
  previewDataUrl?: string;
  description?: string;
};

export type PixelationMode = "average" | "dominant";

export type BeadPaletteSource = "default" | "MARD" | "COCO" | "漫漫" | "盼盼" | "咪小窝";
