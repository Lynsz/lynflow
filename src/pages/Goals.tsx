import { motion } from "framer-motion"
import { Target, CheckCircle2, Flame } from "lucide-react"
import { useTasks } from "../hooks/useTasks"

export function Goals() {
    const { productivity, completedTasks, pendingTasks } = useTasks()

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1f2937_0,#09090b_40%,#000_100%)] px-4 py-6 md:px-8">
            <header className="mb-8">
                <p className="text-sm text-zinc-500">Progress system</p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Goals
                </h1>
                <p className="mt-2 text-zinc-400">
                    Acompanhe metas semanais e evolução do projeto.
                </p>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                    <div className="mb-4 flex items-center gap-2">
                        <Target className="text-emerald-400" />
                        <h2 className="text-xl font-semibold">Finalizar MVP</h2>
                    </div>

                    <p className="text-sm text-zinc-400">
                        Completar as páginas principais, tarefas, dashboard e README.
                    </p>

                    <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-zinc-500">Progresso</span>
                            <span>{productivity}%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                            <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${productivity}%` }}
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                    <div className="mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-400" />
                        <h2 className="text-xl font-semibold">Tarefas concluídas</h2>
                    </div>

                    <h3 className="text-4xl font-bold">{completedTasks}</h3>

                    <p className="mt-3 text-sm text-zinc-400">
                        Quanto mais tarefas concluídas, mais forte fica a apresentação do
                        projeto.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                    <div className="mb-4 flex items-center gap-2">
                        <Flame className="text-yellow-400" />
                        <h2 className="text-xl font-semibold">Pendências</h2>
                    </div>

                    <h3 className="text-4xl font-bold">{pendingTasks}</h3>

                    <p className="mt-3 text-sm text-zinc-400">
                        Priorize as tarefas de maior impacto para publicar o projeto.
                    </p>
                </motion.div>
            </section>
        </div>
    )
}