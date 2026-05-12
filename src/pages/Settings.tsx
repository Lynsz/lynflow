import { useNavigate } from "react-router-dom"
import { LogOut, Moon, Sun, Trash2, User } from "lucide-react"
import { getCurrentUser, logoutUser } from "../services/auth"
import { useTasks } from "../hooks/useTasks"
import { useTheme } from "../hooks/useTheme"
import { Button } from "../components/ui/Button"
import { InfoRow } from "../components/ui/InfoRow"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"

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
            <PageHeader
                eyebrow="Preferences"
                title="Settings"
                description="Configurações locais do projeto Lynflow."
            />

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1fr]">
                <SectionCard title="Conta local" description="Dados salvos no navegador.">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="ly-button-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                            <User size={22} />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                {user?.name ?? "Usuária"}
                            </h3>
                            <p className="ly-muted-soft text-sm">
                                {user?.email ?? "Não informado"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <InfoRow label="Nome" value={user?.name ?? "Usuária"} />
                        <InfoRow
                            label="E-mail"
                            value={user?.email ?? "Não informado"}
                            bordered={false}
                        />
                    </div>
                </SectionCard>

                <SectionCard title="Aparência" description="Alterne entre dark mode e light mode.">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="font-medium">
                                Tema atual: {isDark ? "Escuro" : "Claro"}
                            </p>

                            <p className="ly-muted-soft mt-1 text-sm">
                                A preferência fica salva no navegador.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
                            onClick={toggleTheme}
                        >
                            Usar tema {isDark ? "claro" : "escuro"}
                        </Button>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Ações"
                    description="Controle rápido para testar o MVP."
                    className="xl:col-span-2"
                >
                    <div className="flex flex-col gap-3 md:flex-row">
                        <Button
                            variant="danger"
                            icon={<Trash2 size={18} />}
                            onClick={handleClearTasks}
                        >
                            Limpar tarefas
                        </Button>

                        <Button
                            icon={<LogOut size={18} />}
                            onClick={handleLogout}
                        >
                            Sair da conta
                        </Button>
                    </div>
                </SectionCard>
            </section>
        </div>
    )
}