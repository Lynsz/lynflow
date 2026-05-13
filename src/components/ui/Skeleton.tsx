import { cn } from "../../utils/cn"

type SkeletonProps = {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
                className
            )}
        />
    )
}