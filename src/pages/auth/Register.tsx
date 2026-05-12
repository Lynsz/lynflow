import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../../services/auth"
import { validateRegisterForm } from "../../utils/validators"
import { AuthCard } from "../../components/auth/AuthCard"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useToast } from "../../components/ui/ToastProvider"

export function Register() {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleRegister(event: FormEvent<HTMLFormElement>) {
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
            registerUser(name, email, password)

            showToast({
                type: "success",
                title: "Conta criada",
                description: "Seu acesso ao Lynflow foi criado com sucesso.",
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
                    <Button type="submit" className="mt-6 w-full">
                        Criar conta
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