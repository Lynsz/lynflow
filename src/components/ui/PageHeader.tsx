import type { ReactNode } from "react"
import { motion } from "framer-motion"

type PageHeaderProps = {
    eyebrow?: string
    title: string
    description?: string
    action?: ReactNode
}

export function PageHeader({
    eyebrow,
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col gap-4 md:mb-8 lg:flex-row lg:items-center lg:justify-between"
        >
            <div className="min-w-0">
                {eyebrow && (
                    <p className="ly-muted-soft text-xs uppercase tracking-[0.22em] sm:text-sm sm:normal-case sm:tracking-normal">
                        {eyebrow}
                    </p>
                )}

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                    {title}
                </h1>

                {description && (
                    <p className="ly-muted mt-2 max-w-3xl text-sm leading-6 sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                    {action}
                </div>
            )}
        </motion.header>
    )
}