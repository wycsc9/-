"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { imageToPattern } from "@/lib/imageToPattern";
import { usePatternStore } from "@/store/usePatternStore";
import { BeadPaletteSource, PixelationMode } from "@/types/pattern";

const widthOptions = [16, 32, 48, 64, 80, 96, 128];
const colorOptions = [8, 12, 16, 24, 32, 48, 64, 96, 128];
const paletteOptions: Array<{ value: BeadPaletteSource; label: string }> = [
  { value: "default", label: "内置基础色库" },
  { value: "MARD", label: "MARD 全色库" },
  { value: "COCO", label: "COCO 全色库" },
  { value: "漫漫", label: "漫漫 全色库" },
  { value: "盼盼", label: "盼盼 全色库" },
  { value: "咪小窝", label: "咪小窝 全色库" }
];
const modeOptions: Array<{ value: PixelationMode; label: string }> = [
  { value: "average", label: "平均色" },
  { value: "dominant", label: "主色" }
];

export function UploadPanel() {
  const router = useRouter();
  const setPattern = usePatternStore((state) => state.setPattern);
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(32);
  const [height, setHeight] = useState<string>("");
  const [maxColors, setMaxColors] = useState(16);
  const [paletteSource, setPaletteSource] = useState<BeadPaletteSource>("MARD");
  const [pixelationMode, setPixelationMode] = useState<PixelationMode>("average");
  const [similarityThreshold, setSimilarityThreshold] = useState(18);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) {
      setError("请先选择图片。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pattern = await imageToPattern({
        file,
        width,
        height: height ? Number(height) : undefined,
        maxColors,
        title: title || file.name.replace(/\.[^.]+$/, ""),
        paletteSource,
        pixelationMode,
        similarityThreshold
      });
      setPattern(pattern);
      router.push("/editor");
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : "转换失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/20 bg-surface-container-lowest/85 p-6 shadow-panel backdrop-blur-md">
      <div className="mb-6">
        <p className="mb-2 text-xs font-headline font-bold uppercase tracking-[0.2em] text-primary">图片转图纸</p>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">本地转换，不上传服务器</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">图片文件</span>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">图纸标题</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：猫猫头像"
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">目标宽度</span>
          <select
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          >
            {widthOptions.map((option) => (
              <option key={option} value={option}>
                {option} 格宽
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">目标高度</span>
          <input
            type="number"
            min={1}
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="留空则按原图比例"
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">最大颜色数</span>
          <select
            value={maxColors}
            onChange={(event) => setMaxColors(Number(event.target.value))}
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          >
            {colorOptions.map((option) => (
              <option key={option} value={option}>
                {option} 色
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
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

        <label className="space-y-2">
          <span className="text-sm font-semibold text-on-surface">取样模式</span>
          <select
            value={pixelationMode}
            onChange={(event) => setPixelationMode(event.target.value as PixelationMode)}
            className="block w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-sm"
          >
            {modeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="flex items-center justify-between text-sm font-semibold text-on-surface">
            <span>颜色合并阈值</span>
            <span className="text-xs text-on-surface-variant">{similarityThreshold}</span>
          </span>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={similarityThreshold}
            onChange={(event) => setSimilarityThreshold(Number(event.target.value))}
            className="block w-full accent-primary"
          />
          <p className="text-xs text-on-surface-variant">越高越会把相近颜色合并成大色块，0 表示不合并。</p>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleConvert}
          disabled={loading}
          className="rounded-full bg-primary px-5 py-3 text-sm font-headline font-bold text-on-primary transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "正在转换..." : "开始转换"}
        </button>
        <span className="text-sm text-on-surface-variant">支持 PNG / JPG / JPEG / WEBP，最大 10MB，可选更大尺寸和多品牌色号。</span>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
