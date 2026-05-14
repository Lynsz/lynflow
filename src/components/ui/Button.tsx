import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "../../utils/cn"

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"
type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "ly-button-primary",
    secondary: "ly-button-secondary",
    danger:
        "border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20",
    ghost:
        "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            icon,
            className,
            type = "button",
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                type={type}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-60",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {icon && <span aria-hidden="true">{icon}</span>}
                {children}
            </button>
        )
    }
)

Button.displayName = "Button"