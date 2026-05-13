import { describe, expect, it } from "vitest"
import type { TaskActivity } from "../../src/types/activity"
import { filterAndSortActivities } from "../../src/utils/activityFilters"

const activities: TaskActivity[] = [
    {
        id: "1",
        type: "created",
        title: "Tarefa criada",
        description: "Deploy foi adicionado.",
        createdAt: "2026-05-13T10:00:00.000Z",
    },
    {
        id: "2",
        type: "completed",
        title: "Tarefa concluida",
        description: "README foi finalizado.",
        createdAt: "2026-05-12T10:00:00.000Z",
    },
]

describe("filterAndSortActivities", () => {
    it("filters activities by search and type", () => {
        const result = filterAndSortActivities({
            activities,
            search: "readme",
            type: "completed",
            sortBy: "newest",
        })

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe("2")
    })

    it("sorts activities from oldest to newest", () => {
        const result = filterAndSortActivities({
            activities,
            search: "",
            type: "all",
            sortBy: "oldest",
        })

        expect(result.map((activity) => activity.id)).toEqual(["2", "1"])
    })
})
