import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { validateRegisterForm } from "../../utils/validators"
import { AuthCard } from "../../components/auth/AuthCard"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useToast } from "../../components/ui/ToastProvider"

export function Register() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { register, dataMode } = useAuth()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")

        const validationError = validateRegisterForm(name, email, password)

        if (validationError) {
            setError(validationError)

            showToast({
                type: "error",
                title: "Erro no cadastro",
                description: validationError,
            })

            return
        }

        try {
            setIsSubmitting(true)

            const registeredUser = await register(name, email, password)

            if (!registeredUser && dataMode === "supabase") {
                showToast({
                    type: "info",
                    title: "Confirme seu e-mail",
                    description:
                        "Sua conta foi criada. Verifique seu e-mail antes de fazer login.",
                })

                navigate("/login")
                return
            }

            showToast({
                type: "success",
                title: "Conta criada",
                description:
                    dataMode === "supabase"
                        ? "Conta criada com autenticacao Supabase."
                        : "Seu acesso ao Lynflow foi criado com sucesso.",
            })

            navigate("/dashboard")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)

                showToast({
                    type: "error",
                    title: "Não foi possível criar a conta",
                    description: err.message,
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthCard
            title="Crie sua conta"
            description="Comece a organizar sua produtividade com o Lynflow."
            error={error}
            onSubmit={handleRegister}
            footer={
                <>
                    <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Criando..." : "Criar conta"}
                    </Button>

                    <p className="ly-muted mt-5 text-center text-sm">
                        Já tem uma conta?{" "}
                        <Link to="/login" className="text-[var(--text)] hover:underline">
                            Entrar
                        </Link>
                    </p>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="mb-2 block text-sm">
                        Nome
                    </label>

                    <Input
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Seu nome"
                        title="Digite seu nome"
                        aria-label="Digite seu nome"
                        autoComplete="name"
                    />
                </div>

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
                        placeholder="Crie uma senha"
                        title="Crie uma senha"
                        aria-label="Crie uma senha"
                        autoComplete="new-password"
                    />
                </div>
            </div>
        </AuthCard>
    )
}