import type { ReactNode } from "react"

type EmptyStateProps = {
    icon?: ReactNode
    title: string
    description?: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
            {icon && (
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-[var(--muted)]">
                    {icon}
                </div>
            )}

            <h3 className="font-semibold">{title}</h3>

            {description && (
                <p className="ly-muted-soft mx-auto mt-2 max-w-md text-sm">
                    {description}
                </p>
            )}
        </div>
    )
}