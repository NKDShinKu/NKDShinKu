import type { ComponentProps } from "react";

export type CardVariant = "glass" | "surface";

const variantStyles: Record<CardVariant, string> = {
  // 玻璃态规范值见 design-system.md §1.6（blur 16px，允许范围 12–20px）
  glass: "border-glass-border bg-glass shadow-md backdrop-blur-[16px]",
  surface: "border-border bg-surface",
};

const interactiveStyles: Record<CardVariant, string> = {
  glass:
    "transition-[translate,box-shadow] duration-200 ease-base hover:-translate-y-1 hover:shadow-lg-glow",
  surface:
    "transition-[translate,box-shadow] duration-200 ease-base hover:-translate-y-[3px] hover:shadow-lg",
};

export type CardProps = ComponentProps<"div"> & {
  variant?: CardVariant;
  /** 可交互（hover 抬升 + 阴影增强），纯展示卡不开启 */
  interactive?: boolean;
  /** 内边距覆盖（默认 p-6；Tailwind 同属性类并存时生效顺序不可控，须经由此 prop 覆盖） */
  padding?: string;
};

export function Card({
  variant = "surface",
  interactive = false,
  padding = "p-6",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-md border",
        padding,
        variantStyles[variant],
        interactive ? interactiveStyles[variant] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
