import type { ReactNode } from "react"
import { Link, type LinkProps } from "react-router-dom"
import { cn } from "../../utils/cn"

type LinkButtonVariant = "primary" | "secondary" | "ghost"
type LinkButtonSize = "sm" | "md" | "lg"

type LinkButtonProps = LinkProps & {
    variant?: LinkButtonVariant
    size?: LinkButtonSize
    icon?: ReactNode
}

const variantClasses: Record<LinkButtonVariant, string> = {
    primary: "ly-button-primary",
    secondary: "ly-button-secondary",
    ghost:
        "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
}

const sizeClasses: Record<LinkButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
}

export function LinkButton({
    children,
    variant = "primary",
    size = "md",
    icon,
    className,
    ...props
}: LinkButtonProps) {
    return (
        <Link
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[0.98]",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {children}
            {icon}
        </Link>
    )
}