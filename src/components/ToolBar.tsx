"use client";

import { exportPatternAsJson, exportPatternAsPng } from "@/lib/export";
import { usePatternStore } from "@/store/usePatternStore";

const buttonClass =
  "rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-sm font-headline font-bold text-on-surface transition hover:border-primary/40 hover:text-primary";
const activeClass = "border-primary bg-primary text-on-primary hover:border-primary hover:text-on-primary";

export function Toolbar() {
  const pattern = usePatternStore((state) => state.pattern);
  const zoomIn = usePatternStore((state) => state.zoomIn);
  const zoomOut = usePatternStore((state) => state.zoomOut);
  const resetZoom = usePatternStore((state) => state.resetZoom);
  const showGridLines = usePatternStore((state) => state.showGridLines);
  const showCoordinates = usePatternStore((state) => state.showCoordinates);
  const showOnlySelectedColor = usePatternStore((state) => state.showOnlySelectedColor);
  const showOnlySelectedIncomplete = usePatternStore((state) => state.showOnlySelectedIncomplete);
  const setShowGridLines = usePatternStore((state) => state.setShowGridLines);
  const setShowCoordinates = usePatternStore((state) => state.setShowCoordinates);
  const setShowOnlySelectedColor = usePatternStore((state) => state.setShowOnlySelectedColor);
  const setShowOnlySelectedIncomplete = usePatternStore((state) => state.setShowOnlySelectedIncomplete);
  const clearDoneCells = usePatternStore((state) => state.clearDoneCells);
  const doneCells = usePatternStore((state) => state.doneCells);

  if (!pattern) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-outline-variant/20 bg-surface-container-low p-3">
      <button type="button" onClick={zoomOut} className={buttonClass}>
        缩小
      </button>
      <button type="button" onClick={zoomIn} className={buttonClass}>
        放大
      </button>
      <button type="button" onClick={resetZoom} className={buttonClass}>
        重置缩放
      </button>
      <button
        type="button"
        onClick={() => setShowGridLines(!showGridLines)}
        className={`${buttonClass} ${showGridLines ? activeClass : ""}`}
      >
        网格线
      </button>
      <button
        type="button"
        onClick={() => setShowCoordinates(!showCoordinates)}
        className={`${buttonClass} ${showCoordinates ? activeClass : ""}`}
      >
        坐标
      </button>
      <button
        type="button"
        onClick={() => setShowOnlySelectedColor(!showOnlySelectedColor)}
        className={`${buttonClass} ${showOnlySelectedColor ? activeClass : ""}`}
      >
        只看当前颜色
      </button>
      <button
        type="button"
        onClick={() => setShowOnlySelectedIncomplete(!showOnlySelectedIncomplete)}
        className={`${buttonClass} ${showOnlySelectedIncomplete ? activeClass : ""}`}
      >
        只看未完成
      </button>
      <button type="button" onClick={() => exportPatternAsJson(pattern)} className={buttonClass}>
        导出 JSON
      </button>
      <button type="button" onClick={() => exportPatternAsPng(pattern, doneCells)} className={buttonClass}>
        导出 PNG
      </button>
      <button type="button" onClick={clearDoneCells} className={buttonClass}>
        清空完成状态
      </button>
    </div>
  );
}
