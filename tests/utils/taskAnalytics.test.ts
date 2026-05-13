import { describe, expect, it } from "vitest"
import type { Task } from "../../src/types/task"
import {
    getCategoryDistribution,
    getMostUsedCategory,
    getPriorityDistribution,
    getProductivityStatus,
} from "../../src/utils/taskAnalytics"

const tasks: Task[] = [
    {
        id: "1",
        title: "Deploy",
        category: "Projeto",
        priority: "high",
        done: false,
        createdAt: "2026-05-13T10:00:00.000Z",
        order: 0,
    },
    {
        id: "2",
        title: "README",
        category: "Projeto",
        priority: "medium",
        done: true,
        createdAt: "2026-05-13T11:00:00.000Z",
        order: 1,
    },
    {
        id: "3",
        title: "Ajustes visuais",
        category: "Design",
        priority: "low",
        done: true,
        createdAt: "2026-05-13T12:00:00.000Z",
        order: 2,
    },
]

describe("task analytics", () => {
    it("builds category distribution ordered by total", () => {
        expect(getCategoryDistribution(tasks)).toEqual([
            { category: "Projeto", total: 2 },
            { category: "Design", total: 1 },
        ])
    })

    it("returns the most used category", () => {
        expect(getMostUsedCategory(tasks)).toBe("Projeto")
        expect(getMostUsedCategory([])).toBe("Nenhuma categoria")
    })

    it("counts priority distribution", () => {
        expect(getPriorityDistribution(tasks).map((item) => item.value)).toEqual([
            1, 1, 1,
        ])
    })

    it("labels productivity ranges", () => {
        expect(getProductivityStatus(80)).toBe("Fluxo excelente")
        expect(getProductivityStatus(60)).toBe("Bom progresso")
        expect(getProductivityStatus(30)).toContain("evolu")
        expect(getProductivityStatus(10)).toBe("Precisa de foco")
    })
})
