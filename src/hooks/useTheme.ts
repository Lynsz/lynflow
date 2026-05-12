import { useEffect, useState } from "react"

type Theme = "dark" | "light"

const THEME_KEY = "lynflow-theme"

function getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(THEME_KEY)

    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme
    }

    return "dark"
}

function applyTheme(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(THEME_KEY, theme)
    window.dispatchEvent(new CustomEvent("lynflow-theme-change"))
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        applyTheme(theme)

        function syncTheme() {
            setTheme(getInitialTheme())
        }

        window.addEventListener("lynflow-theme-change", syncTheme)

        return () => {
            window.removeEventListener("lynflow-theme-change", syncTheme)
        }
    }, [theme])

    function toggleTheme() {
        const nextTheme = theme === "dark" ? "light" : "dark"
        setTheme(nextTheme)
        applyTheme(nextTheme)
    }

    return {
        theme,
        isDark: theme === "dark",
        toggleTheme,
    }
}