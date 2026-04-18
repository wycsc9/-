"use client";

import { useEffect, useState } from "react";

import { PaletteSidebar } from "@/components/PaletteSidebar";
import { CreatePatternPanel } from "@/components/CreatePatternPanel";
import { PatternCanvas } from "@/components/PatternCanvas";
import { StatusBar } from "@/components/StatusBar";
import { Toolbar } from "@/components/Toolbar";
import { UploadPanel } from "@/components/UploadPanel";
import {
  clearEditorStorage,
  loadDoneCellsFromStorage,
  loadPatternFromStorage,
  loadSettingsFromStorage,
  saveDoneCellsToStorage,
  savePatternToStorage,
  saveSettingsToStorage
} from "@/lib/localStorage";
import { usePatternStore } from "@/store/usePatternStore";

export default function EditorPage() {
  const pattern = usePatternStore((state) => state.pattern);
  const selectedColorId = usePatternStore((state) => state.selectedColorId);
  const showOnlySelectedColor = usePatternStore((state) => state.showOnlySelectedColor);
  const showOnlySelectedIncomplete = usePatternStore((state) => state.showOnlySelectedIncomplete);
  const showGridLines = usePatternStore((state) => state.showGridLines);
  const showCoordinates = usePatternStore((state) => state.showCoordinates);
  const zoom = usePatternStore((state) => state.zoom);
  const doneCells = usePatternStore((state) => state.doneCells);
  const setPattern = usePatternStore((state) => state.setPattern);
  const hydrateEditor = usePatternStore((state) => state.hydrateEditor);
  const [showConverterPanel, setShowConverterPanel] = useState(false);
  const [createMode, setCreateMode] = useState<"manual" | "photo">("photo");
  const [freshHandled, setFreshHandled] = useState(false);
  const [isFreshStart, setIsFreshStart] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setIsFreshStart(params.get("fresh") === "1");
  }, []);

  useEffect(() => {
    if (isFreshStart && !freshHandled) {
      clearEditorStorage();
      setPattern(null);
      hydrateEditor({}, []);
      setFreshHandled(true);
      return;
    }

    if (!pattern && !isFreshStart) {
      const storedPattern = loadPatternFromStorage();
      const storedSettings = loadSettingsFromStorage();
      const storedDoneCells = loadDoneCellsFromStorage();
      if (storedPattern) {
        setPattern(storedPattern);
      }
      if (storedSettings || storedDoneCells.length) {
        hydrateEditor(storedSettings ?? {}, storedDoneCells);
      }
    }
  }, [freshHandled, hydrateEditor, isFreshStart, pattern, setPattern]);

  useEffect(() => {
    savePatternToStorage(pattern);
  }, [pattern]);

  useEffect(() => {
    saveSettingsToStorage({
      selectedColorId,
      showOnlySelectedColor,
      showOnlySelectedIncomplete,
      showGridLines,
      showCoordinates,
      zoom
    });
  }, [selectedColorId, showCoordinates, showGridLines, showOnlySelectedColor, showOnlySelectedIncomplete, zoom]);

  useEffect(() => {
    saveDoneCellsToStorage(Array.from(doneCells));
  }, [doneCells]);

  useEffect(() => {
    if (pattern) {
      setShowConverterPanel(false);
    }
  }, [pattern]);

  if (!pattern) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="w-full max-w-2xl space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-container-low p-2">
            <button
              type="button"
              onClick={() => setCreateMode("manual")}
              className={`rounded-xl px-4 py-2 text-sm font-headline font-bold transition ${
                createMode === "manual" ? "bg-primary text-on-primary" : "text-on-surface"
              }`}
            >
              自己创建
            </button>
            <button
              type="button"
              onClick={() => setCreateMode("photo")}
              className={`rounded-xl px-4 py-2 text-sm font-headline font-bold transition ${
                createMode === "photo" ? "bg-primary text-on-primary" : "text-on-surface"
              }`}
            >
              照片转换
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowConverterPanel((prev) => !prev)}
            className="w-full rounded-full bg-primary px-6 py-4 font-headline text-base font-bold text-on-primary transition hover:bg-primary-dim active:scale-[0.99]"
          >
            {showConverterPanel ? "收起创建面板" : createMode === "manual" ? "创建空白图纸" : "上传图片"}
          </button>
          {showConverterPanel ? createMode === "manual" ? <CreatePatternPanel /> : <UploadPanel /> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <header>
        <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">
          将图片像素 <span className="text-primary">转换为拼豆图纸。</span>
        </h1>
        <p className="mt-3 max-w-3xl text-on-surface-variant">
          上传照片后在这里完成调参、上色与导出。所有编辑都在本地浏览器中完成。
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <Toolbar />
          <PatternCanvas />
          <StatusBar />
        </div>
        <div className="space-y-5 lg:col-span-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-container-low p-2">
            <button
              type="button"
              onClick={() => setCreateMode("manual")}
              className={`rounded-xl px-4 py-2 text-sm font-headline font-bold transition ${
                createMode === "manual" ? "bg-primary text-on-primary" : "text-on-surface"
              }`}
            >
              自己创建
            </button>
            <button
              type="button"
              onClick={() => setCreateMode("photo")}
              className={`rounded-xl px-4 py-2 text-sm font-headline font-bold transition ${
                createMode === "photo" ? "bg-primary text-on-primary" : "text-on-surface"
              }`}
            >
              照片转换
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowConverterPanel((prev) => !prev)}
            className="w-full rounded-full border border-outline-variant/30 bg-surface-container-low px-5 py-3 text-left font-headline text-sm font-bold text-on-surface transition hover:border-primary/40 hover:text-primary"
          >
            {showConverterPanel ? "收起创建设置" : createMode === "manual" ? "展开手动创建设置" : "展开图片转换设置"}
          </button>
          {showConverterPanel ? createMode === "manual" ? <CreatePatternPanel /> : <UploadPanel /> : null}
          <PaletteSidebar />
        </div>
      </div>
    </div>
  );
}
