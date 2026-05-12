import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    CheckSquare,
    Settings,
    Sparkles,
    Target,
} from "lucide-react"

type AppLayoutProps = {
    children: ReactNode
}

const navItems = [
    {
        label: "Dashboard",
        path: "/",
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
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-5 flex-col">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Lynflow
                    </h1>

                    <p className="text-sm text-zinc-500 mt-1">
                        AI productivity OS
                    </p>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${isActive
                                        ? "bg-white text-black"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {item.label}
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <p className="text-sm font-medium">Upgrade your flow</p>
                    <p className="text-xs text-zinc-500 mt-1">
                        Organize tasks with AI suggestions.
                    </p>
                </div>
            </aside>

            <main className="flex-1 min-w-0">{children}</main>
        </div>
    )
}