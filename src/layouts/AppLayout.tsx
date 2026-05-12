import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"

type Props = {
    children: ReactNode
}

export function AppLayout({ children }: Props) {
    return (
        <div className="min-h-screen flex bg-zinc-950 text-white">
            {/* SIDEBAR */}
            <aside className="w-64 bg-zinc-900 p-4 space-y-4">
                <h1 className="text-xl font-bold">Lynflow</h1>

                <nav className="flex flex-col gap-2">
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            isActive ? "text-green-400" : "hover:text-green-400"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-green-400" : "hover:text-green-400"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            isActive ? "text-green-400" : "hover:text-green-400"
                        }
                    >
                        Tasks
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            isActive ? "text-green-400" : "hover:text-green-400"
                        }
                    >
                        Settings
                    </NavLink>
                </nav>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}