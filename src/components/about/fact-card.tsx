import type { ReactNode } from "react";

export type FactCardTone = "plain" | "brand" | "sakura" | "warning" | "twilight";

/**
 * 色调系统（about.md §2.1，2026-09 走查修订：参考站点事实卡节奏）
 * 白卡为基底，brand 渐变 / sakura / warning / twilight 彩卡点缀（10–12% 透明度纪律）
 */
const TONES: Record<FactCardTone, { card: string; bar: string }> = {
  plain: { card: "border-border bg-surface", bar: "bg-accent/25" },
  brand: {
    card: "border-accent/25 from-accent/15 via-surface to-sakura/15 bg-gradient-to-br",
    bar: "bg-accent/30",
  },
  sakura: { card: "border-sakura/30 bg-sakura/10", bar: "bg-sakura/50" },
  warning: { card: "border-warning/40 bg-warning/12", bar: "bg-warning/60" },
  twilight: { card: "border-twilight/30 bg-twilight/12", bar: "bg-twilight/50" },
};

type FactCardProps = {
  /** mdi 图标类（icon-[mdi--…]），装饰性 */
  icon: string;
  /** 卡片小标签（uppercase 装饰行） */
  label: string;
  tone?: FactCardTone;
  /** 卡片级覆盖（跨列等一次性情态，由调用方传入） */
  className?: string;
  /** 主值（大号展示） */
  value: ReactNode;
  /** 说明（锚底排布，制造留白节奏） */
  description?: ReactNode;
};

/**
 * 事实卡（about.md §2.1，2026-09 走查修订）：标签 / 大号主值 / 装饰条 / 锚底说明
 * 非交互卡——无 hover 位移、无链接（说明内嵌链接除外）；图标 aria-hidden
 */
export function FactCard({ icon, label, tone = "plain", className, value, description }: FactCardProps) {
  const toneStyle = TONES[tone];
  return (
    <div
      className={`shadow-sm flex h-full min-h-40 flex-col rounded-md border p-5 md:p-6 ${toneStyle.card} ${className ?? ""}`}
    >
      <p className="text-text-muted flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase">
        <span className={`${icon} text-accent size-4`} aria-hidden />
        {label}
      </p>
      <div className="mt-3">{value}</div>
      <span className={`mt-3 block h-1 w-10 rounded-full ${toneStyle.bar}`} aria-hidden />
      {description ? (
        <div className="text-text-muted mt-auto pt-6 text-sm leading-relaxed">{description}</div>
      ) : null}
    </div>
  );
}
