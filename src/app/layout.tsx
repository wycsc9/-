import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

import "./globals.css";

export const metadata: Metadata = {
  title: "拼豆像素工坊",
  description: "浏览器优先的拼豆图纸生成与编辑工具。"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-body">
        <ServiceWorkerRegister />
        <header className="fixed top-0 z-50 h-20 w-full border-b border-outline-variant/20 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-6 md:px-8">
            <Link href="/" className="font-headline text-2xl font-black tracking-tight text-primary">
              拼豆像素工坊
            </Link>
            <nav className="hidden items-center gap-8 font-headline text-sm font-bold tracking-tight text-on-surface-variant md:flex">
              <Link href="/" className="transition-colors hover:text-primary">
                首页
              </Link>
              <Link href="/editor" className="transition-colors hover:text-primary">
                图片转图纸
              </Link>
              <Link href="/patterns" className="transition-colors hover:text-primary">
                图纸库
              </Link>
              <Link href="/offline" className="transition-colors hover:text-primary">
                关于
              </Link>
            </nav>
            <button className="rounded-full bg-primary px-6 py-2.5 font-headline text-sm font-bold text-on-primary transition hover:bg-primary-dim active:scale-95">
              立即开始
            </button>
          </div>
        </header>
        <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col px-6 pt-28 md:px-8">
          <main className="flex-1">{children}</main>
          <footer className="mt-20 border-t border-outline-variant/20 py-12">
            <div className="flex flex-col items-center justify-between gap-6 text-sm text-on-surface-variant md:flex-row">
              <div className="flex flex-col items-center gap-1 md:items-start">
                <span className="font-headline text-xl font-black text-primary">拼豆像素工坊</span>
                <span>© 2026 拼豆像素工坊。用像素化创意点亮拼豆作品。</span>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <span className="transition-colors hover:text-primary">小红书</span>
                <span className="transition-colors hover:text-primary">抖音</span>
                <span className="transition-colors hover:text-primary">哔哩哔哩</span>
                <span className="transition-colors hover:text-primary">联系我们</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
