import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../../services/auth"
import { validateLoginForm } from "../../utils/validators"
import { AuthCard } from "../../components/auth/AuthCard"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useToast } from "../../components/ui/ToastProvider"

export function Login() {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")

        const validationError = validateLoginForm(email, password)

        if (validationError) {
            setError(validationError)

            showToast({
                type: "error",
                title: "Erro no login",
                description: validationError,
            })

            return
        }

        try {
            loginUser(email, password)

            showToast({
                type: "success",
                title: "Login realizado",
                description: "Bem-vinda de volta ao Lynflow.",
            })

            navigate("/dashboard")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)

                showToast({
                    type: "error",
                    title: "Não foi possível entrar",
                    description: err.message,
                })
            }
        }
    }

    return (
        <AuthCard
            title="Bem-vinda ao Lynflow"
            description="Entre para acessar seu dashboard de produtividade."
            error={error}
            onSubmit={handleLogin}
            footer={
                <>
                    <Button type="submit" className="mt-6 w-full">
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
                        autoComplete="email"
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
                        autoComplete="current-password"
                    />
                </div>
            </div>
        </AuthCard>
    )
}