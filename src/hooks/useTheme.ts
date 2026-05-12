import { useEffect, useState } from "react"

export function useTheme() {
    const [theme, setTheme] = useState<"dark" | "light">(
        () => {
            const saved = localStorage.getItem("theme")
            return saved === "light" ? "light" : "dark"
        }
    )

    useEffect(() => {
        const root = window.document.documentElement

        if (theme === "dark") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }

        localStorage.setItem("theme", theme)
    }, [theme])

    function toggleTheme() {
        setTheme((prev) =>
            prev === "dark" ? "light" : "dark"
        )
    }

    return { theme, toggleTheme }
}