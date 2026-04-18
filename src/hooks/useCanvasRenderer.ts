"use client";

import { useEffect } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { mixRgb, rgbToCss } from "@/lib/color";
import { cellKey } from "@/lib/utils";
import { BeadColor, HoverInfo, PatternData } from "@/types/pattern";

type RendererArgs = {
  canvas: HTMLCanvasElement | null;
  pattern: PatternData;
  zoom: number;
  selectedColorId: string | null;
  doneCells: Set<string>;
  showOnlySelectedColor: boolean;
  showOnlySelectedIncomplete: boolean;
  showGridLines: boolean;
  showCoordinates: boolean;
  hoverInfo: HoverInfo | null;
};

const dimmedColor = (rgb: BeadColor["rgb"]) => mixRgb(rgb, [248, 244, 236], 0.72);
const grayscaleColor = (rgb: BeadColor["rgb"]): BeadColor["rgb"] => {
  const luma = Math.round(rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114);
  return [luma, luma, luma];
};
const mutedContrastColor = (rgb: BeadColor["rgb"]) => mixRgb(grayscaleColor(rgb), [252, 250, 245], 0.58);

export const getCellFromPointer = (
  event: MouseEvent | ReactMouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
  zoom: number
) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / zoom);
  const y = Math.floor((event.clientY - rect.top) / zoom);
  return { x, y };
};

export const useCanvasRenderer = ({
  canvas,
  pattern,
  zoom,
  selectedColorId,
  doneCells,
  showOnlySelectedColor,
  showOnlySelectedIncomplete,
  showGridLines,
  showCoordinates,
  hoverInfo
}: RendererArgs) => {
  useEffect(() => {
    if (!canvas) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(pattern.width * zoom * dpr);
    canvas.height = Math.floor(pattern.height * zoom * dpr);
    canvas.style.width = `${pattern.width * zoom}px`;
    canvas.style.height = `${pattern.height * zoom}px`;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, pattern.width * zoom, pattern.height * zoom);
    const paletteMap = new Map(pattern.palette.map((color) => [color.id, color]));

    pattern.grid.forEach((row, y) => {
      row.forEach((colorId, x) => {
        const bead = paletteMap.get(colorId);
        if (!bead) {
          return;
        }

        const isSelected = selectedColorId === colorId;
        const isDone = doneCells.has(cellKey(x, y));
        const hideBySelected = showOnlySelectedColor && selectedColorId && !isSelected;
        const hideByIncomplete =
          showOnlySelectedIncomplete &&
          selectedColorId &&
          (!isSelected || isDone);

        let fill = bead.rgb;
        if (hideBySelected || hideByIncomplete) {
          fill = dimmedColor(bead.rgb);
        } else if (selectedColorId && !isSelected) {
          fill = mutedContrastColor(bead.rgb);
        }

        context.fillStyle = rgbToCss(fill);
        context.fillRect(x * zoom, y * zoom, zoom, zoom);

        if (isDone) {
          context.fillStyle = "rgba(255,255,255,0.35)";
          context.fillRect(x * zoom, y * zoom, zoom, zoom);
          context.strokeStyle = "rgba(31, 41, 55, 0.68)";
          context.lineWidth = Math.max(1, zoom * 0.08);
          context.beginPath();
          context.moveTo(x * zoom + zoom * 0.22, y * zoom + zoom * 0.22);
          context.lineTo((x + 1) * zoom - zoom * 0.22, (y + 1) * zoom - zoom * 0.22);
          context.moveTo((x + 1) * zoom - zoom * 0.22, y * zoom + zoom * 0.22);
          context.lineTo(x * zoom + zoom * 0.22, (y + 1) * zoom - zoom * 0.22);
          context.stroke();
        }

        if (showCoordinates && zoom >= 22 && colorId !== "empty") {
          context.fillStyle = "rgba(31, 41, 55, 0.72)";
          context.font = `${Math.max(8, zoom * 0.22)}px sans-serif`;
          context.fillText(`${x},${y}`, x * zoom + 2, y * zoom + zoom * 0.52);
        }
      });
    });

    if (showGridLines) {
      context.strokeStyle = "rgba(31, 41, 55, 0.12)";
      context.lineWidth = 1;
      for (let x = 0; x <= pattern.width; x += 1) {
        context.beginPath();
        context.moveTo(x * zoom, 0);
        context.lineTo(x * zoom, pattern.height * zoom);
        context.stroke();
      }
      for (let y = 0; y <= pattern.height; y += 1) {
        context.beginPath();
        context.moveTo(0, y * zoom);
        context.lineTo(pattern.width * zoom, y * zoom);
        context.stroke();
      }
    }

    if (hoverInfo) {
      context.strokeStyle = "rgba(217, 119, 6, 0.9)";
      context.lineWidth = Math.max(2, zoom * 0.12);
      context.strokeRect(hoverInfo.x * zoom + 1, hoverInfo.y * zoom + 1, zoom - 2, zoom - 2);
    }
  }, [
    canvas,
    doneCells,
    hoverInfo,
    pattern,
    selectedColorId,
    showCoordinates,
    showGridLines,
    showOnlySelectedColor,
    showOnlySelectedIncomplete,
    zoom
  ]);
};
