import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/useTheme"

export function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold text-white dark:text-white">
                    Welcome back 👋
                </h2>

                <p className="text-zinc-400">
                    Here’s your productivity overview
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white hover:opacity-80 transition"
                >
                    {theme === "dark" ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>

                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-80 transition">
                    New Task
                </button>
            </div>
        </header>
    )
}