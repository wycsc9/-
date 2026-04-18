"use client";

import { usePatternStore } from "@/store/usePatternStore";

export function StatusBar() {
  const pattern = usePatternStore((state) => state.pattern);
  const hoverInfo = usePatternStore((state) => state.hoverInfo);
  const zoom = usePatternStore((state) => state.zoom);

  if (!pattern) {
    return null;
  }

  const color = hoverInfo ? pattern.palette.find((item) => item.id === hoverInfo.colorId) : null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
      <span>尺寸 {pattern.width} x {pattern.height}</span>
      <span>缩放 {zoom}px</span>
      <span>
        悬停 {hoverInfo ? `${hoverInfo.x}, ${hoverInfo.y}` : "--"}
      </span>
      <span>当前颜色 {color ? `${color.name} (${color.code})` : "--"}</span>
    </div>
  );
}
