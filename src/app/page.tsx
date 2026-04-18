import Link from "next/link";

export default function HomePage() {
  return (
    <div className="pb-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-surface px-4 py-12 md:px-8 md:py-16">
        <div className="absolute -left-10 bottom-10 h-64 w-64 rounded-full bg-tertiary/10 blur-[100px]" />
        <div className="absolute -right-8 top-8 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-5 inline-flex rounded-full bg-tertiary-container px-4 py-1.5 font-headline text-xs font-bold uppercase tracking-widest text-on-tertiary-container">
              拼豆创作工作台
            </span>
            <h1 className="font-headline text-5xl font-extrabold leading-[1.05] tracking-tight text-on-surface md:text-7xl">
              用 <span className="italic text-primary">拼豆像素</span> 还原你的每一张灵感图。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              把数字图像快速转换成可制作的拼豆图纸，并在浏览器里直接完成编辑、统计与导出。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/editor?fresh=1"
                className="rounded-full bg-primary px-8 py-4 font-headline text-base font-extrabold text-on-primary shadow-panel transition hover:-translate-y-0.5 hover:bg-primary-dim active:scale-95"
              >
                开始制作图纸
              </Link>
              <Link
                href="/patterns"
                className="rounded-full bg-surface-container-highest px-8 py-4 font-headline text-base font-extrabold text-on-surface transition hover:bg-surface-container-high active:scale-95"
              >
                浏览图纸库
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-secondary/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-panel">
              <div className="bead-grid aspect-square p-8">
                <div className="grid h-full w-full grid-cols-12 gap-1">
                  {Array.from({ length: 144 }).map((_, index) => (
                    <span
                      key={index}
                      className="rounded-full shadow-inner"
                      style={{
                        background:
                          index % 5 === 0
                            ? "#b60d3d"
                            : index % 5 === 1
                              ? "#006479"
                              : index % 5 === 2
                                ? "#fdd404"
                                : index % 5 === 3
                                  ? "#ff7386"
                                  : "#77dfff"
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/70 p-4 backdrop-blur-md">
                <p className="font-headline text-base font-bold text-on-surface">“霓虹像素狐”</p>
                <p className="text-sm text-on-surface-variant">示例图纸 · 2,304 颗拼豆</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
