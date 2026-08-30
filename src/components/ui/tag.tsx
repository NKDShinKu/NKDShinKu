import type { ComponentProps } from "react";

export type TagVariant = "accent" | "sakura" | "twilight";

const variantStyles: Record<TagVariant, string> = {
  accent: "bg-accent/10 text-accent-dark",
  // sakura / twilight 仅装饰语境（design-system.md §2.3）：作文字须配对图标，否则对比度不达标
  sakura: "bg-sakura/12 text-sakura",
  twilight: "bg-twilight/12 text-twilight",
};

export type TagProps = ComponentProps<"span"> & {
  variant?: TagVariant;
};

export function Tag({ variant = "accent", className, ...props }: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
