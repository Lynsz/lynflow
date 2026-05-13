import type { ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
    LayoutDashboard,
    CheckSquare,
    Settings,
    Sparkles,
    Target,
    LogOut,
    UserRound,
    History,
} from "lucide-react"
import { logoutUser } from "../services/auth"
import { ThemeToggle } from "../components/ThemeToggle"

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

export function AppLayout({ children }: AppLayoutProps) {
    const navigate = useNavigate()

    function handleLogout() {
        logoutUser()
        navigate("/login")
    }

    return (
        <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <aside className="ly-sidebar hidden w-64 flex-col p-5 backdrop-blur-xl md:flex">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-tight">Lynflow</h1>
                    <p className="ly-muted-soft mt-1 text-sm">AI productivity OS</p>
                </div>

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
                                {item.label}
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="mt-auto space-y-3">
                    <ThemeToggle />

                    <div className="ly-card rounded-2xl p-4">
                        <p className="text-sm font-medium">Upgrade your flow</p>
                        <p className="ly-muted-soft mt-1 text-xs">
                            Organize tasks with AI suggestions.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-500"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            <main className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>

            <nav className="ly-bottom-nav fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl md:hidden">
                <div className="grid grid-cols-[repeat(7,minmax(0,1fr))]">
                    {navItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center gap-1 px-1 py-3 text-[10px] transition ${isActive ? "text-[var(--text)]" : "text-[var(--muted-soft)]"
                                    }`
                                }
                            >
                                <Icon size={16} />
                                {item.label}
                            </NavLink>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}