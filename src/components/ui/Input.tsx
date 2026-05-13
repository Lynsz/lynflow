import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "../../utils/cn"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
    function Input({ className, ...props }, ref) {
        return (
            <input
                ref={ref}
                className={cn("ly-input rounded-2xl px-4 py-3", className)}
                {...props}
            />
        )
    }
)