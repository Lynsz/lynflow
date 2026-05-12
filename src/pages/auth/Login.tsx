import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../../services/auth"
import { AuthCard } from "../../components/auth/AuthCard"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"

export function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleLogin(event: React.FormEvent) {
        event.preventDefault()
        setError("")

        if (!email.trim() || !password.trim()) {
            setError("Preencha e-mail e senha.")
            return
        }

        try {
            loginUser(email, password)
            navigate("/dashboard")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        }
    }

    return (
        <AuthCard
            title="Bem-vinda ao Lynflow"
            description="Entre para acessar seu dashboard de produtividade."
            error={error}
            footer={
                <>
                    <Button
                        type="submit"
                        className="mt-6 w-full"
                        onClick={handleLogin}
                    >
                        Entrar
                    </Button>

                    <p className="ly-muted mt-5 text-center text-sm">
                        Ainda não tem conta?{" "}
                        <Link to="/register" className="text-[var(--text)] hover:underline">
                            Criar conta
                        </Link>
                    </p>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm">
                        E-mail
                    </label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seu@email.com"
                        title="Digite seu e-mail"
                        aria-label="Digite seu e-mail"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-sm">
                        Senha
                    </label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Sua senha"
                        title="Digite sua senha"
                        aria-label="Digite sua senha"
                    />
                </div>
            </div>
        </AuthCard>
    )
}