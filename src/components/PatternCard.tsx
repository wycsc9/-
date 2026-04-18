import Link from "next/link";

import { PatternPreview } from "@/components/PatternPreview";
import { PatternSummary } from "@/types/pattern";

type PatternCardProps = {
  pattern: PatternSummary;
};

export function PatternCard({ pattern }: PatternCardProps) {
  return (
    <Link
      href={`/patterns/${pattern.id}`}
      className="group flex flex-col gap-4 overflow-hidden rounded-3xl bg-surface-container-lowest p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
    >
      <PatternPreview previewDataUrl={pattern.previewDataUrl} title={pattern.title} className="h-48 w-full" />
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-headline text-xl font-extrabold tracking-tight text-on-surface">{pattern.title}</h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {pattern.width} x {pattern.height}
          </span>
        </div>
        {pattern.description ? <p className="text-sm text-on-surface-variant">{pattern.description}</p> : null}
        <span className="text-sm font-headline font-bold text-primary">打开图纸</span>
      </div>
    </Link>
  );
}
