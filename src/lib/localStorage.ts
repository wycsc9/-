import { EditorSettings, PatternData } from "@/types/pattern";

const PATTERN_KEY = "pingdou:pattern";
const SETTINGS_KEY = "pingdou:settings";
const DONE_KEY = "pingdou:done-cells";

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const savePatternToStorage = (pattern: PatternData | null) => {
  if (!canUseStorage()) {
    return;
  }

  if (!pattern) {
    window.localStorage.removeItem(PATTERN_KEY);
    return;
  }

  window.localStorage.setItem(PATTERN_KEY, JSON.stringify(pattern));
};

export const loadPatternFromStorage = () => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(PATTERN_KEY);
  return raw ? (JSON.parse(raw) as PatternData) : null;
};

export const saveSettingsToStorage = (settings: EditorSettings) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadSettingsFromStorage = () => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(SETTINGS_KEY);
  return raw ? (JSON.parse(raw) as EditorSettings) : null;
};

export const saveDoneCellsToStorage = (keys: string[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(DONE_KEY, JSON.stringify(keys));
};

export const loadDoneCellsFromStorage = () => {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(DONE_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
};

export const clearEditorStorage = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(PATTERN_KEY);
  window.localStorage.removeItem(SETTINGS_KEY);
  window.localStorage.removeItem(DONE_KEY);
};
