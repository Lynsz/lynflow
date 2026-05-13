import type { ReactNode } from "react"
import { motion } from "framer-motion"

type MetricCardProps = {
    title: string
    value: string | number
    description: string
    icon: ReactNode
    delay?: number
}

export function MetricCard({
    title,
    value,
    description,
    icon,
    delay = 0,
}: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="ly-card flex min-h-32 flex-col justify-between rounded-3xl p-4 shadow-2xl shadow-black/10 sm:p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <p className="ly-muted min-w-0 text-sm">{title}</p>

                <div className="shrink-0">{icon}</div>
            </div>

            <div>
                <h2 className="mt-4 break-words text-2xl font-bold sm:text-3xl">
                    {value}
                </h2>

                <p className="ly-muted-soft mt-2 text-xs leading-5">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}