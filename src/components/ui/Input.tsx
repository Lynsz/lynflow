import type { InputHTMLAttributes } from "react"
import { cn } from "../../utils/cn"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={cn("ly-input rounded-2xl px-4 py-3", className)}
            {...props}
        />
    )
}