export type ActivityType =
    | "created"
    | "completed"
    | "reopened"
    | "deleted"
    | "reordered"
    | "cleared"
    | "reset"

export type TaskActivity = {
    id: string
    type: ActivityType
    title: string
    description: string
    createdAt: string
}