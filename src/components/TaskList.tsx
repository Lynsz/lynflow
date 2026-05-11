const tasks = [
    {
        id: 1,
        title: "Finish dashboard UI",
        completed: true,
    },
    {
        id: 2,
        title: "Build task system",
        completed: false,
    },
    {
        id: 3,
        title: "Study React",
        completed: false,
    },
]

export function TaskList() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">
                Tasks
            </h2>

            <div className="flex flex-col gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-xl"
                    >
                        <span
                            className={`${task.completed
                                    ? "line-through text-zinc-500"
                                    : "text-white"
                                }`}
                        >
                            {task.title}
                        </span>

                        <button
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${task.completed
                                    ? "bg-green-500 text-black"
                                    : "bg-zinc-800 text-white"
                                }`}
                        >
                            {task.completed ? "Done" : "Pending"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}