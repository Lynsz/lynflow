type CardProps = {
    title: string
    value: string
}

export function Card({ title, value }: CardProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition">
            <p className="text-zinc-400 text-sm mb-3">
                {title}
            </p>

            <h3 className="text-4xl font-bold text-white">
                {value}
            </h3>
        </div>
    )
}