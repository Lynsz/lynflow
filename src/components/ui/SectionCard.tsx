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
        <section className={cn("ly-card rounded-3xl p-5", className)}>
            {(title || description || action) && (
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        {title && (
                            <h2 className="text-xl font-semibold">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="ly-muted-soft mt-1 text-sm">
                                {description}
                            </p>
                        )}
                    </div>

                    {action && <div>{action}</div>}
                </div>
            )}

            {children}
        </section>
    )
}