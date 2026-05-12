import { LogOut } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useTaskStore } from "../store/taskStore"

export function Header() {
    const { setTasks } = useTaskStore()

    async function handleLogout() {
        await supabase.auth.signOut()

        // 🧹 limpa estado local
        setTasks([])

        // 🔁 força reset de app (garante logout real)
        window.location.href = "/"
    }

    return (
        <div className="flex justify-end">
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-black px-4 py-2 rounded-lg"
            >
                <LogOut size={16} />
                Logout
            </button>
        </div>
    )
}