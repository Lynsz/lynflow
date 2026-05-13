import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, Home, RefreshCcw, Trash2 } from "lucide-react"
import { Button } from "./ui/Button"
import { LinkButton } from "./ui/LinkButton"
import { ThemeToggle } from "./ThemeToggle"

type ErrorBoundaryProps = {
    children: ReactNode
}

type ErrorBoundaryState = {
    hasError: boolean
    errorMessage: string
}

const LOCAL_STORAGE_KEYS = [
    "lynflow-users",
    "lynflow-session",
    "lynflow-tasks",
    "lynflow-activities",
    "lynflow-theme",
    "lynflow-onboarding-completed",
]

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props)

        this.state = {
            hasError: false,
            errorMessage: "",
        }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            errorMessage: error.message,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Lynflow runtime error:", error)
        console.error("Lynflow error info:", errorInfo)
    }

    handleReload = () => {
        window.location.reload()
    }

    handleResetLocalData = () => {
        LOCAL_STORAGE_KEYS.forEach((key) => {
            localStorage.removeItem(key)
        })

        window.location.href = "/"
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children
        }

        return (
            <div className="ly-page flex min-h-screen items-center justify-center px-4 py-8">
                <div className="absolute right-4 top-4">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-2xl">
                    <div className="ly-card rounded-[2rem] p-6 text-center shadow-2xl shadow-black/20 md:p-10">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-red-500/20 bg-red-500/10 text-red-500">
                            <AlertTriangle size={38} />
                        </div>

                        <p className="ly-muted-soft mb-3 text-sm font-medium uppercase tracking-[0.3em]">
                            Runtime error
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                            Algo quebrou no Lynflow
                        </h1>

                        <p className="ly-muted mx-auto mt-5 max-w-xl text-sm leading-7 md:text-base">
                            O app encontrou um erro inesperado durante a renderização. Você
                            pode tentar recarregar a página ou limpar os dados locais se o
                            problema estiver em algum dado salvo no navegador.
                        </p>

                        {this.state.errorMessage && (
                            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-left">
                                <p className="ly-muted-soft mb-2 text-xs uppercase tracking-[0.2em]">
                                    Mensagem técnica
                                </p>

                                <code className="break-words text-sm text-red-500">
                                    {this.state.errorMessage}
                                </code>
                            </div>
                        )}

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                icon={<RefreshCcw size={18} />}
                                onClick={this.handleReload}
                            >
                                Recarregar
                            </Button>

                            <LinkButton
                                to="/"
                                size="lg"
                                variant="secondary"
                                icon={<Home size={18} />}
                            >
                                Ir para início
                            </LinkButton>

                            <Button
                                size="lg"
                                variant="danger"
                                icon={<Trash2 size={18} />}
                                onClick={this.handleResetLocalData}
                            >
                                Limpar dados locais
                            </Button>
                        </div>
                    </div>

                    <p className="ly-muted-soft mt-6 text-center text-sm">
                        Dica: se isso acontecer durante o desenvolvimento, confira o console
                        do navegador e o terminal do Vite.
                    </p>
                </div>
            </div>
        )
    }
}