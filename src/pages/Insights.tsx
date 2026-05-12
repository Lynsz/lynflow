import { useState } from "react"
import { BarChart3, Brain, ClipboardList, Sparkles, Wand2 } from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import { Button } from "../components/ui/Button"
import { InfoRow } from "../components/ui/InfoRow"
import { MetricCard } from "../components/ui/MetricCard"
import { PageHeader } from "../components/ui/PageHeader"
import { SectionCard } from "../components/ui/SectionCard"

const aiCards = [
    {
        title: "Organizar rotina",
        description:
            "Transformar tarefas soltas em uma sequência clara de execução.",
    },
    {
        title: "Sugerir prioridades",
        description:
            "Identificar o que precisa ser feito primeiro para gerar mais progresso.",
    },
    {
        title: "Preparar portfólio",
        description:
            "Converter o progresso do projeto em evidências para GitHub e LinkedIn.",
    },
]

export function Insights() {
    const { tasks, productivity, pendingTasks, highPriorityTasks } = useTasks()

    const [insight, setInsight] = useState(
        "Clique em gerar sugestão para receber uma análise simples da sua rotina."
    )

    function generateInsight() {
        if (tasks.length === 0) {
            setInsight(
                "Você ainda não tem tarefas cadastradas. Comece criando 3 tarefas: uma de estudo, uma de projeto e uma de portfólio."
            )
            return
        }

        if (highPriorityTasks > 0) {
            setInsight(
                `Você tem ${highPriorityTasks} tarefa(s) de alta prioridade. Foque nelas antes de adicionar novas demandas.`
            )
            return
        }

        if (productivity < 50) {
            setInsight(
                "Sua produtividade está abaixo de 50%. Reduza a quantidade de tarefas abertas e conclua primeiro as mais simples."
            )
            return
        }

        setInsight(
            "Seu fluxo está bom. Próximo passo: separar tarefas por categoria e transformar isso em prints para o README."
        )
    }

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <PageHeader
                eyebrow="AI assistant"
                title="AI Insights"
                description="Simulação de sugestões inteligentes para organizar sua rotina."
                action={
                    <Button
                        size="lg"
                        icon={<Wand2 size={18} />}
                        onClick={generateInsight}
                    >
                        Gerar sugestão
                    </Button>
                }
            />

            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <MetricCard
                    title="Tarefas analisadas"
                    value={tasks.length}
                    description="Quantidade total usada na simulação."
                    icon={<ClipboardList size={20} className="ly-accent" />}
                />

                <MetricCard
                    title="Produtividade"
                    value={`${productivity}%`}
                    description="Baseada nas tarefas concluídas."
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
                    <div className="mb-5 flex items-center gap-3">
                        <div className="ly-button-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                            <Sparkles size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">Resumo inteligente</h2>
                            <p className="ly-muted-soft text-sm">
                                Baseado nas tarefas salvas localmente.
                            </p>
                        </div>
                    </div>

                    <p className="text-base leading-7 text-[var(--text)] opacity-85">
                        {insight}
                    </p>

                    <Button
                        className="mt-6"
                        icon={<Wand2 size={18} />}
                        onClick={generateInsight}
                    >
                        Gerar nova sugestão
                    </Button>
                </section>

                <SectionCard title="Dados analisados">
                    <div className="space-y-4">
                        <InfoRow label="Total de tarefas" value={tasks.length} />
                        <InfoRow label="Pendentes" value={pendingTasks} />
                        <InfoRow label="Alta prioridade" value={highPriorityTasks} />
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