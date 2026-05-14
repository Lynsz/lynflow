export const REALTIME_REFRESH_DELAY_MS = 250

export type SyncPresencePayload = {
    userId: string
    deviceId: string
    onlineAt: string
}

type SyncPresenceMeta = {
    deviceId?: string
}

export type SyncPresenceState = Record<string, ReadonlyArray<SyncPresenceMeta>>

export function getUserRealtimeChannelName(userId: string) {
    return `lynflow-user-data-${userId}`
}

export function getUserRealtimeFilter(userId: string) {
    return `user_id=eq.${userId}`
}

export function countPresenceDevices(state: SyncPresenceState) {
    const deviceIds = new Set<string>()

    Object.entries(state).forEach(([presenceKey, presences]) => {
        presences.forEach((presence, index) => {
            deviceIds.add(presence.deviceId ?? `${presenceKey}-${index}`)
        })
    })

    return deviceIds.size
}
