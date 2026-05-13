import type { ReactNode } from "react"
import { cn } from "../../utils/cn"

type SectionCardProps = {
    title?: string
    description?: string
    action?: ReactNode
    children: ReactNode
    className?: string
}

export function SectionCard({
    title,
    description,
    action,
    children,
    className,
}: SectionCardProps) {
    return (
        <section className={cn("ly-card rounded-3xl p-4 sm:p-5", className)}>
            {(title || description || action) && (
                <div className="mb-5 flex flex-col gap-3 md:mb-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-lg font-semibold sm:text-xl">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="ly-muted-soft mt-1 max-w-2xl text-sm leading-6">
                                {description}
                            </p>
                        )}
                    </div>

                    {action && (
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {action}
                        </div>
                    )}
                </div>
            )}

            {children}
        </section>
    )
}