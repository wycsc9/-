"use client";

import { DEFAULT_BEAD_PALETTE, EMPTY_BEAD_COLOR } from "@/lib/beadPalette";
import { findNearestBeadColor } from "@/lib/color";
import { getPaletteBySource } from "@/lib/colorSystems";
import { BeadColor, BeadPaletteSource, PatternData, PixelationMode, RGBTuple } from "@/types/pattern";

type ConvertOptions = {
  file: File;
  width: number;
  height?: number;
  maxColors: number;
  title?: string;
  paletteSource?: BeadPaletteSource;
  pixelationMode?: PixelationMode;
  similarityThreshold?: number;
};

const FILE_SIZE_LIMIT = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("无法读取图片"));
    };
    image.src = objectUrl;
  });

const quantizeChannel = (value: number, step: number) => Math.round(value / step) * step;

const quantizeRgb = (rgb: RGBTuple, bucketSize: number): RGBTuple => [
  Math.min(255, quantizeChannel(rgb[0], bucketSize)),
  Math.min(255, quantizeChannel(rgb[1], bucketSize)),
  Math.min(255, quantizeChannel(rgb[2], bucketSize))
];

const getCellRepresentativeColor = (
  imageData: ImageData,
  startX: number,
  startY: number,
  cellWidth: number,
  cellHeight: number,
  mode: PixelationMode
) => {
  const { data, width } = imageData;
  let pixelCount = 0;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  const counts = new Map<string, { rgb: RGBTuple; count: number }>();
  let dominant: RGBTuple | null = null;
  let dominantCount = 0;

  for (let y = startY; y < startY + cellHeight; y += 1) {
    for (let x = startX; x < startX + cellWidth; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      if (alpha < 128) {
        continue;
      }

      const rgb: RGBTuple = [data[index], data[index + 1], data[index + 2]];
      pixelCount += 1;

      if (mode === "average") {
        rSum += rgb[0];
        gSum += rgb[1];
        bSum += rgb[2];
      } else {
        const key = rgb.join(",");
        const count = (counts.get(key)?.count ?? 0) + 1;
        counts.set(key, { rgb, count });
        if (count > dominantCount) {
          dominantCount = count;
          dominant = rgb;
        }
      }
    }
  }

  if (pixelCount === 0) {
    return null;
  }

  if (mode === "average") {
    return [Math.round(rSum / pixelCount), Math.round(gSum / pixelCount), Math.round(bSum / pixelCount)] as RGBTuple;
  }

  return dominant;
};

const buildAdaptivePalette = (pixels: RGBTuple[], maxColors: number) => {
  const bucketSize = maxColors <= 8 ? 64 : maxColors <= 16 ? 48 : maxColors <= 24 ? 36 : 28;
  const counts = new Map<string, { rgb: RGBTuple; count: number }>();

  for (const pixel of pixels) {
    const rgb = quantizeRgb(pixel, bucketSize);
    const key = rgb.join(",");
    const current = counts.get(key);
    if (current) {
      current.count += 1;
    } else {
      counts.set(key, { rgb, count: 1 });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors)
    .map((entry) => entry.rgb);
};

const createLimitedTargetPalette = (cellColors: RGBTuple[], sourcePalette: BeadColor[], maxColors: number) => {
  const adaptivePalette = buildAdaptivePalette(cellColors, maxColors);
  const mapped = adaptivePalette.map((rgb) => findNearestBeadColor(rgb, sourcePalette));
  const unique = [...new Map(mapped.map((item) => [item.id, item])).values()];

  if (unique.length >= Math.min(maxColors, sourcePalette.length)) {
    return unique;
  }

  return sourcePalette.slice(0, Math.min(sourcePalette.length, maxColors));
};

const mergeSimilarColorIds = (
  grid: string[][],
  palette: BeadColor[],
  usage: Record<string, number>,
  similarityThreshold: number
) => {
  if (similarityThreshold <= 0) {
    return { grid, usage };
  }

  const paletteMap = new Map(palette.map((color) => [color.id, color]));
  const colorsByFrequency = Object.entries(usage)
    .sort((a, b) => b[1] - a[1])
    .map(([colorId]) => colorId);
  const replacementMap = new Map<string, string>();

  for (let index = 0; index < colorsByFrequency.length; index += 1) {
    const dominantId = colorsByFrequency[index];
    if (replacementMap.has(dominantId)) {
      continue;
    }

    const dominantColor = paletteMap.get(dominantId);
    if (!dominantColor) {
      continue;
    }

    for (let candidateIndex = index + 1; candidateIndex < colorsByFrequency.length; candidateIndex += 1) {
      const candidateId = colorsByFrequency[candidateIndex];
      if (replacementMap.has(candidateId)) {
        continue;
      }

      const candidateColor = paletteMap.get(candidateId);
      if (!candidateColor) {
        continue;
      }

      const distance = Math.sqrt(
        (dominantColor.rgb[0] - candidateColor.rgb[0]) ** 2 +
          (dominantColor.rgb[1] - candidateColor.rgb[1]) ** 2 +
          (dominantColor.rgb[2] - candidateColor.rgb[2]) ** 2
      );

      if (distance <= similarityThreshold) {
        replacementMap.set(candidateId, dominantId);
      }
    }
  }

  if (replacementMap.size === 0) {
    return { grid, usage };
  }

  const nextGrid = grid.map((row) => row.map((colorId) => replacementMap.get(colorId) ?? colorId));
  const nextUsage: Record<string, number> = {};
  nextGrid.flat().forEach((colorId) => {
    if (colorId !== "empty") {
      nextUsage[colorId] = (nextUsage[colorId] ?? 0) + 1;
    }
  });

  return { grid: nextGrid, usage: nextUsage };
};

const renderPreview = (grid: string[][], width: number, height: number, colorMap: Map<string, RGBTuple>) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    return undefined;
  }

  grid.forEach((row, y) => {
    row.forEach((colorId, x) => {
      const rgb = colorMap.get(colorId);
      if (!rgb) {
        return;
      }
      context.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      context.fillRect(x, y, 1, 1);
    });
  });

  return canvas.toDataURL("image/png");
};

export const imageToPattern = async ({
  file,
  width,
  height: forcedHeight,
  maxColors,
  title,
  paletteSource = "default",
  pixelationMode = "average",
  similarityThreshold = 0
}: ConvertOptions): Promise<PatternData> => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("只支持 PNG、JPG、JPEG、WEBP");
  }

  if (file.size > FILE_SIZE_LIMIT) {
    throw new Error("图片大小不能超过 10MB");
  }

  const image = await loadImage(file);
  const height = forcedHeight
    ? Math.max(1, forcedHeight)
    : Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * width));
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("浏览器不支持 Canvas");
  }

  context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  const fullImageData = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
  const cellWidth = image.naturalWidth / width;
  const cellHeight = image.naturalHeight / height;
  const representativeColors: Array<RGBTuple | null> = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const startX = Math.floor(x * cellWidth);
      const startY = Math.floor(y * cellHeight);
      const endX = Math.min(image.naturalWidth, Math.ceil((x + 1) * cellWidth));
      const endY = Math.min(image.naturalHeight, Math.ceil((y + 1) * cellHeight));
      representativeColors.push(
        getCellRepresentativeColor(
          fullImageData,
          startX,
          startY,
          Math.max(1, endX - startX),
          Math.max(1, endY - startY),
          pixelationMode
        )
      );
    }
  }

  const sourcePalette = getPaletteBySource(paletteSource, DEFAULT_BEAD_PALETTE).filter((color) => color.id !== "empty");
  const limitedTargetPalette = createLimitedTargetPalette(
    representativeColors.filter(Boolean) as RGBTuple[],
    sourcePalette,
    Math.min(maxColors, sourcePalette.length)
  );
  const finalPalette = [EMPTY_BEAD_COLOR, ...limitedTargetPalette];

  const usage: Record<string, number> = {};
  const grid: string[][] = [];

  for (let y = 0; y < height; y += 1) {
    const row: string[] = [];

    for (let x = 0; x < width; x += 1) {
      const pixel = representativeColors[y * width + x];
      const color = pixel ? findNearestBeadColor(pixel, limitedTargetPalette) : EMPTY_BEAD_COLOR;
      row.push(color.id);
      if (color.id !== "empty") {
        usage[color.id] = (usage[color.id] ?? 0) + 1;
      }
    }

    grid.push(row);
  }

  const mergedResult = mergeSimilarColorIds(grid, finalPalette, usage, similarityThreshold);
  const activePaletteIds = new Set(mergedResult.grid.flat());
  const cleanedPalette = finalPalette.filter((color) => color.id === "empty" || activePaletteIds.has(color.id));

  const previewDataUrl = renderPreview(
    mergedResult.grid,
    width,
    height,
    new Map(cleanedPalette.map((color) => [color.id, color.rgb]))
  );

  return {
    title: title || file.name.replace(/\.[^.]+$/, ""),
    creationType: "photo",
    width,
    height,
    grid: mergedResult.grid,
    palette: cleanedPalette,
    usage: mergedResult.usage,
    previewDataUrl
  };
};
