import { useEffect, useMemo, useState } from "react"
import {
    CheckCircle2,
    ClipboardCheck,
    MonitorSmartphone,
    RefreshCcw,
    Rocket,
    Terminal,
} from "lucide-react"
import { Button } from "../ui/Button"
import { ProgressBar } from "../ui/ProgressBar"
import { useToast } from "../ui/ToastProvider"

type ChecklistItem = {
    id: string
    title: string
    description: string
    icon: "terminal" | "responsive" | "docs" | "rocket" | "check"
}

const CHECKLIST_KEY = "lynflow-deploy-checklist"

const checklistItems: ChecklistItem[] = [
    {
        id: "build",
        title: "Build sem erros",
        description:
            "Rodar npm run build e corrigir todos os erros TypeScript/Vite.",
        icon: "terminal",
    },
    {
        id: "routes",
        title: "Rotas testadas",
        description:
            "Testar login, register, dashboard, tasks, activity, profile e settings.",
        icon: "check",
    },
    {
        id: "responsive",
        title: "Responsividade revisada",
        description:
            "Validar layout em 320px, 375px, 430px, 768px, 1024px e desktop.",
        icon: "responsive",
    },
    {
        id: "readme",
        title: "README finalizado",
        description:
            "Adicionar descrição, funcionalidades, tecnologias, instalação e deploy.",
        icon: "docs",
    },
    {
        id: "screenshots",
        title: "Prints ou GIF adicionados",
        description:
            "Salvar preview do Dashboard, Tasks, Activity e Landing no projeto.",
        icon: "docs",
    },
    {
        id: "vercel",
        title: "Deploy publicado",
        description: "Publicar o projeto na Vercel e testar a URL final.",
        icon: "rocket",
    },
    {
        id: "portfolio",
        title: "Link pronto para portfólio",
        description: "Adicionar o link do deploy no GitHub, LinkedIn e currículo.",
        icon: "rocket",
    },
]

function getInitialCheckedItems() {
    const savedChecklist = localStorage.getItem(CHECKLIST_KEY)

    if (!savedChecklist) {
        return []
    }

    try {
        const parsedChecklist = JSON.parse(savedChecklist)

        if (!Array.isArray(parsedChecklist)) {
            localStorage.removeItem(CHECKLIST_KEY)
            return []
        }

        return parsedChecklist.filter((item) => typeof item === "string")
    } catch {
        localStorage.removeItem(CHECKLIST_KEY)
        return []
    }
}

function getIcon(icon: ChecklistItem["icon"]) {
    if (icon === "terminal") {
        return <Terminal size={18} />
    }

    if (icon === "responsive") {
        return <MonitorSmartphone size={18} />
    }

    if (icon === "docs") {
        return <ClipboardCheck size={18} />
    }

    if (icon === "rocket") {
        return <Rocket size={18} />
    }

    return <CheckCircle2 size={18} />
}

export function DeployChecklist() {
    const { showToast } = useToast()

    const [checkedItems, setCheckedItems] = useState<string[]>(
        getInitialCheckedItems
    )

    useEffect(() => {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checkedItems))
    }, [checkedItems])

    const completedItems = checkedItems.length

    const progress = useMemo(() => {
        return Math.round((completedItems / checklistItems.length) * 100)
    }, [completedItems])

    const isCompleted = progress === 100

    function toggleItem(id: string) {
        setCheckedItems((currentItems) => {
            if (currentItems.includes(id)) {
                return currentItems.filter((item) => item !== id)
            }

            return [...currentItems, id]
        })
    }

    function resetChecklist() {
        setCheckedItems([])

        showToast({
            type: "info",
            title: "Checklist resetado",
            description: "Todos os itens pré-deploy foram desmarcados.",
        })
    }

    function markAllAsDone() {
        setCheckedItems(checklistItems.map((item) => item.id))

        showToast({
            type: "success",
            title: "Checklist concluído",
            description: "Todos os itens pré-deploy foram marcados.",
        })
    }

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <ClipboardCheck size={20} className="ly-accent" />
                            <h3 className="font-semibold">Checklist de publicação</h3>
                        </div>

                        <p className="ly-muted-soft mt-1 text-sm leading-6">
                            Use esta lista para fechar o Lynflow com segurança antes de
                            publicar no portfólio.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<RefreshCcw size={16} />}
                            onClick={resetChecklist}
                            disabled={checkedItems.length === 0}
                        >
                            Resetar
                        </Button>

                        <Button
                            size="sm"
                            icon={<CheckCircle2 size={16} />}
                            onClick={markAllAsDone}
                            disabled={isCompleted}
                        >
                            Marcar tudo
                        </Button>
                    </div>
                </div>

                <ProgressBar
                    label={`${completedItems} de ${checklistItems.length} itens concluídos`}
                    value={progress}
                />

                {isCompleted && (
                    <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-500">
                        O checklist está completo. O projeto está pronto para a etapa de
                        deploy e apresentação.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {checklistItems.map((item) => {
                    const isChecked = checkedItems.includes(item.id)

                    return (
                        <label
                            key={item.id}
                            className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${isChecked
                                ? "border-emerald-500/20 bg-emerald-500/10"
                                : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--muted-soft)]"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleItem(item.id)}
                                className="mt-1 h-4 w-4 accent-emerald-500"
                                aria-label={item.title}
                                title={item.title}
                            />

                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${isChecked
                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                                    }`}
                            >
                                {getIcon(item.icon)}
                            </div>

                            <div className="min-w-0">
                                <p
                                    className={`font-medium ${isChecked ? "text-emerald-500" : "text-[var(--text)]"
                                        }`}
                                >
                                    {item.title}
                                </p>

                                <p className="ly-muted mt-1 text-sm leading-6">
                                    {item.description}
                                </p>
                            </div>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}