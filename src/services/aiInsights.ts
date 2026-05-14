import type { Task, TaskRecurrence } from "../types/task"
import { createLocalDate } from "../utils/date"
import { getTaskFlowStatus } from "../utils/taskStatus"
import {
    getTaskRecurrenceLabel,
    hasActiveRecurrence,
    normalizeTaskRecurrence,
} from "../utils/taskRecurrence"

export type AiInsightTone = "positive" | "warning" | "critical" | "neutral"

export type AiInsight = {
    id: string
    title: string
    description: string
    action: string
    tone: AiInsightTone
}

export type AiInsightsSummary = {
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    overdueTasks: number
    highPriorityTasks: number
    completionRate: number
    categories: Array<{
        name: string
        total: number
    }>
    upcomingDueTasks: Array<{
        title: string
        dueDate: string
        priority: Task["priority"]
    }>
    recurringTasks: Array<{
        title: string
        recurrence: TaskRecurrence
        label: string
    }>
}

export type AiInsightsInput = {
    tasks: Task[]
    referenceDate?: Date
}

export type AiInsightsPayload = {
    generatedAt: string
    summary: AiInsightsSummary
}

export type AiIntegrationStatus =
    | "idle"
    | "loading"
    | "success"
    | "error"
    | "fallback"

export type AiInsightsProvider = "openai" | "local"

export type AiInsightsResult = {
    status: Exclude<AiIntegrationStatus, "idle" | "loading">
    provider: AiInsightsProvider
    message: string
    insights: AiInsight[]
    payload: AiInsightsPayload
}

type RemoteAiInsightsResult = {
    insights: AiInsight[]
    message?: string
}

type Fetcher = (
    input: string,
    init: {
        method: "POST"
        headers: Record<string, string>
        body: string
    }
) => Promise<Pick<Response, "json" | "ok">>

type GenerateAiInsightsOptions = {
    endpoint?: string
    fetcher?: Fetcher
    isOnline?: boolean
}

const DEFAULT_ENDPOINT = "/api/ai-insights"
const UPCOMING_DAYS = 7

function calculateCompletionRate(total: number, completed: number) {
    if (total === 0) {
        return 0
    }

    return Math.round((completed / total) * 100)
}

function sortByDueDate(a: { dueDate: string }, b: { dueDate: string }) {
    return a.dueDate.localeCompare(b.dueDate)
}

function getDaysUntilDueDate(dueDate: string, referenceDate: Date) {
    const dueDateValue = createLocalDate(dueDate)
    const referenceDateValue = new Date(referenceDate)

    referenceDateValue.setHours(0, 0, 0, 0)

    const diffMs = dueDateValue.getTime() - referenceDateValue.getTime()

    return Math.ceil(diffMs / 86_400_000)
}

function getCategorySummary(tasks: Task[]) {
    const categoryCount = tasks.reduce<Record<string, number>>((acc, task) => {
        const category = task.category.trim() || "Geral"

        acc[category] = (acc[category] ?? 0) + 1

        return acc
    }, {})

    return Object.entries(categoryCount)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
}

function createInsight(
    id: string,
    title: string,
    description: string,
    action: string,
    tone: AiInsightTone
): AiInsight {
    return {
        id,
        title,
        description,
        action,
        tone,
    }
}

function normalizeRemoteInsight(value: unknown, index: number): AiInsight | null {
    if (!value || typeof value !== "object") {
        return null
    }

    const candidate = value as Partial<AiInsight>
    const validTone: AiInsightTone[] = ["positive", "warning", "critical", "neutral"]

    if (
        typeof candidate.title !== "string" ||
        typeof candidate.description !== "string" ||
        typeof candidate.action !== "string"
    ) {
        return null
    }

    return {
        id:
            typeof candidate.id === "string" && candidate.id.trim()
                ? candidate.id
                : `remote-${index + 1}`,
        title: candidate.title,
        description: candidate.description,
        action: candidate.action,
        tone:
            typeof candidate.tone === "string" &&
                validTone.includes(candidate.tone as AiInsightTone)
                ? (candidate.tone as AiInsightTone)
                : "neutral",
    }
}

function normalizeRemoteResponse(value: unknown): RemoteAiInsightsResult | null {
    if (!value || typeof value !== "object") {
        return null
    }

    const response = value as {
        insights?: unknown
        message?: unknown
    }

    if (!Array.isArray(response.insights)) {
        return null
    }

    const insights = response.insights
        .map(normalizeRemoteInsight)
        .filter((insight): insight is AiInsight => Boolean(insight))

    if (insights.length === 0) {
        return null
    }

    return {
        insights,
        message:
            typeof response.message === "string"
                ? response.message
                : "Recomendacoes geradas pela IA real.",
    }
}

export function buildAiInsightsPayload({
    tasks,
    referenceDate = new Date(),
}: AiInsightsInput): AiInsightsPayload {
    const completedTasks = tasks.filter((task) => task.done).length
    const overdueTasks = tasks.filter(
        (task) => getTaskFlowStatus(task, referenceDate) === "overdue"
    ).length
    const pendingTasks = tasks.filter(
        (task) => getTaskFlowStatus(task, referenceDate) === "pending"
    ).length
    const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

    const upcomingDueTasks = tasks
        .filter((task) => !task.done && task.dueDate)
        .map((task) => ({
            title: task.title,
            dueDate: task.dueDate ?? "",
            priority: task.priority,
            daysUntilDueDate: task.dueDate
                ? getDaysUntilDueDate(task.dueDate, referenceDate)
                : Number.POSITIVE_INFINITY,
        }))
        .filter(
            (task) =>
                task.daysUntilDueDate >= 0 &&
                task.daysUntilDueDate <= UPCOMING_DAYS
        )
        .sort(sortByDueDate)
        .slice(0, 5)
        .map(({ title, dueDate, priority }) => ({
            title,
            dueDate,
            priority,
        }))

    const recurringTasks = tasks
        .filter(hasActiveRecurrence)
        .map((task) => {
            const recurrence = normalizeTaskRecurrence(task.recurrence)

            return {
                title: task.title,
                recurrence,
                label: getTaskRecurrenceLabel(recurrence),
            }
        })
        .slice(0, 5)

    return {
        generatedAt: referenceDate.toISOString(),
        summary: {
            totalTasks: tasks.length,
            completedTasks,
            pendingTasks,
            overdueTasks,
            highPriorityTasks,
            completionRate: calculateCompletionRate(tasks.length, completedTasks),
            categories: getCategorySummary(tasks),
            upcomingDueTasks,
            recurringTasks,
        },
    }
}

export function generateLocalAiInsights(payload: AiInsightsPayload): AiInsight[] {
    const { summary } = payload
    const topCategory = summary.categories[0]
    const insights: AiInsight[] = []

    if (summary.totalTasks === 0) {
        return [
            createInsight(
                "start-small",
                "Comece com um plano pequeno",
                "Ainda nao ha tarefas para analisar. Um fluxo inicial com poucos itens deixa o Lynflow mais util imediatamente.",
                "Crie 3 tarefas: uma de foco, uma de manutencao e uma de portifolio.",
                "neutral"
            ),
        ]
    }

    if (summary.overdueTasks > 0) {
        insights.push(
            createInsight(
                "overdue-focus",
                "Resolva pendencias vencidas",
                `${summary.overdueTasks} tarefa(s) estao atrasadas e podem bloquear o restante do planejamento.`,
                "Reagende ou conclua as tarefas vencidas antes de adicionar novas demandas.",
                "critical"
            )
        )
    }

    if (summary.highPriorityTasks > 0) {
        insights.push(
            createInsight(
                "high-priority",
                "Proteja um bloco de foco",
                `${summary.highPriorityTasks} tarefa(s) de alta prioridade precisam de atencao direta.`,
                "Escolha no maximo 2 tarefas de alta prioridade para executar primeiro hoje.",
                "warning"
            )
        )
    }

    if (summary.upcomingDueTasks.length > 0) {
        const nextTask = summary.upcomingDueTasks[0]

        insights.push(
            createInsight(
                "upcoming-due-date",
                "Antecipe o proximo prazo",
                `"${nextTask.title}" vence em ${nextTask.dueDate}.`,
                "Separe essa tarefa em passos menores e execute o primeiro ainda nesta sessao.",
                "warning"
            )
        )
    }

    if (summary.recurringTasks.length > 0) {
        insights.push(
            createInsight(
                "recurrence-review",
                "Revise tarefas recorrentes",
                `${summary.recurringTasks.length} tarefa(s) recorrente(s) mantem ciclos ativos no seu planejamento.`,
                "Confira se as recorrencias ainda refletem sua rotina atual antes de concluir em lote.",
                "neutral"
            )
        )
    }

    if (summary.completionRate >= 70) {
        insights.push(
            createInsight(
                "good-flow",
                "Fluxo em bom ritmo",
                `Sua taxa de conclusao esta em ${summary.completionRate}%, um sinal de execucao consistente.`,
                "Documente esse progresso no README ou em prints para reforcar o case do projeto.",
                "positive"
            )
        )
    }

    if (summary.completionRate < 50 && summary.pendingTasks > 0) {
        insights.push(
            createInsight(
                "reduce-wip",
                "Reduza tarefas abertas",
                `Existem ${summary.pendingTasks} tarefa(s) pendente(s), com ${summary.completionRate}% de conclusao.`,
                "Conclua primeiro uma tarefa pequena para criar tracao antes de abrir novos itens.",
                "warning"
            )
        )
    }

    if (topCategory) {
        insights.push(
            createInsight(
                "category-balance",
                "Categoria dominante",
                `${topCategory.name} concentra ${topCategory.total} tarefa(s) no momento.`,
                "Use essa categoria como foco principal do dia ou divida-a em etapas menores.",
                "neutral"
            )
        )
    }

    return insights.slice(0, 4)
}

export async function generateAiInsights(
    input: AiInsightsInput,
    options: GenerateAiInsightsOptions = {}
): Promise<AiInsightsResult> {
    const payload = buildAiInsightsPayload(input)
    const fallbackInsights = generateLocalAiInsights(payload)
    const isOnline =
        options.isOnline ??
        (typeof navigator === "undefined" ? true : navigator.onLine)

    if (!isOnline) {
        return {
            status: "fallback",
            provider: "local",
            message: "Voce esta offline. Usando recomendacoes locais.",
            insights: fallbackInsights,
            payload,
        }
    }

    const fetcher = options.fetcher ?? fetch

    try {
        const response = await fetcher(options.endpoint ?? DEFAULT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error("A rota de IA nao retornou uma resposta valida.")
        }

        const remoteResponse = normalizeRemoteResponse(await response.json())

        if (!remoteResponse) {
            throw new Error("A resposta da IA veio em formato invalido.")
        }

        return {
            status: "success",
            provider: "openai",
            message: remoteResponse.message ?? "Recomendacoes geradas pela IA real.",
            insights: remoteResponse.insights,
            payload,
        }
    } catch (error) {
        const detail = error instanceof Error ? error.message : "Erro desconhecido."

        return {
            status: "fallback",
            provider: "local",
            message: `Fallback local ativado: ${detail}`,
            insights: fallbackInsights,
            payload,
        }
    }
}
