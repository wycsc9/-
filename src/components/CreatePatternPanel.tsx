"use client";

import { useState } from "react";

import { DEFAULT_BEAD_PALETTE } from "@/lib/beadPalette";
import { getPaletteBySource } from "@/lib/colorSystems";
import { usePatternStore } from "@/store/usePatternStore";
import { BeadPaletteSource } from "@/types/pattern";

const sizeOptions = [16, 24, 32, 48, 64, 80, 96, 128];
const paletteOptions: Array<{ value: BeadPaletteSource; label: string }> = [
  { value: "default", label: "内置基础色库" },
  { value: "MARD", label: "MARD 全色库" },
  { value: "COCO", label: "COCO 全色库" },
  { value: "漫漫", label: "漫漫 全色库" },
  { value: "盼盼", label: "盼盼 全色库" },
  { value: "咪小窝", label: "咪小窝 全色库" }
];

export function CreatePatternPanel() {
  const setPattern = usePatternStore((state) => state.setPattern);
  const [title, setTitle] = useState("自定义图纸");
  const [width, setWidth] = useState(32);
  const [height, setHeight] = useState(32);
  const [paletteSource, setPaletteSource] = useState<BeadPaletteSource>("default");

  const handleCreate = () => {
    const safeWidth = Math.max(1, width);
    const safeHeight = Math.max(1, height);
    const palette = getPaletteBySource(paletteSource, DEFAULT_BEAD_PALETTE);
    const grid = Array.from({ length: safeHeight }, () => Array.from({ length: safeWidth }, () => "empty"));

    setPattern({
      title: title.trim() || "自定义图纸",
      creationType: "manual",
      width: safeWidth,
      height: safeHeight,
      grid,
      palette,
      usage: {}
    });
  };

  return (
    <section className="rounded-3xl border border-white/20 bg-surface-container-lowest/85 p-6 shadow-panel backdrop-blur-md">
      <div className="mb-6">
        <p className="mb-2 text-xs font-headline font-bold uppercase tracking-[0.2em] text-primary">手动创建图纸</p>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">从空白画布开始</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-on-surface">图纸标题</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：我的原创图纸"
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">宽度</span>
          <select
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          >
            {sizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} 格
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">高度</span>
          <select
            value={height}
            onChange={(event) => setHeight(Number(event.target.value))}
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          >
            {sizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} 格
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-on-surface">豆子品牌色库</span>
          <select
            value={paletteSource}
            onChange={(event) => setPaletteSource(event.target.value as BeadPaletteSource)}
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          >
            {paletteOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-full bg-primary px-5 py-3 text-sm font-headline font-bold text-on-primary transition hover:bg-primary-dim"
        >
          创建空白图纸
        </button>
        <span className="text-sm text-on-surface-variant">创建后在右侧色板选中颜色，点击画布即可上色。</span>
      </div>
    </section>
  );
}
