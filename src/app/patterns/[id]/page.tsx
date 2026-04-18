"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PatternPreview } from "@/components/PatternPreview";
import { usePatternStore } from "@/store/usePatternStore";
import { PatternData } from "@/types/pattern";

export default function PatternDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const setPattern = usePatternStore((state) => state.setPattern);
  const [pattern, setLocalPattern] = useState<PatternData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/patterns/${params.id}.json`);
        if (!response.ok) {
          throw new Error("图纸不存在");
        }
        const data = (await response.json()) as PatternData;
        setLocalPattern(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "加载失败");
      }
    };

    load();
  }, [params.id]);

  if (error) {
    return (
      <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  if (!pattern) {
    return <div className="rounded-[32px] border border-outline-variant/20 bg-surface-container-low p-8 text-on-surface-variant">正在加载图纸...</div>;
  }

  const usageList = pattern.palette
    .filter((color) => color.id !== "empty" && (pattern.usage[color.id] ?? 0) > 0)
    .sort((a, b) => (pattern.usage[b.id] ?? 0) - (pattern.usage[a.id] ?? 0));

  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <p className="text-xs font-headline font-bold uppercase tracking-widest text-primary">图纸 / 详情</p>
        <h1 className="font-headline text-5xl font-black tracking-tight text-on-surface">
          {pattern.title} <span className="text-primary">.</span>
        </h1>
        <p className="max-w-3xl text-on-surface-variant">
          尺寸 {pattern.width} x {pattern.height}，共 {usageList.length} 种颜色，可直接下载并进入编辑器。
        </p>
      </header>
      <div className="grid gap-8 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="rounded-3xl border border-outline-variant/15 bg-surface-container-low p-5">
            <PatternPreview pattern={pattern} className="aspect-square w-full bg-surface-container-lowest" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-surface-container-lowest p-4">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">总拼豆数</span>
              <p className="font-headline text-2xl font-black">{Object.values(pattern.usage).reduce((a, b) => a + b, 0)}</p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-4">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">难度</span>
              <p className="font-headline text-2xl font-black text-tertiary">中等</p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-4">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">预计耗时</span>
              <p className="font-headline text-2xl font-black text-secondary">{Math.max(1, Math.round(pattern.width * pattern.height / 800))} 小时</p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-4">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">底板数量</span>
              <p className="font-headline text-2xl font-black">{Math.max(1, Math.ceil(pattern.width / 29))} x {Math.max(1, Math.ceil(pattern.height / 29))}</p>
            </div>
          </div>
        </div>
        <aside className="rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-6 xl:sticky xl:top-24 xl:col-span-4 xl:h-fit">
          <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface">颜色清单</h2>
          <div className="mt-5 space-y-3">
            {usageList.map((color) => (
              <div key={color.id} className="flex items-center justify-between rounded-2xl bg-surface-container-low p-3">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: `rgb(${color.rgb.join(",")})` }} />
                  <div>
                    <p className="text-sm font-semibold">{color.name}</p>
                    <p className="text-xs text-on-surface-variant">{color.code}</p>
                  </div>
                </div>
                <span className="font-headline text-lg font-black">{pattern.usage[color.id] ?? 0}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPattern(pattern);
                router.push("/editor");
              }}
              className="rounded-full bg-primary px-5 py-3 text-sm font-headline font-bold text-on-primary"
            >
              在编辑器中打开
            </button>
            <Link href="/patterns" className="rounded-full border border-outline-variant/30 px-5 py-3 text-sm font-headline font-bold">
              返回列表
            </Link>
          </div>
        </aside>
      </div>
      <section className="rounded-3xl bg-tertiary-container p-8">
        <h3 className="font-headline text-3xl font-black text-on-tertiary-container">社区作品</h3>
        <p className="mt-2 text-on-tertiary-container/80">分享你的成品图，展示你的拼豆灵感。</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="aspect-square rounded-2xl bg-white/35" />
          <div className="aspect-square rounded-2xl bg-white/35 md:translate-y-4" />
          <div className="aspect-square rounded-2xl bg-white/35" />
        </div>
      </section>
    </div>
  );
}
