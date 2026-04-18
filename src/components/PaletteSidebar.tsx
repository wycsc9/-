"use client";

import { useEffect, useMemo, useState } from "react";

import { usePatternStore } from "@/store/usePatternStore";
import { formatCount } from "@/lib/utils";

const COLOR_GROUP_ORDER = ["空白/擦除", "红粉系", "橙黄系", "绿色系", "蓝紫系", "棕肤系", "中性色"] as const;

const rgbToHsl = (r: number, g: number, b: number) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
};

const getColorGroup = (colorId: string, rgb: [number, number, number]) => {
  if (colorId === "empty") return "空白/擦除";

  const { h, s, l } = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  if (s < 14) return "中性色";
  if (l < 35 && h >= 15 && h <= 55) return "棕肤系";
  if (h < 20 || h >= 330) return "红粉系";
  if (h < 70) return "橙黄系";
  if (h < 175) return "绿色系";
  if (h < 330) return "蓝紫系";

  return "中性色";
};

export function PaletteSidebar() {
  const pattern = usePatternStore((state) => state.pattern);
  const selectedColorId = usePatternStore((state) => state.selectedColorId);
  const setSelectedColorId = usePatternStore((state) => state.setSelectedColorId);
  const doneCells = usePatternStore((state) => state.doneCells);
  const mergeColors = usePatternStore((state) => state.mergeColors);
  const excludeColor = usePatternStore((state) => state.excludeColor);
  const [mergeMode, setMergeMode] = useState(false);
  const [paletteScale, setPaletteScale] = useState<number>(0.9);
  const [activeGroup, setActiveGroup] = useState<string>("");
  const [recentColorIds, setRecentColorIds] = useState<string[]>([]);

  const doneCountByColor = new Map<string, number>();
  if (pattern) {
    doneCells.forEach((key) => {
      const [x, y] = key.split(":").map(Number);
      const colorId = pattern.grid[y]?.[x];
      if (colorId) {
        doneCountByColor.set(colorId, (doneCountByColor.get(colorId) ?? 0) + 1);
      }
    });
  }

  const visibleColors = useMemo(() => {
    if (!pattern) return [];
    return pattern.palette
      .filter((color) => (pattern.creationType === "manual" ? true : color.id !== "empty" && (pattern.usage[color.id] ?? 0) > 0))
      .sort((a, b) => (pattern.usage[b.id] ?? 0) - (pattern.usage[a.id] ?? 0));
  }, [pattern]);

  const colorCountText = pattern
    ? pattern.creationType === "manual"
      ? `${visibleColors.filter((color) => color.id !== "empty").length} 种可选色`
      : `${Object.keys(pattern.usage).length} 种颜色`
    : "0 种颜色";

  const groupedColors = new Map<string, typeof visibleColors>();
  visibleColors.forEach((color) => {
    const group = getColorGroup(color.id, color.rgb);
    if (!groupedColors.has(group)) groupedColors.set(group, []);
    groupedColors.get(group)!.push(color);
  });
  const availableGroups = COLOR_GROUP_ORDER.filter((group) => (groupedColors.get(group)?.length ?? 0) > 0);

  useEffect(() => {
    if (availableGroups.length === 0) {
      setActiveGroup("");
      return;
    }
    if (!activeGroup || !availableGroups.includes(activeGroup as (typeof COLOR_GROUP_ORDER)[number])) {
      setActiveGroup(availableGroups[0]);
    }
  }, [activeGroup, availableGroups]);

  useEffect(() => {
    if (!selectedColorId) return;
    if (!visibleColors.some((color) => color.id === selectedColorId)) return;

    setRecentColorIds((prev) => {
      const next = [selectedColorId, ...prev.filter((id) => id !== selectedColorId)];
      return next.slice(0, 8);
    });
  }, [selectedColorId, visibleColors]);

  if (!pattern) {
    return (
      <aside className="rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-low p-5 text-sm text-on-surface-variant">
        先上传图片或打开一个预置图纸。
      </aside>
    );
  }

  const handleColorSelect = (colorId: string) => {
    const selected = selectedColorId === colorId;

    if (mergeMode && selectedColorId && selectedColorId !== colorId) {
      mergeColors(selectedColorId, colorId);
      setMergeMode(false);
      return;
    }

    setSelectedColorId(selected ? null : colorId);
  };

  const renderColorButton = (color: (typeof visibleColors)[number]) => {
    const total = pattern.usage[color.id] ?? 0;
    const done = doneCountByColor.get(color.id) ?? 0;
    const selected = selectedColorId === color.id;

    return (
      <div
        key={color.id}
        className={`flex items-center gap-3 rounded-2xl border transition ${
          selected
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-outline-variant/20 bg-surface-container-low hover:border-outline-variant/40"
        }`}
        style={{
          paddingTop: `${Math.round(10 * paletteScale)}px`,
          paddingBottom: `${Math.round(10 * paletteScale)}px`,
          paddingLeft: `${Math.round(12 * paletteScale)}px`,
          paddingRight: `${Math.round(8 * paletteScale)}px`
        }}
      >
        <button type="button" onClick={() => handleColorSelect(color.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span
            className="shrink-0 rounded-xl border border-black/10"
            style={{
              width: `${Math.round(34 * paletteScale)}px`,
              height: `${Math.round(34 * paletteScale)}px`,
              backgroundColor: `rgb(${color.rgb.join(",")})`
            }}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-on-surface" style={{ fontSize: `${Math.max(11, Math.round(14 * paletteScale))}px` }}>
              {color.name}
            </span>
            <span className="block text-on-surface-variant" style={{ fontSize: `${Math.max(10, Math.round(12 * paletteScale))}px` }}>
              {color.code} · {formatCount(total)} 颗
            </span>
          </span>
          <span
            className="shrink-0 rounded-full bg-surface-container-lowest text-on-surface-variant"
            style={{
              fontSize: `${Math.max(10, Math.round(11 * paletteScale))}px`,
              padding: `${Math.max(4, Math.round(4 * paletteScale))}px ${Math.max(8, Math.round(8 * paletteScale))}px`
            }}
          >
            已完成 {formatCount(done)}
          </span>
        </button>
        {pattern.creationType !== "manual" && (
          <button
            type="button"
            title="排除此颜色，自动重映射到最近色"
            onClick={() => excludeColor(color.id)}
            className="shrink-0 rounded-full p-1.5 text-on-surface-variant/40 transition hover:bg-error/10 hover:text-error"
            style={{ fontSize: `${Math.max(10, Math.round(12 * paletteScale))}px` }}
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  return (
    <aside className="sticky top-28 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-headline text-xl font-bold text-on-surface">调整面板</h2>
        <span className="text-xs text-on-surface-variant">{colorCountText}</span>
      </div>
      <div className="mb-4 space-y-2 rounded-2xl border border-outline-variant/15 bg-surface-container-low p-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMergeMode((value) => !value);
              if (mergeMode) {
                setSelectedColorId(null);
              }
            }}
            className={`rounded-full px-3 py-2 text-xs font-headline font-bold transition ${
              mergeMode
                ? "bg-primary text-on-primary"
                : "border border-outline-variant/30 bg-surface-container-lowest text-on-surface"
            }`}
          >
            {mergeMode ? "退出颜色合并" : "颜色合并"}
          </button>
          {mergeMode && selectedColorId ? (
            <button
              type="button"
              onClick={() => setSelectedColorId(null)}
              className="rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-xs font-headline font-bold text-on-surface"
            >
              重选源颜色
            </button>
          ) : null}
        </div>
        <p className="text-xs leading-6 text-on-surface-variant">
          {mergeMode
            ? selectedColorId
              ? "步骤 2：点击目标颜色，当前高亮颜色会立刻合并过去。"
              : "步骤 1：先点击要被合并掉的源颜色，画布会同步高亮该颜色。"
            : "普通模式下点击颜色仅做高亮筛选。"}
        </p>
      </div>
      <div className="mb-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant">色板缩放</span>
          <span className="text-xs text-on-surface-variant">
            {paletteScale <= 0.8 ? "小" : paletteScale >= 1.05 ? "大" : "中"}
          </span>
        </div>
        <input
          type="range"
          min="0.7"
          max="1.2"
          step="0.05"
          value={paletteScale}
          onChange={(event) => setPaletteScale(Number(event.target.value))}
          className="w-full accent-primary"
        />
      </div>
      <div className="mb-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant">最近使用颜色</span>
          <span className="text-xs text-on-surface-variant">{recentColorIds.length}/8</span>
        </div>
        {recentColorIds.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {recentColorIds
              .map((id) => visibleColors.find((color) => color.id === id))
              .filter((color): color is (typeof visibleColors)[number] => Boolean(color))
              .map((color) => {
                const selected = selectedColorId === color.id;
                return (
                  <button
                    key={`recent-${color.id}`}
                    type="button"
                    onClick={() => handleColorSelect(color.id)}
                    title={`${color.name} (${color.code})`}
                    className={`flex items-center justify-center rounded-xl border p-2 transition ${
                      selected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-outline-variant/20 bg-surface-container-lowest hover:border-outline-variant/40"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: `rgb(${color.rgb.join(",")})` }}
                    />
                  </button>
                );
              })}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant">还没有最近使用颜色，先在下方选择一种颜色。</p>
        )}
      </div>
      <div className="mb-4 rounded-2xl border border-outline-variant/15 bg-surface-container-low p-3">
        <div className="mb-2 text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant">颜色大类</div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {availableGroups.map((group) => {
            const isActive = activeGroup === group;
            const count = groupedColors.get(group)?.length ?? 0;
            return (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-headline font-bold transition ${
                  isActive
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:border-outline-variant/50"
                }`}
              >
                {group}（{count}）
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid max-h-[56vh] gap-2 overflow-y-auto pr-1">
        {(groupedColors.get(activeGroup) ?? []).map((color) => renderColorButton(color))}
      </div>
    </aside>
  );
}
