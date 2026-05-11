import {
    LayoutDashboard,
    CheckSquare,
    BarChart3,
    Settings,
} from "lucide-react"

export function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6">
            <h1 className="text-3xl font-bold text-white mb-10">
                LynFlow
            </h1>

            <nav className="flex flex-col gap-3">
                <a
                    href="#"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <CheckSquare size={20} />
                    Tasks
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <BarChart3 size={20} />
                    Analytics
                </a>

                <a
                    href="#"
                    className="flex items-center gap-3 text-zinc-300 hover:bg-zinc-900 p-3 rounded-xl transition"
                >
                    <Settings size={20} />
                    Settings
                </a>
            </nav>
        </aside>
    )
}