import { Link, useLocation } from "react-router-dom"
import {
    CheckSquare,
    ChevronRight,
    Command,
    History,
    Home,
    LayoutDashboard,
    Settings,
    Sparkles,
    Target,
    UserRound,
    type LucideIcon,
} from "lucide-react"

type RouteMeta = {
    path: string
    label: string
    description: string
    icon: LucideIcon
}

const routes: RouteMeta[] = [
    {
        path: "/dashboard",
        label: "Dashboard",
        description: "Visão geral da produtividade",
        icon: LayoutDashboard,
    },
    {
        path: "/tasks",
        label: "Tasks",
        description: "Gerenciamento de tarefas",
        icon: CheckSquare,
    },
    {
        path: "/goals",
        label: "Goals",
        description: "Metas e progresso",
        icon: Target,
    },
    {
        path: "/insights",
        label: "AI Insights",
        description: "Sugestões inteligentes",
        icon: Sparkles,
    },
    {
        path: "/activity",
        label: "Activity",
        description: "Histórico de ações",
        icon: History,
    },
    {
        path: "/profile",
        label: "Profile",
        description: "Dados da conta local",
        icon: UserRound,
    },
    {
        path: "/settings",
        label: "Settings",
        description: "Preferências e dados locais",
        icon: Settings,
    },
]

function getCurrentRoute(pathname: string) {
    return (
        routes.find((route) => route.path === pathname) ?? {
            path: pathname,
            label: "Página",
            description: "Área do Lynflow",
            icon: LayoutDashboard,
        }
    )
}

function openCommandPalette() {
    window.dispatchEvent(new CustomEvent("lynflow-open-command-palette"))
}

export function AppTopbar() {
    const location = useLocation()
    const currentRoute = getCurrentRoute(location.pathname)
    const Icon = currentRoute.icon

    return (
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-soft)]/88 px-4 py-3 backdrop-blur-xl md:px-6 xl:px-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-2 flex min-w-0 items-center gap-2 text-xs text-[var(--muted-soft)] sm:text-sm"
                    >
                        <Link
                            to="/dashboard"
                            className="inline-flex shrink-0 items-center gap-1 transition hover:text-[var(--text)]"
                        >
                            <Home size={14} />
                            <span className="hidden sm:inline">Lynflow</span>
                        </Link>

                        <ChevronRight size={14} className="shrink-0" />

                        <span className="truncate text-[var(--text)]">
                            {currentRoute.label}
                        </span>
                    </nav>

                    <div className="flex min-w-0 items-center gap-3">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] sm:flex">
                            <Icon size={18} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold md:text-lg">
                                {currentRoute.label}
                            </h2>

                            <p className="ly-muted-soft truncate text-xs md:text-sm">
                                {currentRoute.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={openCommandPalette}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--muted-soft)] hover:text-[var(--text)]"
                        aria-label="Abrir Command Palette"
                        title="Abrir Command Palette"
                    >
                        <Command size={16} />

                        <span className="hidden sm:inline">Command</span>

                        <span className="hidden rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--muted-soft)] sm:inline">
                            Ctrl K
                        </span>
                    </button>

                    <div className="hidden items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted-soft)] sm:flex">
                        <span className="rounded-md border border-[var(--border)] px-1.5 py-0.5">
                            G
                        </span>

                        <span>+</span>

                        <span className="rounded-md border border-[var(--border)] px-1.5 py-0.5">
                            ?
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}