import type { ComponentProps } from "react";

type PlaceholderCardProps = ComponentProps<"div"> & {
  icon: string;
  name: string;
};

/**
 * 占位子类卡（acg.md §2.3）：游戏/音乐/小说等未开工子类的「策划中」小卡
 * 非交互（无 hover/链接）；策划中徽章遵循配对纪律：warning 色圆点 + muted 文字
 */
export function PlaceholderCard({ icon, name, className, ...props }: PlaceholderCardProps) {
  return (
    <div
      className={`border-border bg-surface flex flex-col items-center gap-2 rounded-md border p-5 text-center ${className ?? ""}`}
      {...props}
    >
      <span className={`${icon} text-accent size-7`} aria-hidden />
      <p className="text-text text-sm font-medium">{name}</p>
      <span className="bg-warning/12 text-text-muted inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs">
        <span className="bg-warning size-1.5 rounded-full" aria-hidden />
        策划中
      </span>
    </div>
  );
}
