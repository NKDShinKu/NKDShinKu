"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { themeStorageKey, type ThemeChoice } from "@/lib/theme";

const THEME_EVENT = "themechange";

const stateMeta: Record<ThemeChoice, { icon: string; label: string; next: string }> = {
  system: { icon: "icon-[mdi--monitor]", label: "跟随系统", next: "亮色" },
  light: { icon: "icon-[mdi--white-balance-sunny]", label: "亮色", next: "暗色" },
  dark: { icon: "icon-[mdi--weather-night]", label: "暗色", next: "跟随系统" },
};

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

function subscribe(callback: () => void) {
  // 同 tab 写入 localStorage 不触发 storage 事件，用自定义事件通知
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ThemeChoice {
  try {
    const stored = localStorage.getItem(themeStorageKey);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "system";
}

function getServerSnapshot(): ThemeChoice {
  return "system";
}

/** 主题切换器（REQ-G2）：跟随系统 → 亮 → 暗三态循环，选择持久化 */
export function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // system 模式下跟随系统实时切换
  useEffect(() => {
    if (choice !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => applyTheme(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [choice]);

  const cycle = useCallback(() => {
    const current = getSnapshot();
    const next: ThemeChoice =
      current === "system" ? "light" : current === "light" ? "dark" : "system";
    try {
      if (next === "system") localStorage.removeItem(themeStorageKey);
      else localStorage.setItem(themeStorageKey, next);
    } catch {
      // localStorage 不可用（隐私模式等）时静默降级，本次会话内切换仍生效
    }
    applyTheme(
      next === "dark" ||
        (next === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const meta = stateMeta[choice];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`当前${meta.label}，切换到${meta.next}`}
      className="text-text-muted hover:text-accent focus-visible:outline-accent ease-fast flex size-11 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className={`${meta.icon} size-5`} aria-hidden />
    </button>
  );
}
