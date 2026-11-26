import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant?: "primary" | "dark" | "ghost";
  size?: "md" | "lg";
  href?: string;
  className?: string;
  children: ReactNode;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-display uppercase tracking-wide whitespace-nowrap select-none transition duration-200 ease-out active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover hover:shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-accent)_22%,transparent)]",
  dark: "bg-raised text-fg border border-line hover:border-highlight hover:text-highlight",
  ghost: "text-fg border border-line hover:border-fg",
} as const;

const sizes = {
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        onClick={rest.onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
