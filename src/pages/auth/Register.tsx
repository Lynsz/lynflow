import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { registerUser } from "../../services/auth"
import { ThemeToggle } from "../../components/ThemeToggle"

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
            navigate("/dashboard")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        }
    }

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

                    <h1 className="text-3xl font-bold tracking-tight">
                        Crie sua conta
                    </h1>

                    <p className="ly-muted mt-2 text-sm">
                        Comece a organizar sua produtividade com o Lynflow.
                    </p>
                </div>

                <form
                    onSubmit={handleRegister}
                    className="ly-card rounded-3xl p-6 shadow-2xl shadow-black/10"
                >
                    {error && (
                        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm">
                                Nome
                            </label>

                            <input
                                id="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Seu nome"
                                title="Digite seu nome"
                                aria-label="Digite seu nome"
                                className="ly-input rounded-2xl px-4 py-3"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm">
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="seu@email.com"
                                title="Digite seu e-mail"
                                aria-label="Digite seu e-mail"
                                className="ly-input rounded-2xl px-4 py-3"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm">
                                Senha
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Crie uma senha"
                                title="Crie uma senha"
                                aria-label="Crie uma senha"
                                className="ly-input rounded-2xl px-4 py-3"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="ly-button-primary mt-6 w-full rounded-2xl px-4 py-3 font-medium active:scale-[0.98]"
                    >
                        Criar conta
                    </button>

                    <p className="ly-muted mt-5 text-center text-sm">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="text-[var(--text)] hover:underline">
                            Entrar
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    )
}