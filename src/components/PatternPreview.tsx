"use client";

import { PatternData } from "@/types/pattern";

type PatternPreviewProps = {
  pattern?: PatternData | null;
  previewDataUrl?: string;
  title?: string;
  className?: string;
};

export function PatternPreview({ pattern, previewDataUrl, title, className }: PatternPreviewProps) {
  const src = previewDataUrl || pattern?.previewDataUrl;

  if (src) {
    return (
      <div className={`bead-grid overflow-hidden rounded-2xl bg-surface-container-low ${className || ""}`.trim()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title || pattern?.title || "图纸预览"} className="h-full w-full object-cover" />
      </div>
    );
  }

  if (!pattern) {
    return <div className={`rounded-2xl border border-dashed border-outline-variant/30 ${className || ""}`.trim()} />;
  }

  const paletteMap = new Map(pattern.palette.map((color) => [color.id, color]));

  return (
    <div
      className={`grid overflow-hidden rounded-2xl bg-surface-container-low ${className || ""}`.trim()}
      style={{ gridTemplateColumns: `repeat(${pattern.width}, minmax(0, 1fr))` }}
    >
      {pattern.grid.flatMap((row, y) =>
        row.map((colorId, x) => {
          const color = paletteMap.get(colorId);
          return (
            <span
              key={`${x}-${y}`}
              className="aspect-square"
              style={{ backgroundColor: color ? `rgb(${color.rgb.join(",")})` : "#f5f6f7" }}
            />
          );
        })
      )}
    </div>
  );
}
