import { useState } from "react"
import { supabase } from "../lib/supabase"
import { createTask } from "../services/tasksService"

interface Props {
    onClose: () => void
    onCreated: () => void
}

export function CreateTaskModal({
    onClose,
    onCreated,
}: Props) {
    const [title, setTitle] = useState("")

    async function handleCreate() {
        if (!title.trim()) return
        if (!supabase) return

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        await createTask(title, user.id)

        setTitle("")
        onCreated() // 🔄 refresh da lista
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-zinc-900 p-6 rounded-xl w-[400px] border border-zinc-800">
                <h2 className="text-white text-xl mb-4">
                    Create Task
                </h2>

                <input
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    placeholder="Task title..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white mb-4"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-zinc-400"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-white text-black rounded-lg"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}
