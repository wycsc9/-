"use client";

import { create } from "zustand";

import { EditorSettings, HoverInfo, PatternData } from "@/types/pattern";
import { findNearestBeadColor } from "@/lib/color";
import { cellKey } from "@/lib/utils";

type PatternState = {
  pattern: PatternData | null;
  selectedColorId: string | null;
  doneCells: Set<string>;
  showOnlySelectedColor: boolean;
  showOnlySelectedIncomplete: boolean;
  showGridLines: boolean;
  showCoordinates: boolean;
  zoom: number;
  hoverInfo: HoverInfo | null;
  setPattern: (pattern: PatternData | null) => void;
  setSelectedColorId: (colorId: string | null) => void;
  setCellColor: (x: number, y: number, colorId: string) => void;
  toggleDoneCell: (x: number, y: number) => void;
  clearDoneCells: () => void;
  setShowOnlySelectedColor: (value: boolean) => void;
  setShowOnlySelectedIncomplete: (value: boolean) => void;
  setShowGridLines: (value: boolean) => void;
  setShowCoordinates: (value: boolean) => void;
  setZoom: (value: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setHoverInfo: (value: HoverInfo | null) => void;
  hydrateEditor: (settings: Partial<EditorSettings>, doneCells: string[]) => void;
  mergeColors: (sourceColorId: string, targetColorId: string) => void;
  excludeColor: (colorId: string) => void;
};

const MIN_ZOOM = 8;
const MAX_ZOOM = 40;
const DEFAULT_ZOOM = MIN_ZOOM;

const getAutoFitZoom = (pattern: PatternData | null) => {
  void pattern;
  return DEFAULT_ZOOM;
};

export const usePatternStore = create<PatternState>((set, get) => ({
  pattern: null,
  selectedColorId: null,
  doneCells: new Set<string>(),
  showOnlySelectedColor: false,
  showOnlySelectedIncomplete: false,
  showGridLines: true,
  showCoordinates: false,
  zoom: DEFAULT_ZOOM,
  hoverInfo: null,
  setPattern: (pattern) =>
    set({
      pattern,
      selectedColorId: null,
      doneCells: new Set<string>(),
      hoverInfo: null,
      showOnlySelectedColor: false,
      showOnlySelectedIncomplete: false,
      zoom: getAutoFitZoom(pattern)
    }),
  setSelectedColorId: (selectedColorId) => set({ selectedColorId }),
  setCellColor: (x, y, colorId) =>
    set((state) => {
      if (!state.pattern) return {};
      if (x < 0 || y < 0 || y >= state.pattern.height || x >= state.pattern.width) return {};

      const previousColorId = state.pattern.grid[y]?.[x];
      if (!previousColorId || previousColorId === colorId) return {};

      const nextGrid = state.pattern.grid.map((row, rowIndex) =>
        rowIndex === y ? row.map((cellColorId, colIndex) => (colIndex === x ? colorId : cellColorId)) : row
      );

      const nextUsage: Record<string, number> = {};
      nextGrid.flat().forEach((cellColorId) => {
        if (cellColorId !== "empty") {
          nextUsage[cellColorId] = (nextUsage[cellColorId] ?? 0) + 1;
        }
      });

      return {
        pattern: {
          ...state.pattern,
          grid: nextGrid,
          usage: nextUsage
        }
      };
    }),
  toggleDoneCell: (x, y) =>
    set((state) => {
      const key = cellKey(x, y);
      const doneCells = new Set(state.doneCells);
      const colorId = state.pattern?.grid[y]?.[x];
      if (!colorId || colorId === "empty") {
        return {};
      }
      if (doneCells.has(key)) {
        doneCells.delete(key);
      } else {
        doneCells.add(key);
      }
      return { doneCells };
    }),
  clearDoneCells: () => set({ doneCells: new Set<string>() }),
  setShowOnlySelectedColor: (showOnlySelectedColor) => set({ showOnlySelectedColor }),
  setShowOnlySelectedIncomplete: (showOnlySelectedIncomplete) => set({ showOnlySelectedIncomplete }),
  setShowGridLines: (showGridLines) => set({ showGridLines }),
  setShowCoordinates: (showCoordinates) => set({ showCoordinates }),
  setZoom: (zoom) => set({ zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(MAX_ZOOM, state.zoom + 2) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(MIN_ZOOM, state.zoom - 2) })),
  resetZoom: () => set({ zoom: MIN_ZOOM }),
  setHoverInfo: (hoverInfo) => set({ hoverInfo }),
  hydrateEditor: (settings, doneCells) =>
    set((state) => ({
      selectedColorId: settings.selectedColorId ?? state.selectedColorId,
      showOnlySelectedColor: settings.showOnlySelectedColor ?? state.showOnlySelectedColor,
      showOnlySelectedIncomplete: settings.showOnlySelectedIncomplete ?? state.showOnlySelectedIncomplete,
      showGridLines: settings.showGridLines ?? state.showGridLines,
      showCoordinates: settings.showCoordinates ?? state.showCoordinates,
      zoom: settings.zoom ?? state.zoom,
      doneCells: new Set(doneCells)
    })),
  excludeColor: (colorId) =>
    set((state) => {
      if (!state.pattern || colorId === "empty") return {};

      const availablePalette = state.pattern.palette.filter(
        (c) => c.id !== "empty" && c.id !== colorId && (state.pattern!.usage[c.id] ?? 0) > 0
      );
      if (availablePalette.length === 0) return {};

      const nextGrid = state.pattern.grid.map((row) =>
        row.map((cellColorId) => {
          if (cellColorId !== colorId) return cellColorId;
          const nearest = findNearestBeadColor(
            state.pattern!.palette.find((c) => c.id === colorId)!.rgb,
            availablePalette
          );
          return nearest.id;
        })
      );

      const nextUsage: Record<string, number> = {};
      nextGrid.flat().forEach((id) => {
        if (id !== "empty") nextUsage[id] = (nextUsage[id] ?? 0) + 1;
      });

      const nextPalette = state.pattern.palette.filter(
        (c) => c.id === "empty" || nextUsage[c.id]
      );

      return {
        pattern: { ...state.pattern, grid: nextGrid, usage: nextUsage, palette: nextPalette },
        selectedColorId: state.selectedColorId === colorId ? null : state.selectedColorId
      };
    }),
  mergeColors: (sourceColorId, targetColorId) =>
    set((state) => {
      if (!state.pattern || sourceColorId === targetColorId) {
        return {};
      }

      const nextGrid = state.pattern.grid.map((row) =>
        row.map((colorId) => (colorId === sourceColorId ? targetColorId : colorId))
      );

      const nextUsage: Record<string, number> = {};
      nextGrid.flat().forEach((colorId) => {
        if (colorId !== "empty") {
          nextUsage[colorId] = (nextUsage[colorId] ?? 0) + 1;
        }
      });

      const nextPalette = state.pattern.palette.filter(
        (color) => color.id === "empty" || nextUsage[color.id]
      );

      return {
        pattern: {
          ...state.pattern,
          grid: nextGrid,
          usage: nextUsage,
          palette: nextPalette
        },
        selectedColorId: targetColorId
      };
    })
}));
