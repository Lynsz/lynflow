import type { FormEventHandler, ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "../ThemeToggle"

type AuthCardProps = {
    title: string
    description: string
    error?: string
    children: ReactNode
    footer: ReactNode
    onSubmit: FormEventHandler<HTMLFormElement>
}

export function AuthCard({
    title,
    description,
    error,
    children,
    footer,
    onSubmit,
}: AuthCardProps) {
    return (
        <div className="ly-page flex min-h-screen items-center justify-center px-4 py-8">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="ly-button-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                        aria-label="Voltar para a página inicial"
                        title="Voltar para a página inicial"
                    >
                        <Sparkles size={22} />
                    </Link>

                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

                    <p className="ly-muted mt-2 text-sm">{description}</p>
                </div>

                <form
                    onSubmit={onSubmit}
                    noValidate
                    className="ly-card rounded-3xl p-6 shadow-2xl shadow-black/10"
                >
                    {error && (
                        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {children}

                    {footer}
                </form>
            </motion.div>
        </div>
    )
}