import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "md" | "lg";

const baseStyles =
  "inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-[background-color,box-shadow,translate,scale] duration-150 ease-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent font-semibold text-white hover:-translate-y-px hover:bg-accent-dark active:scale-[0.97]",
  ghost: "border border-border bg-transparent text-text hover:border-accent hover:text-accent",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "rounded-md px-6 py-2.5",
  lg: "rounded-lg px-8 py-3.5 text-lg",
};

/** 供 <a> / <Link> 等非 button 元素复用按钮样式的类名组装器 */
export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`;
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[buttonStyles(variant, size), className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
