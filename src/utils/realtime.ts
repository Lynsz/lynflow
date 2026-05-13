export const REALTIME_REFRESH_DELAY_MS = 250

export function getUserRealtimeChannelName(userId: string) {
    return `lynflow-user-data-${userId}`
}

export function getUserRealtimeFilter(userId: string) {
    return `user_id=eq.${userId}`
}
