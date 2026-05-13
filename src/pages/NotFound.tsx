import { Link } from "react-router-dom"
import { ArrowLeft, Home, SearchX, Sparkles } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "../components/ui/Button"
import { LinkButton } from "../components/ui/LinkButton"
import { ThemeToggle } from "../components/ThemeToggle"

export function NotFound() {
    const { isAuthenticated } = useAuth()
    const primaryPath = isAuthenticated ? "/dashboard" : "/"
    const primaryLabel = isAuthenticated ? "Voltar ao Dashboard" : "Voltar ao início"

    return (
        <div className="ly-page flex min-h-screen items-center justify-center px-4 py-8">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-2xl text-center">
                <Link
                    to="/"
                    className="ly-button-primary mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-3xl"
                    aria-label="Voltar para página inicial"
                    title="Voltar para página inicial"
                >
                    <Sparkles size={24} />
                </Link>

                <div className="ly-card rounded-[2rem] p-8 shadow-2xl shadow-black/20 md:p-10">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]">
                        <SearchX size={38} />
                    </div>

                    <p className="ly-muted-soft mb-3 text-sm font-medium uppercase tracking-[0.3em]">
                        Error 404
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                        Página não encontrada
                    </h1>

                    <p className="ly-muted mx-auto mt-5 max-w-xl text-base leading-7">
                        A rota que você tentou acessar não existe ou foi movida. Use os
                        botões abaixo para voltar para uma área válida do Lynflow.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <LinkButton
                            to={primaryPath}
                            size="lg"
                            icon={<Home size={18} />}
                        >
                            {primaryLabel}
                        </LinkButton>

                        <Button
                            variant="secondary"
                            size="lg"
                            icon={<ArrowLeft size={18} />}
                            onClick={() => window.history.back()}
                        >
                            Voltar
                        </Button>
                    </div>
                </div>

                <p className="ly-muted-soft mt-6 text-sm">
                    Lynflow mantém seus dados locais salvos no navegador.
                </p>
            </div>
        </div>
    )
}
