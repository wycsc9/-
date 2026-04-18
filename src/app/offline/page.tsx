export default function OfflinePage() {
  return (
    <div className="rounded-[32px] bg-surface-container-low p-8">
      <p className="text-sm font-headline font-bold uppercase tracking-[0.24em] text-primary">关于 / 离线模式</p>
      <h1 className="mt-2 font-headline text-4xl font-extrabold text-on-surface">离线模式说明</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant">
        这个项目注册了基础离线缓存能力，会缓存首页、编辑器、图纸列表和应用配置。弱网或离线时，最近访问过的页面仍可打开，最近一次编辑的图纸也会从本地存储恢复。
      </p>
    </div>
  );
}
