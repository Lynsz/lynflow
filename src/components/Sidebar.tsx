import {
    LayoutDashboard,
    CheckSquare,
    BarChart3,
    Settings,
} from "lucide-react"

import { Link } from "react-router-dom"

export function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6">
            <h1 className="text-3xl font-bold text-white mb-10">
                LynFlow
            </h1>

            <nav className="flex flex-col gap-3">
                <Link
                    to="/"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link
                    to="/tasks"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <CheckSquare size={20} />
                    Tasks
                </Link>

                <Link
                    to="/analytics"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <BarChart3 size={20} />
                    Analytics
                </Link>

                <Link
                    to="/settings"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <Settings size={20} />
                    Settings
                </Link>
            </nav>
        </aside>
    )
}