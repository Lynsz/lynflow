import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/useTheme"

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="ly-button-secondary flex items-center justify-center gap-2"
            aria-label="Alternar tema"
            title="Alternar tema"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden lg:inline">
                {isDark ? "Light" : "Dark"}
            </span>
        </button>
    )
}