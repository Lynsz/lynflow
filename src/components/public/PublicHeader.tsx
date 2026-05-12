import { Link } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"
import { ThemeToggle } from "../ThemeToggle"
import { LinkButton } from "../ui/LinkButton"

export function PublicHeader() {
    return (
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <Link to="/" className="flex items-center gap-3">
                <div className="ly-button-primary flex h-10 w-10 items-center justify-center rounded-2xl">
                    <Sparkles size={20} />
                </div>

                <div>
                    <strong className="block text-lg tracking-tight">Lynflow</strong>
                    <span className="ly-muted-soft text-xs">AI productivity OS</span>
                </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm md:flex">
                <a
                    href="#features"
                    className="ly-muted transition hover:text-[var(--text)]"
                >
                    Benefícios
                </a>

                <a
                    href="#preview"
                    className="ly-muted transition hover:text-[var(--text)]"
                >
                    Preview
                </a>

                <a
                    href="#roadmap"
                    className="ly-muted transition hover:text-[var(--text)]"
                >
                    Roadmap
                </a>
            </nav>

            <div className="flex items-center gap-3">
                <ThemeToggle />

                <LinkButton
                    to="/login"
                    variant="secondary"
                    size="sm"
                    className="hidden rounded-xl md:inline-flex"
                >
                    Entrar
                </LinkButton>

                <LinkButton
                    to="/register"
                    size="sm"
                    className="rounded-xl"
                    icon={<ArrowRight size={16} />}
                >
                    Começar
                </LinkButton>
            </div>
        </header>
    )
}