import { useNavigate } from "react-router-dom"
import { LogOut, Moon, Sun, Trash2, User } from "lucide-react"
import { getCurrentUser, logoutUser } from "../services/auth"
import { useTasks } from "../hooks/useTasks"
import { useTheme } from "../hooks/useTheme"

export function Settings() {
    const navigate = useNavigate()
    const user = getCurrentUser()
    const { clearTasks } = useTasks()
    const { isDark, toggleTheme } = useTheme()

    function handleLogout() {
        logoutUser()
        navigate("/login")
    }

    function handleClearTasks() {
        clearTasks()
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <header className="mb-8">
                <p className="ly-muted-soft text-sm">Preferences</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Settings
                </h1>
                <p className="ly-muted mt-2">
                    Configurações locais do projeto Lynflow.
                </p>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1fr]">
                <div className="ly-card rounded-3xl p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="ly-button-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                            <User size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">Conta local</h2>
                            <p className="ly-muted-soft text-sm">
                                Dados salvos no navegador.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-[var(--border)] pb-3">
                            <span className="ly-muted-soft">Nome</span>
                            <span>{user?.name ?? "Usuária"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="ly-muted-soft">E-mail</span>
                            <span>{user?.email ?? "Não informado"}</span>
                        </div>
                    </div>
                </div>

                <div className="ly-card rounded-3xl p-6">
                    <h2 className="text-xl font-semibold">Aparência</h2>
                    <p className="ly-muted-soft mt-1 text-sm">
                        Alterne entre dark mode e light mode.
                    </p>

                    <button
                        onClick={toggleTheme}
                        className="ly-button-secondary mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        Usar tema {isDark ? "claro" : "escuro"}
                    </button>
                </div>

                <div className="ly-card rounded-3xl p-6 xl:col-span-2">
                    <h2 className="text-xl font-semibold">Ações</h2>
                    <p className="ly-muted-soft mt-1 text-sm">
                        Controle rápido para testar o MVP.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 md:flex-row">
                        <button
                            onClick={handleClearTasks}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/20"
                        >
                            <Trash2 size={18} />
                            Limpar tarefas
                        </button>

                        <button
                            onClick={handleLogout}
                            className="ly-button-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium active:scale-[0.98]"
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