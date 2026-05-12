type CreateTaskModalProps = {
    open: boolean
    onClose: () => void
}

export function CreateTaskModal({
    open,
    onClose,
}: CreateTaskModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Create Task
                </h2>

                <input
                    type="text"
                    placeholder="Task title..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-zinc-800 text-white px-4 py-2 rounded-xl"
                    >
                        Cancel
                    </button>

                    <button className="bg-white text-black px-4 py-2 rounded-xl font-medium">
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}