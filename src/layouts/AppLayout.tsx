import { useState, type ReactNode } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
    CheckSquare,
    Command,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    Sparkles,
    Target,
    UserRound,
    X,
} from "lucide-react"
import { logoutUser } from "../services/auth"
import { ThemeToggle } from "../components/ThemeToggle"
import { CommandPalette } from "../components/CommandPalette"
import { GlobalShortcuts } from "../components/GlobalShortcuts"
import { AppTopbar } from "../components/AppTopbar"
import { OnboardingModal } from "../components/OnboardingModal"

type AppLayoutProps = {
    children: ReactNode
}

const navItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Tasks",
        path: "/tasks",
        icon: CheckSquare,
    },
    {
        label: "Goals",
        path: "/goals",
        icon: Target,
    },
    {
        label: "AI",
        path: "/insights",
        icon: Sparkles,
    },
    {
        label: "Activity",
        path: "/activity",
        icon: History,
    },
    {
        label: "Profile",
        path: "/profile",
        icon: UserRound,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Settings,
    },
]

const mobilePrimaryItems = [
    {
        label: "Home",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Tasks",
        path: "/tasks",
        icon: CheckSquare,
    },
    {
        label: "Activity",
        path: "/activity",
        icon: History,
    },
    {
        label: "Profile",
        path: "/profile",
        icon: UserRound,
    },
]

const mobileMoreItems = [
    {
        label: "Goals",
        path: "/goals",
        icon: Target,
    },
    {
        label: "AI Insights",
        path: "/insights",
        icon: Sparkles,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: Settings,
    },
]

export function AppLayout({ children }: AppLayoutProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMoreOpen, setIsMoreOpen] = useState(false)

    const isMoreActive = mobileMoreItems.some(
        (item) => item.path === location.pathname
    )

    function handleLogout() {
        logoutUser()
        setIsMoreOpen(false)
        navigate("/login")
    }

    function closeMoreMenu() {
        setIsMoreOpen(false)
    }

    function openCommandPalette() {
        window.dispatchEvent(new CustomEvent("lynflow-open-command-palette"))
    }

    return (
        <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] md:min-h-dvh">
            <CommandPalette />
            <GlobalShortcuts />
            <OnboardingModal />

            <aside className="ly-sidebar ly-scrollbar fixed bottom-0 left-0 top-0 hidden w-64 flex-col overflow-y-auto p-5 backdrop-blur-xl md:flex">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">Lynflow</h1>
                    <p className="ly-muted-soft mt-1 text-sm">AI productivity OS</p>
                </div>

                <button
                    type="button"
                    onClick={openCommandPalette}
                    className="mb-5 flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--muted-soft)] hover:text-[var(--text)]"
                    aria-label="Abrir Command Palette"
                    title="Abrir Command Palette"
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <Command size={15} />
                        <span className="truncate">Command</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <span className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px]">
                            Ctrl K
                        </span>

                        <span className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px]">
                            G ?
                        </span>
                    </div>
                </button>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive
                                        ? "ly-button-primary"
                                        : "ly-muted hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                <span className="truncate">{item.label}</span>
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="mt-auto space-y-3 pt-8">
                    <ThemeToggle />

                    <div className="ly-card rounded-2xl p-4">
                        <p className="text-sm font-medium">Upgrade your flow</p>
                        <p className="ly-muted-soft mt-1 text-xs">
                            Organize tasks with AI suggestions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-500"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            <main className="min-w-0 flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:ml-64 md:pb-0">
                <AppTopbar />
                {children}
            </main>

            <AnimatePresence>
                {isMoreOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Fechar menu"
                            title="Fechar menu"
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMoreMenu}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 24, scale: 0.98 }}
                            className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-2xl shadow-black/30 md:hidden"
                        >
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold">Mais opções</h2>
                                    <p className="ly-muted-soft text-sm">
                                        Acesse páginas secundárias do Lynflow.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeMoreMenu}
                                    aria-label="Fechar menu"
                                    title="Fechar menu"
                                    className="rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <nav className="grid grid-cols-1 gap-2">
                                {mobileMoreItems.map((item) => {
                                    const Icon = item.icon

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={closeMoreMenu}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${isActive
                                                    ? "ly-button-primary"
                                                    : "ly-muted hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                                }`
                                            }
                                        >
                                            <Icon size={18} />
                                            {item.label}
                                        </NavLink>
                                    )
                                })}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-500 transition hover:bg-red-500/10"
                                >
                                    <LogOut size={18} />
                                    Sair da conta
                                </button>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <nav className="ly-bottom-nav fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl md:hidden">
                <div className="grid grid-cols-5">
                    {mobilePrimaryItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeMoreMenu}
                                className={({ isActive }) =>
                                    `flex min-w-0 flex-col items-center gap-1 px-1 py-3 text-[11px] transition ${isActive
                                        ? "text-[var(--text)]"
                                        : "text-[var(--muted-soft)]"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                <span className="max-w-full truncate">{item.label}</span>
                            </NavLink>
                        )
                    })}

                    <button
                        type="button"
                        onClick={() => setIsMoreOpen((currentValue) => !currentValue)}
                        className={`flex min-w-0 flex-col items-center gap-1 px-1 py-3 text-[11px] transition ${isMoreOpen || isMoreActive
                                ? "text-[var(--text)]"
                                : "text-[var(--muted-soft)]"
                            }`}
                        aria-label="Abrir mais opções"
                        title="Abrir mais opções"
                    >
                        <Menu size={18} />
                        <span className="max-w-full truncate">More</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}