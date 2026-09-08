"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AdjacentPostCard } from "@/components/posts/adjacent-post-card";
import { AuthorCard } from "@/components/posts/author-card";
import type { Heading } from "@/lib/markdown";
import { TableOfContents } from "@/components/posts/table-of-contents";

type PostPanelProps = {
  headings: Heading[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

/**
 * 文章页右栏面板（用户需求，参考成熟博客）：xl 桌面为常驻侧栏（页面直渲染 aside），
 * xl 以下由本组件提供「三横线」浮动按钮唤出右侧抽屉——作者卡与目录在上，
 * 上下篇（stacked 形态：标题单行直显，触屏无 hover）沉底、上方横线装饰。
 * 目录点击跳转后抽屉自动关闭（内容让位正文）；上下篇走 router.replace 换页，
 * 路由变化即卸载本组件，无需额外处理。
 */
export function PostPanelDrawer({ headings, prev, next }: PostPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="打开文章面板"
          className="border-border bg-surface/80 text-text focus-visible:outline-accent hover:border-accent hover:text-accent fixed right-5 bottom-[5.25rem] z-40 grid size-12 cursor-pointer place-items-center rounded-full border shadow-md backdrop-blur-sm transition-[border-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 xl:hidden"
        >
          <span className="icon-[mdi--menu] size-5" aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-bg/60 fixed inset-0 z-[60] backdrop-blur-sm" />
        <Dialog.Content
          aria-label="文章面板"
          className="border-border bg-surface fixed inset-y-0 right-0 z-[60] flex w-[calc(100vw-64px)] max-w-[340px] flex-col overflow-y-auto border-l p-5 shadow-lg"
        >
          <Dialog.Title className="sr-only">文章面板</Dialog.Title>
          <Dialog.Description className="sr-only">
            作者信息、上一篇下一篇与目录。
          </Dialog.Description>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="关闭文章面板"
              className="focus-visible:outline-accent text-text-muted hover:text-accent ease-fast absolute top-4 right-4 grid size-11 cursor-pointer place-items-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="icon-[mdi--close] size-5" aria-hidden />
            </button>
          </Dialog.Close>

          {/* 三段式（与桌面右栏同构）：作者卡钉顶、目录中段内滚（min-h-32 防极端
              矮视口塌缩，超出则 Content 兜底滚动）、上下篇钉底 */}
          <div className="mt-10 flex min-h-0 flex-1 flex-col">
            <AuthorCard />
            {/* 捕获目录点击：滚动锚定后关闭抽屉让位正文 */}
            <div
              className="mt-5 flex min-h-32 flex-1 flex-col"
              onClickCapture={(event) => {
                if (event.target instanceof HTMLAnchorElement) setOpen(false);
              }}
            >
              {headings.length > 0 ? <TableOfContents headings={headings} /> : null}
            </div>

            {/* 上下篇钉底：横线装饰 + 纵向两条（标题直显） */}
            <nav
              aria-label="文章导航"
              className="border-border mt-4 flex shrink-0 flex-col gap-2 border-t pt-4"
            >
              <AdjacentPostCard label="上一篇" post={prev} variant="stacked" />
              <AdjacentPostCard label="下一篇" post={next} variant="stacked" />
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
