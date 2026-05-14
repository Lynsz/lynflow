import { Moon, Sun } from "lucide-react"
import { useTheme } from "../hooks/useTheme"

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 text-sm transition hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
            aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
            aria-pressed={isDark ? "true" : "false"}
        >
            <span
                className={`absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-[var(--text)] shadow-lg shadow-black/10 transition-transform duration-300 ${isDark ? "translate-x-[calc(100%+0.375rem)]" : "translate-x-0"
                    }`}
                aria-hidden="true"
            />

            <span
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 transition ${!isDark ? "text-[var(--bg)]" : "text-[var(--muted)]"
                    }`}
            >
                <Sun size={16} aria-hidden="true" />
                <span className="font-semibold">Light</span>
            </span>

            <span
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 transition ${isDark ? "text-[var(--bg)]" : "text-[var(--muted)]"
                    }`}
            >
                <Moon size={16} aria-hidden="true" />
                <span className="font-semibold">Dark</span>
            </span>
        </button>
    )
}