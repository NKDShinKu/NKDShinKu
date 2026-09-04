import Link from "next/link";
import { LabStatusBadge, LabTypeBadge } from "@/components/lab/lab-badges";
import { ExternalLinkButton } from "@/components/lab/external-link-button";
import { Card } from "@/components/ui/card";
import type { LabItem } from "@/lib/lab";

/** 链接图标推断：仓库链接显示 GitHub 图标，其余按语义（用户决策：仓库按钮显仓库图标即可） */
function linkIcon(label: string, href: string): string {
  if (/github/i.test(label) || /github\.com/i.test(href)) return "icon-[mdi--github]";
  if (/视频|video/i.test(label)) return "icon-[mdi--play-circle-outline]";
  return "icon-[mdi--open-in-new]";
}

type LabCardProps = {
  item: LabItem;
  /** 栅格类由调用方控制；同组卡片尺寸一致（不跨列） */
  className?: string;
};

/**
 * 实验室条目卡（lab.md §2.1，2026-09 走查修订：紧凑等大）
 *
 * - 紧凑形态：徽章行 / 名称 / 一句话简介 / 底部 tech 行 + 链接按钮；无封面占位区
 * - 链接为显式图标按钮（非整卡链接）：外链经确认弹窗新窗口打开（D17），
 *   站内型为普通 Link 本窗跳转 /lab/[slug]；同组卡片尺寸一致
 * - featured 只影响排序（组内第一）+「精选」徽章标记，不改变卡片尺寸
 */
export function LabCard({ item, className }: LabCardProps) {
  const isExternal = item.kind === "external";

  return (
    <Card
      variant="surface"
      padding="p-4 md:p-5"
      className={`group border-border/70 hover:border-accent/40 h-full transition-colors duration-200 ease-base ${className ?? ""}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <LabTypeBadge type={item.type} />
          <LabStatusBadge status={item.status} />
          {item.featured ? (
            <span className="bg-accent ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white">
              <span className="icon-[mdi--star-outline] size-3.5" aria-hidden />
              精选
            </span>
          ) : null}
        </div>

        <h2 className="mt-2.5 text-base font-semibold md:text-lg">{item.name}</h2>
        <p className="text-text-muted mt-1 line-clamp-2 text-sm leading-relaxed">{item.tagline}</p>

        <div className="mt-auto flex items-center gap-1 border-t border-border/60 pt-3">
          <ul className="text-text-muted flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs" aria-label="技术栈">
            {item.tech.map((tech, index) => (
              <li key={tech} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden>·</span> : null}
                {tech}
              </li>
            ))}
          </ul>

          <div className="ml-auto flex shrink-0 items-center gap-0.5">
            {isExternal
              ? item.links.map((link) => (
                  <ExternalLinkButton
                    key={link.href}
                    href={link.href}
                    label={`${item.name} ${link.label}`}
                    icon={linkIcon(link.label, link.href)}
                  />
                ))
              : (
                  <Link
                    href={`/lab/${item.slug}/`}
                    aria-label={`打开 ${item.name}`}
                    className="text-text-muted hover:text-accent hover:bg-accent/10 focus-visible:outline-accent inline-flex size-11 items-center justify-center rounded-full transition-colors duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span className="icon-[mdi--arrow-right] size-4" aria-hidden />
                  </Link>
                )}
          </div>
        </div>
      </div>
    </Card>
  );
}
