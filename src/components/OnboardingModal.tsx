import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
    ArrowRight,
    BarChart3,
    CheckSquare,
    Command,
    History,
    Sparkles,
    Target,
    X,
} from "lucide-react"
import { Button } from "./ui/Button"

const ONBOARDING_KEY = "lynflow-onboarding-completed"

const onboardingSteps = [
    {
        title: "Organize suas tarefas",
        description:
            "Crie tarefas com categoria, prioridade e status. Depois use filtros, busca e drag and drop para manter tudo em ordem.",
        icon: CheckSquare,
    },
    {
        title: "Acompanhe progresso",
        description:
            "O Dashboard transforma suas tarefas em métricas, gráficos e insights para entender sua produtividade.",
        icon: BarChart3,
    },
    {
        title: "Defina metas",
        description:
            "Use a página Goals para acompanhar o progresso geral do MVP e visualizar o que ainda precisa ser finalizado.",
        icon: Target,
    },
    {
        title: "Use atalhos rápidos",
        description:
            "Pressione Ctrl + K para abrir a Command Palette ou use atalhos como G + D, G + T e N para navegar rápido.",
        icon: Command,
    },
    {
        title: "Revise atividades",
        description:
            "O Lynflow registra ações importantes em um histórico local para você acompanhar mudanças recentes.",
        icon: History,
    },
]

function completeOnboarding() {
    localStorage.setItem(ONBOARDING_KEY, "true")
}

export function OnboardingModal() {
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const [activeStep, setActiveStep] = useState(0)

    const currentStep = onboardingSteps[activeStep]
    const CurrentStepIcon = currentStep.icon
    const isLastStep = activeStep === onboardingSteps.length - 1

    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY)

        if (!hasCompletedOnboarding) {
            const timeoutId = window.setTimeout(() => {
                setIsOpen(true)
            }, 500)

            return () => {
                window.clearTimeout(timeoutId)
            }
        }
    }, [])

    useEffect(() => {
        function handleOpenOnboarding() {
            setActiveStep(0)
            setIsOpen(true)
        }

        window.addEventListener("lynflow-open-onboarding", handleOpenOnboarding)

        return () => {
            window.removeEventListener(
                "lynflow-open-onboarding",
                handleOpenOnboarding
            )
        }
    }, [])

    function handleClose() {
        completeOnboarding()
        setIsOpen(false)
    }

    function handleNextStep() {
        if (isLastStep) {
            handleClose()
            return
        }

        setActiveStep((currentValue) => currentValue + 1)
    }

    function handlePreviousStep() {
        setActiveStep((currentValue) => Math.max(0, currentValue - 1))
    }

    function handleGoToTasks() {
        completeOnboarding()
        setIsOpen(false)

        navigate("/tasks", {
            state: {
                focusNewTask: true,
                shortcutAt: Date.now(),
            },
        })

        window.setTimeout(() => {
            window.dispatchEvent(new CustomEvent("lynflow-focus-new-task"))
        }, 150)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Fechar onboarding"
                        title="Fechar onboarding"
                        className="fixed inset-0 z-[9994] bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="onboarding-title"
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        className="fixed left-1/2 top-1/2 z-[9995] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] shadow-2xl shadow-black/30"
                    >
                        <div className="border-b border-[var(--border)] p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-text)]">
                                        <Sparkles size={22} />
                                    </div>

                                    <p className="ly-muted-soft text-xs uppercase tracking-[0.24em]">
                                        Welcome to Lynflow
                                    </p>

                                    <h2
                                        id="onboarding-title"
                                        className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
                                    >
                                        Comece seu fluxo de produtividade
                                    </h2>

                                    <p className="ly-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                                        O Lynflow é um dashboard local para organizar tarefas,
                                        acompanhar progresso e demonstrar domínio de React,
                                        TypeScript, UI e arquitetura front-end.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    aria-label="Fechar onboarding"
                                    title="Fechar onboarding"
                                    className="rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="grid max-h-[calc(100dvh-14rem)] grid-cols-1 overflow-y-auto lg:grid-cols-[260px_1fr]">
                            <aside className="border-b border-[var(--border)] p-4 lg:border-b-0 lg:border-r">
                                <div className="grid grid-cols-1 gap-2">
                                    {onboardingSteps.map((step, index) => {
                                        const Icon = step.icon
                                        const isActive = index === activeStep

                                        return (
                                            <button
                                                key={step.title}
                                                type="button"
                                                onClick={() => setActiveStep(index)}
                                                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${isActive
                                                        ? "ly-button-primary"
                                                        : "ly-muted hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                                    }`}
                                            >
                                                <Icon size={18} />

                                                <span className="min-w-0 truncate">
                                                    {step.title}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </aside>

                            <main className="p-5 sm:p-6">
                                <motion.div
                                    key={currentStep.title}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="min-h-[260px]"
                                >
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]">
                                        <CurrentStepIcon size={30} />
                                    </div>

                                    <p className="ly-muted-soft text-sm">
                                        Etapa {activeStep + 1} de {onboardingSteps.length}
                                    </p>

                                    <h3 className="mt-2 text-2xl font-semibold">
                                        {currentStep.title}
                                    </h3>

                                    <p className="ly-muted mt-3 text-sm leading-7 sm:text-base">
                                        {currentStep.description}
                                    </p>

                                    <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                        <p className="text-sm leading-6 text-[var(--text)] opacity-85">
                                            Dica: este MVP usa dados locais no navegador. Isso é
                                            ideal para portfólio porque mostra interface, lógica,
                                            estado global, persistência local e experiência de produto
                                            sem depender de backend.
                                        </p>
                                    </div>
                                </motion.div>

                                <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        {onboardingSteps.map((step, index) => (
                                            <button
                                                key={step.title}
                                                type="button"
                                                onClick={() => setActiveStep(index)}
                                                aria-label={`Ir para etapa ${index + 1}`}
                                                title={`Ir para etapa ${index + 1}`}
                                                className={`h-2.5 rounded-full transition-all ${index === activeStep
                                                        ? "w-8 bg-[var(--accent)]"
                                                        : "w-2.5 bg-[var(--border)]"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                        {activeStep > 0 && (
                                            <Button
                                                variant="secondary"
                                                onClick={handlePreviousStep}
                                            >
                                                Voltar
                                            </Button>
                                        )}

                                        <Button variant="secondary" onClick={handleGoToTasks}>
                                            Criar tarefa
                                        </Button>

                                        <Button
                                            icon={<ArrowRight size={18} />}
                                            onClick={handleNextStep}
                                        >
                                            {isLastStep ? "Finalizar" : "Próximo"}
                                        </Button>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}