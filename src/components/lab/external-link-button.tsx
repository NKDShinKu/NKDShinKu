"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ExternalLinkButtonProps = {
  href: string;
  /** 无障碍名称（如「NKDShinKu Blog GitHub 仓库」） */
  label: string;
  /** mdi 图标类（icon-[mdi--…]） */
  icon: string;
};

/**
 * 外链确认按钮（lab.md §2.1 修订：外链跳转需弹窗确认，D17）
 *
 * - 图标按钮唤起 Radix Dialog（无样式原语 + 设计 token 样式）
 *   ——焦点圈定 / Esc / 遮罩关闭 / 焦点归还由原语保证（REQ-G6）
 * - 确认后 window.open 新窗口打开（noopener noreferrer），不产生中间跳转页
 */
export function ExternalLinkButton({ href, label, icon }: ExternalLinkButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="text-text-muted hover:text-accent hover:bg-accent/10 focus-visible:outline-accent inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className={`${icon} size-4`} aria-hidden />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-bg/60 fixed inset-0 z-[60] backdrop-blur-sm" />
        <Dialog.Content className="border-border bg-surface shadow-lg fixed left-1/2 top-1/2 z-[60] w-[calc(100vw-48px)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6">
          <Dialog.Title className="font-display text-lg font-semibold">即将离开本站</Dialog.Title>
          <Dialog.Description className="text-text-muted mt-2 text-sm leading-relaxed">
            你即将访问外部链接：
            <span className="text-accent-dark font-mono mt-1.5 block break-all">
              {href}
            </span>
            外部站点内容与本站无关，将在新窗口打开。
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="ghost">取消</Button>
            </Dialog.Close>
            <Button
              onClick={() => {
                window.open(href, "_blank", "noopener,noreferrer");
                setOpen(false);
              }}
            >
              继续访问
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
