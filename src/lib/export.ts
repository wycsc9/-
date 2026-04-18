"use client";

import { downloadBlob } from "@/lib/utils";
import { PatternData } from "@/types/pattern";

export const exportPatternAsJson = (pattern: PatternData) => {
  const blob = new Blob([JSON.stringify(pattern, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${pattern.title || "pattern"}.json`);
};

export const exportPatternAsPng = (pattern: PatternData, doneCells?: Set<string>) => {
  const canvas = document.createElement("canvas");
  const cellSize = 24;
  canvas.width = pattern.width * cellSize;
  canvas.height = pattern.height * cellSize;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("无法导出 PNG");
  }

  const colorMap = new Map(pattern.palette.map((color) => [color.id, color]));
  context.fillStyle = "#fffaf1";
  context.fillRect(0, 0, canvas.width, canvas.height);

  pattern.grid.forEach((row, y) => {
    row.forEach((colorId, x) => {
      const color = colorMap.get(colorId);
      if (!color) {
        return;
      }

      context.fillStyle = `rgb(${color.rgb.join(",")})`;
      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      context.strokeStyle = "rgba(31, 41, 55, 0.18)";
      context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

      if (doneCells?.has(`${x}:${y}`)) {
        context.fillStyle = "rgba(255, 255, 255, 0.35)";
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        context.strokeStyle = "rgba(31, 41, 55, 0.55)";
        context.beginPath();
        context.moveTo(x * cellSize + 4, y * cellSize + 4);
        context.lineTo((x + 1) * cellSize - 4, (y + 1) * cellSize - 4);
        context.moveTo((x + 1) * cellSize - 4, y * cellSize + 4);
        context.lineTo(x * cellSize + 4, (y + 1) * cellSize - 4);
        context.stroke();
      }
    });
  });

  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, `${pattern.title || "pattern"}.png`);
    }
  }, "image/png");
};
