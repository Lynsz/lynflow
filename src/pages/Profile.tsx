import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
    BarChart3,
    CheckCircle2,
    Clock3,
    LayoutDashboard,
    Pencil,
    Save,
    Settings,
    Target,
    X,
} from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { validateProfileForm } from "../utils/validators"
import { useTasks } from "../hooks/useTasks"
import { Button } from "../components/ui/Button"
import { InfoRow } from "../components/ui/InfoRow"
import { Input } from "../components/ui/Input"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { ProgressBar } from "../components/ui/ProgressBar"
import { SectionCard } from "../components/ui/SectionCard"
import { DashboardSkeleton } from "../components/skeletons/DashboardSkeleton"
import { useToast } from "../components/ui/ToastProvider"

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
}

function getProductivityLabel(productivity: number) {
    if (productivity >= 75) return "Excelente"
    if (productivity >= 50) return "Bom progresso"
    if (productivity >= 25) return "Em evolução"
    return "Precisa de foco"
}

export function Profile() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { user, updateProfile, dataMode } = useAuth()

    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user?.name ?? "")
    const [email, setEmail] = useState(user?.email ?? "")
    const [error, setError] = useState("")

    const {
        isReady,
        tasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        productivity,
        categories,
        syncStatus,
    } = useTasks()

    if (!isReady) {
        return <DashboardSkeleton />
    }

    const userName = user?.name ?? "Usuaria"
    const userEmail = user?.email ?? "Nao informado"
    const initials = getInitials(userName)
    const productivityLabel = getProductivityLabel(productivity)
    const hasProfileChanges =
        name.trim() !== userName || email.trim().toLowerCase() !== userEmail

    function handleStartEdit() {
        setName(userName)
        setEmail(userEmail)
        setError("")
        setIsEditing(true)
    }

    function handleCancelEdit() {
        setName(userName)
        setEmail(userEmail)
        setError("")
        setIsEditing(false)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")

        const validationError = validateProfileForm(name, email)

        if (validationError) {
            setError(validationError)

            showToast({
                type: "error",
                title: "Erro ao atualizar perfil",
                description: validationError,
            })

            return
        }

        try {
            const updatedUser = await updateProfile(name, email)

            setName(updatedUser.name)
            setEmail(updatedUser.email)
            setIsEditing(false)

            showToast({
                type: "success",
                title: "Perfil atualizado",
                description:
                    dataMode === "supabase"
                        ? "Nome e e-mail foram sincronizados."
                        : "Nome e e-mail foram salvos localmente.",
            })
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)

                showToast({
                    type: "error",
                    title: "Não foi possível atualizar",
                    description: err.message,
                })
            }
        }
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="User profile"
                title="Profile"
                description="Resumo da conta, modo de dados, produtividade e atividade no Lynflow."
                action={
                    <Button
                        variant="secondary"
                        icon={<Settings size={18} />}
                        onClick={() => navigate("/settings")}
                    >
                        Configurações
                    </Button>
                }
            />

            <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <SectionCard
                    title={dataMode === "supabase" ? "Conta Supabase" : "Conta local"}
                    description={
                        dataMode === "supabase"
                            ? "Dados sincronizados com backend."
                            : "Dados salvos no navegador."
                    }
                    action={
                        isEditing ? (
                            <Button
                                variant="secondary"
                                icon={<X size={18} />}
                                onClick={handleCancelEdit}
                            >
                                Cancelar
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                icon={<Pencil size={18} />}
                                onClick={handleStartEdit}
                            >
                                Editar perfil
                            </Button>
                        )
                    }
                >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-[var(--primary)] text-3xl font-bold text-[var(--primary-text)]">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold">{userName}</h2>
                            <p className="ly-muted mt-1 break-all text-sm">{userEmail}</p>

                            <div className="mt-4 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-500">
                                {syncStatus.syncLabel}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                        <p className="font-medium">
                            Modo atual: {syncStatus.modeLabel}
                        </p>

                        <p className="ly-muted mt-2 text-sm leading-6">
                            {syncStatus.description}
                        </p>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            {error && (
                                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="profile-name" className="mb-2 block text-sm">
                                    Nome
                                </label>

                                <Input
                                    id="profile-name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Seu nome"
                                    title="Editar nome"
                                    aria-label="Editar nome"
                                    autoComplete="name"
                                />
                            </div>

                            <div>
                                <label htmlFor="profile-email" className="mb-2 block text-sm">
                                    E-mail
                                </label>

                                <Input
                                    id="profile-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="seu@email.com"
                                    title="Editar e-mail"
                                    aria-label="Editar e-mail"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="flex flex-col gap-3 md:flex-row">
                                <Button
                                    type="submit"
                                    icon={<Save size={18} />}
                                    disabled={!hasProfileChanges}
                                >
                                    Salvar alterações
                                </Button>

                                <Button
                                    variant="secondary"
                                    icon={<X size={18} />}
                                    onClick={handleCancelEdit}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-6 space-y-4">
                            <InfoRow label="Nome" value={userName} />
                            <InfoRow label="E-mail" value={userEmail} />
                            <InfoRow
                                label="Persistência"
                                value={dataMode === "supabase" ? "Supabase" : "localStorage"}
                            />
                            <InfoRow
                                label="Sincronização"
                                value={syncStatus.syncLabel}
                            />
                            <InfoRow
                                label="Último sync"
                                value={syncStatus.lastSyncedAtLabel}
                                bordered={false}
                            />
                        </div>
                    )}
                </SectionCard>

                <SectionCard
                    title="Produtividade pessoal"
                    description="Resumo do desempenho com base nas tarefas atuais."
                >
                    <div className="space-y-6">
                        <ProgressBar label="Produtividade geral" value={productivity} />

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <p className="text-sm leading-6 text-[var(--text)] opacity-85">
                                Status atual: <strong>{productivityLabel}</strong>. Você tem{" "}
                                <strong>{completedTasks}</strong> tarefa(s) concluída(s) e{" "}
                                <strong>{pendingTasks}</strong> pendente(s).
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Button
                                variant="secondary"
                                icon={<LayoutDashboard size={18} />}
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </Button>

                            <Button
                                variant="secondary"
                                icon={<CheckCircle2 size={18} />}
                                onClick={() => navigate("/tasks")}
                            >
                                Tarefas
                            </Button>

                            <Button
                                variant="secondary"
                                icon={<Target size={18} />}
                                onClick={() => navigate("/goals")}
                            >
                                Metas
                            </Button>
                        </div>
                    </div>
                </SectionCard>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <MetricCard
                    title="Produtividade"
                    value={`${productivity}%`}
                    description={productivityLabel}
                    icon={<BarChart3 size={20} className="ly-accent" />}
                />

                <MetricCard
                    title="Total"
                    value={tasks.length}
                    description="Tarefas registradas."
                    icon={<CheckCircle2 size={20} className="ly-accent" />}
                    delay={0.05}
                />

                <MetricCard
                    title="Pendentes"
                    value={pendingTasks}
                    description="Itens em aberto."
                    icon={<Clock3 size={20} className="ly-warning" />}
                    delay={0.1}
                />

                <MetricCard
                    title="Alta prioridade"
                    value={highPriorityTasks}
                    description="Itens críticos."
                    icon={<Target size={20} className="ly-danger" />}
                    delay={0.15}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.85fr]">
                <SectionCard
                    title="Categorias usadas"
                    description="Categorias criadas a partir das tarefas atuais."
                >
                    {categories.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted-soft)]">
                            Nenhuma categoria encontrada.
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <span
                                    key={category}
                                    className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm text-[var(--muted)]"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                </SectionCard>

                <SectionCard title="Resumo da atividade">
                    <div className="space-y-4">
                        <InfoRow label="Tarefas totais" value={tasks.length} />
                        <InfoRow label="Concluídas" value={completedTasks} />
                        <InfoRow label="Pendentes" value={pendingTasks} />
                        <InfoRow label="Alta prioridade" value={highPriorityTasks} />
                        <InfoRow
                            label="Categorias"
                            value={categories.length}
                            bordered={false}
                        />
                    </div>
                </SectionCard>
            </section>
        </div>
    )
}
