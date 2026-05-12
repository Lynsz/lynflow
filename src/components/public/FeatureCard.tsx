import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

type FeatureCardProps = {
    icon: LucideIcon
    title: string
    description: string
    delay?: number
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    delay = 0,
}: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="ly-card rounded-3xl p-5"
        >
            <div className="ly-button-primary mb-5 flex h-11 w-11 items-center justify-center rounded-2xl">
                <Icon size={21} />
            </div>

            <h3 className="text-lg font-semibold">{title}</h3>

            <p className="ly-muted mt-3 text-sm leading-6">{description}</p>
        </motion.div>
    )
}