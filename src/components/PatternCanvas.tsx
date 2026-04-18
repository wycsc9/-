"use client";

import { useEffect, useState } from "react";

import { getCellFromPointer, useCanvasRenderer } from "@/hooks/useCanvasRenderer";
import { usePatternStore } from "@/store/usePatternStore";

export function PatternCanvas() {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const pattern = usePatternStore((state) => state.pattern);
  const zoom = usePatternStore((state) => state.zoom);
  const selectedColorId = usePatternStore((state) => state.selectedColorId);
  const doneCells = usePatternStore((state) => state.doneCells);
  const showOnlySelectedColor = usePatternStore((state) => state.showOnlySelectedColor);
  const showOnlySelectedIncomplete = usePatternStore((state) => state.showOnlySelectedIncomplete);
  const showGridLines = usePatternStore((state) => state.showGridLines);
  const showCoordinates = usePatternStore((state) => state.showCoordinates);
  const hoverInfo = usePatternStore((state) => state.hoverInfo);
  const toggleDoneCell = usePatternStore((state) => state.toggleDoneCell);
  const setCellColor = usePatternStore((state) => state.setCellColor);
  const setHoverInfo = usePatternStore((state) => state.setHoverInfo);

  useCanvasRenderer({
    canvas: canvasElement,
    pattern: pattern!,
    zoom,
    selectedColorId,
    doneCells,
    showOnlySelectedColor,
    showOnlySelectedIncomplete,
    showGridLines,
    showCoordinates,
    hoverInfo
  });

  useEffect(() => () => setHoverInfo(null), [setHoverInfo]);

  if (!pattern) {
    return (
      <div className="grid min-h-[360px] place-items-center rounded-[32px] border border-dashed border-outline-variant/30 bg-surface-container-low text-on-surface-variant">
        生成或打开图纸后，这里会显示拼豆画布。
      </div>
    );
  }

  return (
    <div className="bead-grid overflow-auto rounded-3xl border border-outline-variant/20 bg-surface-container-low p-4">
      <canvas
        ref={setCanvasElement}
        className="cursor-crosshair rounded-2xl bg-surface-container-lowest"
        onMouseMove={(event) => {
          if (!canvasElement) {
            return;
          }
          const { x, y } = getCellFromPointer(event, canvasElement, zoom);
          if (x < 0 || y < 0 || x >= pattern.width || y >= pattern.height) {
            setHoverInfo(null);
            return;
          }
          setHoverInfo({ x, y, colorId: pattern.grid[y][x] });
        }}
        onMouseLeave={() => setHoverInfo(null)}
        onClick={(event) => {
          if (!canvasElement) {
            return;
          }
          const { x, y } = getCellFromPointer(event, canvasElement, zoom);
          if (x < 0 || y < 0 || x >= pattern.width || y >= pattern.height) {
            return;
          }
          if (selectedColorId) {
            setCellColor(x, y, selectedColorId);
            return;
          }
          toggleDoneCell(x, y);
        }}
      />
    </div>
  );
}
