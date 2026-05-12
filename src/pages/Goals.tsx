import { motion } from "framer-motion"
import { Target, CheckCircle2, Flame } from "lucide-react"
import { useTasks } from "../hooks/useTasks"

export function Goals() {
    const { productivity, completedTasks, pendingTasks } = useTasks()

    return (
        <div className="ly-page px-4 py-6 md:px-8">
            <header className="mb-8">
                <p className="ly-muted-soft text-sm">Progress system</p>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Goals
                </h1>

                <p className="ly-muted mt-2">
                    Acompanhe metas semanais e evolução do projeto.
                </p>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ly-card rounded-3xl p-5"
                >
                    <div className="mb-4 flex items-center gap-2">
                        <Target className="ly-accent" />
                        <h2 className="text-xl font-semibold">Finalizar MVP</h2>
                    </div>

                    <p className="ly-muted text-sm">
                        Completar as páginas principais, tarefas, dashboard, tema e README.
                    </p>

                    <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm">
                            <span className="ly-muted-soft">Progresso</span>
                            <span>{productivity}%</span>
                        </div>

                        <div className="ly-progress-track h-2 overflow-hidden rounded-full">
                            <div
                                className="ly-progress-fill h-full rounded-full"
                                style={{ width: `${productivity}%` }}
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="ly-card rounded-3xl p-5"
                >
                    <div className="mb-4 flex items-center gap-2">
                        <CheckCircle2 className="ly-accent" />
                        <h2 className="text-xl font-semibold">Tarefas concluídas</h2>
                    </div>

                    <h3 className="text-4xl font-bold">{completedTasks}</h3>

                    <p className="ly-muted mt-3 text-sm">
                        Quanto mais tarefas concluídas, mais forte fica a apresentação do
                        projeto.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="ly-card rounded-3xl p-5"
                >
                    <div className="mb-4 flex items-center gap-2">
                        <Flame className="ly-warning" />
                        <h2 className="text-xl font-semibold">Pendências</h2>
                    </div>

                    <h3 className="text-4xl font-bold">{pendingTasks}</h3>

                    <p className="ly-muted mt-3 text-sm">
                        Priorize as tarefas de maior impacto para publicar o projeto.
                    </p>
                </motion.div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div className="ly-card rounded-3xl p-6">
                    <h2 className="text-xl font-semibold">Plano da semana</h2>

                    <div className="mt-5 space-y-4">
                        {[
                            "Finalizar UI responsiva",
                            "Preparar screenshots do projeto",
                            "Escrever README profissional",
                            "Fazer deploy na Vercel",
                        ].map((item, index) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-sm text-emerald-500">
                                    {index + 1}
                                </span>

                                <span className="text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                    <h2 className="text-xl font-semibold">Meta principal</h2>

                    <p className="mt-3 text-sm leading-6 text-[var(--text)] opacity-80">
                        Deixar o Lynflow pronto para ser publicado no GitHub, com visual
                        consistente, README forte e deploy funcionando.
                    </p>
                </div>
            </section>
        </div>
    )
}