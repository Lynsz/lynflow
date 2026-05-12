import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { registerUser } from "../../services/auth"

export function Register() {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleRegister(event: React.FormEvent) {
        event.preventDefault()
        setError("")

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Preencha todos os campos.")
            return
        }

        try {
            registerUser(name, email, password)
            navigate("/")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1f2937_0,#09090b_40%,#000_100%)] text-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                        <Sparkles size={22} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Crie sua conta
                    </h1>

                    <p className="mt-2 text-sm text-zinc-400">
                        Comece a organizar sua produtividade com o Lynflow.
                    </p>
                </div>

                <form
                    onSubmit={handleRegister}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-black/30"
                >
                    {error && (
                        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm text-zinc-300">
                                Nome
                            </label>
                            <input
                                id="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Seu nome"
                                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm text-zinc-300">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="seu@email.com"
                                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm text-zinc-300"
                            >
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Crie uma senha"
                                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                    >
                        Criar conta
                    </button>

                    <p className="mt-5 text-center text-sm text-zinc-400">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="text-white hover:underline">
                            Entrar
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    )
}