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
            className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
            <div>
                {eyebrow && (
                    <p className="ly-muted-soft text-sm">
                        {eyebrow}
                    </p>
                )}

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {title}
                </h1>

                {description && (
                    <p className="ly-muted mt-2">
                        {description}
                    </p>
                )}
            </div>

            {action && <div>{action}</div>}
        </motion.header>
    )
}