"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Giscus from "@giscus/react";
import { siteConfig } from "@/lib/site.config";

/**
 * 文章评论区（REQ-P10 / D19）：giscus + GitHub Discussions，抽屉式折叠形态（D9 采纳）。
 * - 折叠态仅一行玻璃卡头，展开才渲染 giscus iframe（评论 iframe 不进首屏）
 * - 主题跟随站点亮暗：useSyncExternalStore 订阅 html.dark（与 ThemeToggle 同模式）
 * - enabled 开关见 site.config.comments；关闭时页面侧不挂载本组件
 */

/** html.dark 变化时通知订阅者（ThemeToggle 切换时 dispatch，见 theme-toggle.tsx） */
function subscribeTheme(callback: () => void) {
  window.addEventListener("themechange", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("themechange", callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * 快照：当前是否暗色。判据只看 `html.dark`——它是主题的唯一事实来源（ThemeToggle 三态都
 * 落到这个 class），不能再叠加 matchMedia：用户「系统暗色 + 手动选亮色」时后者会把站点
 * 亮色下的评论 iframe 渲染成暗色（走查修正）。
 */
function getDarkSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getDarkServerSnapshot(): boolean {
  return false;
}

/** 浮动评论按钮广播的「滚动到评论区」事件名（PostComments 监听并自动展开） */
export const COMMENTS_FOCUS_EVENT = "comments:focus";

export function PostComments() {
  const { repo, repoId, category, categoryId, mapping } = siteConfig.comments;
  const [open, setOpen] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, getDarkSnapshot, getDarkServerSnapshot);

  // 浮动按钮滚动到位后自动展开（评论区已在视口时立即展开）
  useEffect(() => {
    const onFocus = () => setOpen(true);
    window.addEventListener(COMMENTS_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(COMMENTS_FOCUS_EVENT, onFocus);
  }, []);

  return (
    <section aria-label="评论区" id="comments" className="mt-10 scroll-mt-24">
      <div className="border-glass-border bg-glass rounded-md border shadow-md backdrop-blur-[16px]">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="post-comments-panel"
          className="focus-visible:outline-accent ease-fast flex w-full items-center gap-3 rounded-md px-5 py-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2"
        >
          <span className="icon-[mdi--comment-text-outline] text-accent size-5" aria-hidden />
          <span className="font-medium">评论</span>
          <span
            className={`icon-[mdi--chevron-down] text-text-muted ease-base ml-auto size-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {open ? (
          <div id="post-comments-panel" className="border-glass-border border-t px-5 pt-4 pb-5">
            <Giscus
              repo={repo}
              repoId={repoId}
              category={category}
              categoryId={categoryId}
              mapping={mapping}
              strict="0"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={dark ? "dark" : "light"}
              lang="zh-CN"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
