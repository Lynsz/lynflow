import { describe, expect, it } from "vitest"
import { getDashboardFocus } from "../../src/utils/dashboardFocus"

describe("dashboardFocus", () => {
    it("returns start-building when there are no tasks", () => {
        const focus = getDashboardFocus({
            productivity: 0,
            pendingTasks: 0,
            highPriorityTasks: 0,
            totalTasks: 0,
        })

        expect(focus.status).toBe("start-building")
        expect(focus.label).toBe("Comece criando dados")
    })

    it("returns launch-ready when productivity is high and pending work is low", () => {
        const focus = getDashboardFocus({
            productivity: 85,
            pendingTasks: 2,
            highPriorityTasks: 1,
            totalTasks: 10,
        })

        expect(focus.status).toBe("launch-ready")
        expect(focus.label).toBe("Pronto para divulgação")
    })

    it("returns almost-there when productivity is above 60", () => {
        const focus = getDashboardFocus({
            productivity: 65,
            pendingTasks: 6,
            highPriorityTasks: 3,
            totalTasks: 12,
        })

        expect(focus.status).toBe("almost-there")
        expect(focus.label).toBe("Quase pronto")
    })

    it("returns needs-focus when there are pending or high priority tasks", () => {
        const focus = getDashboardFocus({
            productivity: 30,
            pendingTasks: 5,
            highPriorityTasks: 2,
            totalTasks: 8,
        })

        expect(focus.status).toBe("needs-focus")
        expect(focus.label).toBe("Precisa de foco")
    })
})