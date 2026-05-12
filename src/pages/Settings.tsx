import { useNavigate } from "react-router-dom"
import { LogOut, Trash2, User } from "lucide-react"
import { getCurrentUser, logoutUser } from "../services/auth"
import { useTasks } from "../hooks/useTasks"

export function Settings() {
    const navigate = useNavigate()
    const user = getCurrentUser()
    const { clearTasks } = useTasks()

    function handleLogout() {
        logoutUser()
        navigate("/login")
    }

    function handleClearTasks() {
        clearTasks()
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1f2937_0,#09090b_40%,#000_100%)] px-4 py-6 md:px-8">
            <header className="mb-8">
                <p className="text-sm text-zinc-500">Preferences</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Settings
                </h1>
                <p className="mt-2 text-zinc-400">
                    Configurações locais do projeto Lynflow.
                </p>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1fr]">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                            <User size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">Conta local</h2>
                            <p className="text-sm text-zinc-500">
                                Dados salvos no navegador.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-zinc-800 pb-3">
                            <span className="text-zinc-500">Nome</span>
                            <span>{user?.name ?? "Usuária"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-zinc-500">E-mail</span>
                            <span>{user?.email ?? "Não informado"}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
                    <h2 className="text-xl font-semibold">Ações</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Controle rápido para testar o MVP.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 md:flex-row">
                        <button
                            onClick={handleClearTasks}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                        >
                            <Trash2 size={18} />
                            Limpar tarefas
                        </button>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                        >
                            <LogOut size={18} />
                            Sair da conta
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}