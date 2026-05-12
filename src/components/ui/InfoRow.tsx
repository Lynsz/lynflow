import type { ReactNode } from "react"
import { cn } from "../../utils/cn"

type InfoRowProps = {
    label: string
    value: ReactNode
    bordered?: boolean
}

export function InfoRow({ label, value, bordered = true }: InfoRowProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between gap-4 text-sm",
                bordered && "border-b border-[var(--border)] pb-3"
            )}
        >
            <span className="ly-muted-soft">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    )
}