import { useEffect, useState } from "react"
import { LogOut, Moon, Sun } from "lucide-react"

import { supabase } from "../lib/supabase"
import { useTheme } from "../hooks/useTheme"

export function Header() {
    const { theme, toggleTheme } = useTheme()

    const [userEmail, setUserEmail] =
        useState<string | null>(null)

    // 🔐 pega usuário logado
    useEffect(() => {
        async function loadUser() {
            const { data } =
                await supabase.auth.getUser()

            setUserEmail(data.user?.email ?? null)
        }

        loadUser()
    }, [])

    // 🚪 logout
    async function handleLogout() {
        await supabase.auth.signOut()
        window.location.reload()
    }

    return (
        <header className="flex items-center justify-between mb-10">
            {/* LEFT */}
            <div>
                <h2 className="text-3xl font-bold text-white">
                    Welcome back 👋
                </h2>

                <p className="text-zinc-400">
                    {userEmail
                        ? `Logged as ${userEmail}`
                        : "Loading user..."}
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
                {/* THEME */}
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

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 text-black px-4 py-2 rounded-lg font-medium hover:opacity-80 transition"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    )
}