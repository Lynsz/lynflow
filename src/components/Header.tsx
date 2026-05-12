import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/useTheme"

export function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="flex justify-end mb-6">
            <button
                onClick={toggleTheme}
                className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white"
            >
                {theme === "dark" ? (
                    <Sun size={18} />
                ) : (
                    <Moon size={18} />
                )}
            </button>
        </header>
    )
}