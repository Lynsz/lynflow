import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Wand2 } from "lucide-react"
import { useTasks } from "../hooks/useTasks"

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
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1f2937_0,#09090b_40%,#000_100%)] px-4 py-6 md:px-8">
            <header className="mb-8">
                <p className="text-sm text-zinc-500">AI assistant</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    AI Insights
                </h1>
                <p className="mt-2 text-zinc-400">
                    Simulação de sugestões inteligentes para organizar sua rotina.
                </p>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.8fr]">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6"
                >
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                            <Sparkles size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">Resumo inteligente</h2>
                            <p className="text-sm text-zinc-500">
                                Baseado nas tarefas salvas localmente.
                            </p>
                        </div>
                    </div>

                    <p className="text-base leading-7 text-zinc-200">{insight}</p>

                    <button
                        onClick={generateInsight}
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 active:scale-[0.98]"
                    >
                        <Wand2 size={18} />
                        Gerar sugestão
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6"
                >
                    <h2 className="text-xl font-semibold">Dados analisados</h2>

                    <div className="mt-5 space-y-4 text-sm">
                        <div className="flex justify-between border-b border-zinc-800 pb-3">
                            <span className="text-zinc-500">Total de tarefas</span>
                            <span>{tasks.length}</span>
                        </div>

                        <div className="flex justify-between border-b border-zinc-800 pb-3">
                            <span className="text-zinc-500">Pendentes</span>
                            <span>{pendingTasks}</span>
                        </div>

                        <div className="flex justify-between border-b border-zinc-800 pb-3">
                            <span className="text-zinc-500">Alta prioridade</span>
                            <span>{highPriorityTasks}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-zinc-500">Produtividade</span>
                            <span>{productivity}%</span>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}