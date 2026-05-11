export function Header() {
    return (
        <header className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold text-white">
                    Welcome back 👋
                </h2>

                <p className="text-zinc-400">
                    Here’s your productivity overview
                </p>
            </div>

            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium">
                New Task
            </button>
        </header>
    )
}