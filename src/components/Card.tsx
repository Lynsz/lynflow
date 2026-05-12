import { motion } from "framer-motion"

type CardProps = {
    title: string
    value: string | number
}

export function Card({
    title,
    value,
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition"
        >
            <p className="text-zinc-400 text-sm mb-3">
                {title}
            </p>

            <h3 className="text-4xl font-bold text-white">
                {value}
            </h3>
        </motion.div>
    )
}