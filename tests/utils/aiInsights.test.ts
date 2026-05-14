import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    buildAiInsightsPayload,
    generateAiInsights,
    generateLocalAiInsights,
} from "../../src/services/aiInsights"

function createTask(overrides: Partial<Task>): Task {
    return {
        id: "task-id",
        title: "Tarefa teste",
        category: "Geral",
        priority: "medium",
        done: false,
        createdAt: "2026-05-14T00:00:00.000Z",
        order: 1,
        dueDate: null,
        recurrence: "none",
        ...overrides,
    }
}

const referenceDate = new Date("2026-05-14T12:00:00.000Z")

describe("aiInsights service", () => {
    it("builds a safe payload from real tasks", () => {
        const payload = buildAiInsightsPayload({
            referenceDate,
            tasks: [
                createTask({
                    id: "task-1",
                    title: "Publicar portfolio",
                    category: "Portfolio",
                    priority: "high",
                    dueDate: "2026-05-15",
                }),
                createTask({
                    id: "task-2",
                    title: "Revisar recorrencia",
                    category: "Rotina",
                    priority: "medium",
                    recurrence: "weekly",
                    dueDate: "2026-05-13",
                }),
                createTask({
                    id: "task-3",
                    title: "Concluir README",
                    category: "Portfolio",
                    priority: "low",
                    done: true,
                }),
            ],
        })

        expect(payload.summary.totalTasks).toBe(3)
        expect(payload.summary.completedTasks).toBe(1)
        expect(payload.summary.pendingTasks).toBe(1)
        expect(payload.summary.overdueTasks).toBe(1)
        expect(payload.summary.highPriorityTasks).toBe(1)
        expect(payload.summary.categories[0]).toEqual({
            name: "Portfolio",
            total: 2,
        })
        expect(payload.summary.upcomingDueTasks).toEqual([
            {
                title: "Publicar portfolio",
                dueDate: "2026-05-15",
                priority: "high",
            },
        ])
        expect(payload.summary.recurringTasks).toEqual([
            {
                title: "Revisar recorrencia",
                recurrence: "weekly",
                label: "Semanal",
            },
        ])
    })

    it("generates deterministic local fallback insights", () => {
        const payload = buildAiInsightsPayload({
            referenceDate,
            tasks: [
                createTask({
                    id: "task-1",
                    title: "Resolver tarefa atrasada",
                    priority: "high",
                    dueDate: "2026-05-13",
                }),
            ],
        })

        const insights = generateLocalAiInsights(payload)

        expect(insights.map((insight) => insight.id)).toEqual([
            "overdue-focus",
            "high-priority",
            "category-balance",
        ])
    })

    it("uses local fallback when the browser is offline", async () => {
        const result = await generateAiInsights(
            {
                referenceDate,
                tasks: [createTask({ id: "task-1" })],
            },
            {
                isOnline: false,
            }
        )

        expect(result.status).toBe("fallback")
        expect(result.provider).toBe("local")
        expect(result.message).toContain("offline")
        expect(result.insights.length).toBeGreaterThan(0)
    })

    it("falls back locally when the remote API fails", async () => {
        const result = await generateAiInsights(
            {
                referenceDate,
                tasks: [createTask({ id: "task-1", priority: "high" })],
            },
            {
                fetcher: async () => ({
                    ok: false,
                    json: async () => ({}),
                }),
                isOnline: true,
            }
        )

        expect(result.status).toBe("fallback")
        expect(result.provider).toBe("local")
        expect(result.message).toContain("Fallback local ativado")
        expect(result.insights.some((insight) => insight.id === "high-priority"))
            .toBe(true)
    })

    it("uses remote insights when the API returns a valid response", async () => {
        const result = await generateAiInsights(
            {
                referenceDate,
                tasks: [createTask({ id: "task-1" })],
            },
            {
                fetcher: async () => ({
                    ok: true,
                    json: async () => ({
                        message: "Gerado pela API.",
                        insights: [
                            {
                                id: "remote-plan",
                                title: "Plano remoto",
                                description: "Descricao remota.",
                                action: "Acao remota.",
                                tone: "positive",
                            },
                        ],
                    }),
                }),
                isOnline: true,
            }
        )

        expect(result.status).toBe("success")
        expect(result.provider).toBe("openai")
        expect(result.message).toBe("Gerado pela API.")
        expect(result.insights[0]?.id).toBe("remote-plan")
    })
})
