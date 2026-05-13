import type { ActivityType, TaskActivity } from "../types/activity"

export type ActivityFilter = "all" | ActivityType
export type ActivitySortOption = "newest" | "oldest"

type FilterActivitiesParams = {
    activities: TaskActivity[]
    search: string
    type: ActivityFilter
    sortBy: ActivitySortOption
}

export function filterAndSortActivities({
    activities,
    search,
    type,
    sortBy,
}: FilterActivitiesParams) {
    const normalizedSearch = search.trim().toLowerCase()

    const filteredActivities = activities.filter((activity) => {
        const matchesSearch =
            activity.title.toLowerCase().includes(normalizedSearch) ||
            activity.description.toLowerCase().includes(normalizedSearch)

        const matchesType = type === "all" || activity.type === type

        return matchesSearch && matchesType
    })

    return [...filteredActivities].sort((a, b) => {
        if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
}