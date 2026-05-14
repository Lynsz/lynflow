import { useMemo, useState } from "react"
import {
    AlertTriangle,
    BarChart3,
    Brain,
    CheckCircle2,
    ClipboardList,
    Loader2,
    Sparkles,
    Wand2,
    WifiOff,
} from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import { Button } from "../components/ui/Button"
import { InfoRow } from "../components/ui/InfoRow"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"
import {
    buildAiInsightsPayload,
    generateAiInsights,
    generateLocalAiInsights,
    type AiInsight,
    type AiIntegrationStatus,
    type AiInsightsProvider,
} from "../services/aiInsights"

const aiCards = [
    {
        title: "Organizar rotina",
        description:
            "Transformar tarefas soltas em uma sequencia clara de execucao.",
    },
    {
        title: "Sugerir prioridades",
        description:
            "Identificar o que precisa ser feito primeiro para gerar mais progresso.",
    },
    {
        title: "Preparar portfolio",
        description:
            "Converter o progresso do projeto em evidencias para GitHub e LinkedIn.",
    },
]

export function Insights() {
    const {
        tasks,
        completedTasks,
        productivity,
        pendingTasks,
        highPriorityTasks,
    } = useTasks()

    const payload = useMemo(() => buildAiInsightsPayload({ tasks }), [tasks])

    const [status, setStatus] = useState<AiIntegrationStatus>("idle")
    const [provider, setProvider] = useState<AiInsightsProvider>("local")
    const [message, setMessage] = useState(
        "Clique em gerar sugestao para analisar suas tarefas com IA ou fallback local."
    )
    const [insights, setInsights] = useState<AiInsight[]>(() =>
        generateLocalAiInsights(payload)
    )

    async function handleGenerateInsights() {
        setStatus("loading")

        const result = await generateAiInsights({ tasks })

        setStatus(result.status)
        setProvider(result.provider)
        setMessage(result.message)
        setInsights(result.insights)
    }

    function getStatusLabel() {
        if (status === "loading") return "Gerando..."
        if (status === "success") return "IA real ativa"
        if (status === "error") return "Erro"
        if (status === "fallback") return "Fallback local"

        return "Pronto para gerar"
    }

    function getStatusIcon() {
        if (status === "loading") {
            return <Loader2 size={18} className="animate-spin" />
        }

        if (status === "success") {
            return <CheckCircle2 size={18} />
        }

        if (status === "fallback") {
            return <WifiOff size={18} />
        }

        if (status === "error") {
            return <AlertTriangle size={18} />
        }

        return <Sparkles size={18} />
    }

    function getInsightClass(tone: AiInsight["tone"]) {
        if (tone === "positive") {
            return "border-emerald-500/20 bg-emerald-500/5"
        }

        if (tone === "warning") {
            return "border-amber-500/20 bg-amber-500/5"
        }

        if (tone === "critical") {
            return "border-red-500/20 bg-red-500/5"
        }

        return "border-[var(--border)] bg-[var(--surface-strong)]"
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="AI assistant"
                title="AI Insights"
                description="Recomendacoes opcionais com IA real, sempre protegidas por fallback local."
                action={
                    <Button
                        size="lg"
                        icon={
                            status === "loading" ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Wand2 size={18} />
                            )
                        }
                        onClick={handleGenerateInsights}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Gerando..." : "Gerar novamente"}
                    </Button>
                }
            />

            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <MetricCard
                    title="Tarefas analisadas"
                    value={tasks.length}
                    description="Quantidade total enviada no payload seguro."
                    icon={<ClipboardList size={20} className="ly-accent" />}
                />

                <MetricCard
                    title="Produtividade"
                    value={`${productivity}%`}
                    description="Baseada nas tarefas concluidas."
                    icon={<BarChart3 size={20} className="ly-accent" />}
                    delay={0.05}
                />

                <MetricCard
                    title="Alta prioridade"
                    value={highPriorityTasks}
                    description="Itens que exigem foco primeiro."
                    icon={<Brain size={20} className="ly-warning" />}
                    delay={0.1}
                />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.8fr]">
                <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="ly-button-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                                <Sparkles size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Resumo inteligente
                                </h2>
                                <p className="ly-muted-soft text-sm">
                                    {provider === "openai"
                                        ? "Gerado por IA real no servidor."
                                        : "Gerado localmente no navegador."}
                                </p>
                            </div>
                        </div>

                        <div className="ly-button-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                            {getStatusIcon()}
                        </div>
                    </div>

                    <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <strong>{getStatusLabel()}</strong>
                            <span className="ly-muted-soft text-sm">
                                Provedor: {provider === "openai" ? "OpenAI" : "Local"}
                            </span>
                        </div>

                        <p className="ly-muted mt-2 text-sm leading-6">{message}</p>
                    </div>

                    <div className="space-y-3">
                        {insights.map((insight) => (
                            <article
                                key={insight.id}
                                className={`rounded-2xl border p-4 ${getInsightClass(
                                    insight.tone
                                )}`}
                            >
                                <h3 className="font-semibold">{insight.title}</h3>
                                <p className="ly-muted mt-2 text-sm leading-6">
                                    {insight.description}
                                </p>
                                <p className="mt-3 text-sm font-medium text-[var(--text)]">
                                    {insight.action}
                                </p>
                            </article>
                        ))}
                    </div>

                    <Button
                        className="mt-6"
                        icon={
                            status === "loading" ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Wand2 size={18} />
                            )
                        }
                        onClick={handleGenerateInsights}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Gerando..." : "Gerar nova sugestao"}
                    </Button>
                </section>

                <SectionCard title="Dados analisados">
                    <div className="space-y-4">
                        <InfoRow label="Total de tarefas" value={tasks.length} />
                        <InfoRow label="Concluidas" value={completedTasks} />
                        <InfoRow label="Pendentes" value={pendingTasks} />
                        <InfoRow
                            label="Atrasadas"
                            value={payload.summary.overdueTasks}
                        />
                        <InfoRow label="Alta prioridade" value={highPriorityTasks} />
                        <InfoRow
                            label="Prazos proximos"
                            value={payload.summary.upcomingDueTasks.length}
                        />
                        <InfoRow
                            label="Recorrencias"
                            value={payload.summary.recurringTasks.length}
                        />
                        <InfoRow
                            label="Produtividade"
                            value={`${productivity}%`}
                            bordered={false}
                        />
                    </div>
                </SectionCard>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
                {aiCards.map((item) => (
                    <SectionCard key={item.title} title={item.title}>
                        <p className="ly-muted text-sm leading-6">
                            {item.description}
                        </p>
                    </SectionCard>
                ))}
            </section>
        </div>
    )
}
