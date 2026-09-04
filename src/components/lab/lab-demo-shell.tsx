import type { ReactNode } from "react";

/**
 * demo 挂载壳（lab.md §2.5）：统一卡片框 + 无 JS 降级提示
 *
 * 壳保持服务端组件（纯布局）；交互边界下沉到 demo 叶子客户端组件——
 * 无 JS 时 demo 的静态首帧照常预渲染，noscript 给出可用性提示（REQ-G6 渐进增强）。
 */
export function LabDemoShell({ children }: { children: ReactNode }) {
  return (
    <section aria-label="在线演示" className="rounded-lg border border-border bg-surface p-4 md:p-6">
      <noscript>
        <p className="text-text-muted mb-4 text-sm">此实验需要启用 JavaScript 才能交互。</p>
      </noscript>
      <div className="flex min-h-[400px] items-center justify-center">{children}</div>
    </section>
  );
}
