import {
    LayoutDashboard,
    CheckSquare,
    BarChart3,
    Settings,
} from "lucide-react"

import { Link, useLocation } from "react-router-dom"

export function Sidebar() {
    const location = useLocation()

    const links = [
        {
            path: "/",
            label: "Dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            path: "/tasks",
            label: "Tasks",
            icon: <CheckSquare size={20} />,
        },
        {
            path: "/analytics",
            label: "Analytics",
            icon: <BarChart3 size={20} />,
        },
        {
            path: "/settings",
            label: "Settings",
            icon: <Settings size={20} />,
        },
    ]

    return (
        <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6">
            <h1 className="text-3xl font-bold text-white mb-10">
                LynFlow
            </h1>

            <nav className="flex flex-col gap-3">
                {links.map((link) => {
                    const isActive = location.pathname === link.path

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 p-3 rounded-xl transition ${isActive
                                    ? "bg-white text-black font-medium"
                                    : "text-zinc-300 hover:bg-zinc-900"
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}