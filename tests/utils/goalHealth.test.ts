import { describe, expect, it } from "vitest"
import { getGoalHealth } from "../../src/utils/goalHealth"

describe("goalHealth", () => {
    it("returns excellent when productivity is high and high priority tasks are low", () => {
        const health = getGoalHealth({
            productivity: 85,
            pendingTasks: 2,
            highPriorityTasks: 1,
        })

        expect(health.status).toBe("excellent")
        expect(health.label).toBe("Excelente")
    })

    it("returns good when productivity is above 60", () => {
        const health = getGoalHealth({
            productivity: 65,
            pendingTasks: 5,
            highPriorityTasks: 3,
        })

        expect(health.status).toBe("good")
        expect(health.label).toBe("Bom progresso")
    })

    it("returns attention when there are pending or high priority tasks", () => {
        const health = getGoalHealth({
            productivity: 30,
            pendingTasks: 4,
            highPriorityTasks: 2,
        })

        expect(health.status).toBe("attention")
        expect(health.label).toBe("Atenção")
    })

    it("returns critical when there is not enough data", () => {
        const health = getGoalHealth({
            productivity: 0,
            pendingTasks: 0,
            highPriorityTasks: 0,
        })

        expect(health.status).toBe("critical")
        expect(health.label).toBe("Sem dados suficientes")
    })
})