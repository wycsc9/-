import { PatternCard } from "@/components/PatternCard";
import { SAMPLE_PATTERN_SUMMARIES } from "@/lib/samplePatterns";

export default function PatternsPage() {
  return (
    <div className="space-y-10 pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-headline font-bold uppercase tracking-[0.24em] text-primary">图纸库</p>
          <h1 className="mt-2 font-headline text-5xl font-extrabold tracking-tight text-on-surface">预置图纸</h1>
          <p className="mt-2 max-w-2xl text-on-surface-variant">浏览示例图纸并直接进入编辑器，快速体验完整制作流程。</p>
        </div>
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="搜索图纸..."
            className="h-14 w-full rounded-xl bg-surface-container-lowest px-5 text-sm shadow-sm outline-none ring-primary/40 focus:ring-2"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6 rounded-2xl bg-surface-container-low p-5">
          <h3 className="text-sm font-headline font-extrabold uppercase tracking-widest text-primary">分类</h3>
          <div className="space-y-2 text-sm text-on-surface">
            <label className="flex items-center gap-3"><input type="checkbox" defaultChecked /> 自然植物</label>
            <label className="flex items-center gap-3"><input type="checkbox" /> 流行文化</label>
            <label className="flex items-center gap-3"><input type="checkbox" /> 几何抽象</label>
            <label className="flex items-center gap-3"><input type="checkbox" /> 动物角色</label>
          </div>
          <h3 className="pt-2 text-sm font-headline font-extrabold uppercase tracking-widest text-primary">颜色数量</h3>
          <input type="range" min={1} max={50} defaultValue={12} className="w-full accent-primary" />
        </aside>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SAMPLE_PATTERN_SUMMARIES.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
    </div>
  );
}
