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
            className="ly-card rounded-3xl p-5 shadow-2xl shadow-black/10"
        >
            <div className="flex items-center justify-between">
                <p className="ly-muted text-sm">{title}</p>
                {icon}
            </div>

            <h2 className="mt-4 text-3xl font-bold">{value}</h2>

            <p className="ly-muted-soft mt-2 text-xs">
                {description}
            </p>
        </motion.div>
    )
}