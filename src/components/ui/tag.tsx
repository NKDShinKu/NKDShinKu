import type { ComponentProps } from "react";

export type TagVariant = "accent" | "sakura" | "twilight";

const variantStyles: Record<TagVariant, string> = {
  accent: "bg-accent/10 text-accent-dark",
  // sakura / twilight 彩色小字在浅色底用深变体（4.5:1 纪律），暗色底原值已达标
  // （设计系统 §1.1：作文字须配对图标或深变体；阶段 4 对比度走查实测补 tokens）
  sakura: "bg-sakura/12 text-sakura-dark dark:text-sakura",
  twilight: "bg-twilight/12 text-twilight-dark dark:text-twilight",
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
