import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    BookOpen,
    History,
    LogOut,
    Moon,
    RotateCcw,
    Sun,
    Trash2,
    User,
} from "lucide-react"
import { getCurrentUser, logoutUser } from "../services/auth"
import { useTasks } from "../hooks/useTasks"
import { useTheme } from "../hooks/useTheme"
import { Button } from "../components/ui/Button"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { InfoRow } from "../components/ui/InfoRow"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import { useToast } from "../components/ui/ToastProvider"
import { DeployChecklist } from "../components/settings/DeployChecklist"
import { DeployGuide } from "../components/settings/DeployGuide"

export function Settings() {
    const navigate = useNavigate()
    const user = getCurrentUser()

    const {
        tasks,
        activities,
        clearTasks,
        resetTasks,
        clearActivities,
    } = useTasks()

    const { isDark, toggleTheme } = useTheme()
    const { showToast } = useToast()

    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
    const [isClearActivitiesDialogOpen, setIsClearActivitiesDialogOpen] =
        useState(false)

    function handleLogout() {
        logoutUser()

        showToast({
            type: "info",
            title: "Você saiu da conta",
            description: "A sessão local foi encerrada.",
        })

        navigate("/login")
    }

    function confirmClearTasks() {
        clearTasks()

        showToast({
            type: "success",
            title: "Tarefas limpas",
            description: "Todas as tarefas locais foram removidas.",
        })

        setIsClearDialogOpen(false)
    }

    function confirmResetTasks() {
        resetTasks()

        showToast({
            type: "success",
            title: "Demo restaurada",
            description: "As tarefas iniciais do Lynflow foram restauradas.",
        })

        setIsResetDialogOpen(false)
    }

    function confirmClearActivities() {
        clearActivities()

        showToast({
            type: "success",
            title: "Histórico limpo",
            description: "As atividades recentes foram removidas.",
        })

        setIsClearActivitiesDialogOpen(false)
    }

    function handleToggleTheme() {
        toggleTheme()

        showToast({
            type: "success",
            title: "Tema atualizado",
            description: `Tema ${isDark ? "claro" : "escuro"} ativado.`,
        })
    }

    function handleOpenOnboarding() {
        window.dispatchEvent(new CustomEvent("lynflow-open-onboarding"))

        showToast({
            type: "info",
            title: "Tutorial aberto",
            description: "O onboarding do Lynflow foi reaberto.",
        })
    }

    return (
        <>
            <div className="ly-page px-4 py-6 md:px-8">
                <PageHeader
                    eyebrow="Preferences"
                    title="Settings"
                    description="Configurações locais do projeto Lynflow."
                />

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1fr]">
                    <SectionCard
                        title="Conta local"
                        description="Dados salvos no navegador."
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <div className="ly-button-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                                <User size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold">{user?.name ?? "Usuária"}</h3>
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

                    <SectionCard
                        title="Aparência"
                        description="Alterne entre dark mode e light mode."
                    >
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
                                onClick={handleToggleTheme}
                            >
                                Usar tema {isDark ? "claro" : "escuro"}
                            </Button>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Ajuda e onboarding"
                        description="Reabra o tutorial inicial para revisar o fluxo do Lynflow."
                        className="xl:col-span-2"
                    >
                        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-medium">Tutorial do produto</p>

                                <p className="ly-muted-soft mt-1 text-sm leading-6">
                                    Revise como criar tarefas, usar analytics, acessar histórico
                                    e navegar com atalhos.
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                icon={<BookOpen size={18} />}
                                onClick={handleOpenOnboarding}
                            >
                                Abrir tutorial
                            </Button>
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Checklist pré-deploy"
                        description="Controle visual para finalizar o projeto antes de publicar."
                        className="xl:col-span-2"
                    >
                        <DeployChecklist />
                    </SectionCard>

                    <SectionCard
                        title="Guia de deploy"
                        description="Comandos e passos finais para publicar o Lynflow."
                        className="xl:col-span-2"
                    >
                        <DeployGuide />
                    </SectionCard>

                    <SectionCard
                        title="Dados locais"
                        description="Controle rápido para testar o projeto durante desenvolvimento."
                        className="xl:col-span-2"
                    >
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                                <p className="ly-muted-soft text-sm">Tarefas salvas</p>
                                <strong className="mt-2 block text-3xl">{tasks.length}</strong>
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                                <p className="ly-muted-soft text-sm">Atividades registradas</p>
                                <strong className="mt-2 block text-3xl">
                                    {activities.length}
                                </strong>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                            <Button
                                variant="secondary"
                                icon={<RotateCcw size={18} />}
                                onClick={() => setIsResetDialogOpen(true)}
                            >
                                Restaurar demo
                            </Button>

                            <Button
                                variant="secondary"
                                icon={<History size={18} />}
                                onClick={() => setIsClearActivitiesDialogOpen(true)}
                                disabled={activities.length === 0}
                            >
                                Limpar histórico
                            </Button>

                            <Button
                                variant="danger"
                                icon={<Trash2 size={18} />}
                                onClick={() => setIsClearDialogOpen(true)}
                                disabled={tasks.length === 0}
                            >
                                Limpar tarefas
                            </Button>

                            <Button icon={<LogOut size={18} />} onClick={handleLogout}>
                                Sair da conta
                            </Button>
                        </div>
                    </SectionCard>
                </section>
            </div>

            <ConfirmDialog
                isOpen={isClearDialogOpen}
                title="Limpar todas as tarefas?"
                description="Essa ação vai remover todas as tarefas salvas localmente. Essa operação não pode ser desfeita."
                confirmLabel="Limpar tarefas"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={confirmClearTasks}
                onClose={() => setIsClearDialogOpen(false)}
            />

            <ConfirmDialog
                isOpen={isResetDialogOpen}
                title="Restaurar tarefas demo?"
                description="Essa ação vai substituir a lista atual pelas tarefas iniciais do Lynflow. Use isso para voltar o projeto para um estado de demonstração."
                confirmLabel="Restaurar demo"
                cancelLabel="Cancelar"
                variant="primary"
                onConfirm={confirmResetTasks}
                onClose={() => setIsResetDialogOpen(false)}
            />

            <ConfirmDialog
                isOpen={isClearActivitiesDialogOpen}
                title="Limpar histórico de atividades?"
                description="Essa ação vai remover o histórico local de atividades recentes exibido no Dashboard. As tarefas não serão apagadas."
                confirmLabel="Limpar histórico"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={confirmClearActivities}
                onClose={() => setIsClearActivitiesDialogOpen(false)}
            />
        </>
    )
}