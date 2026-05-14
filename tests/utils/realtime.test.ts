import { describe, expect, it } from "vitest"
import {
    countPresenceDevices,
    getUserRealtimeChannelName,
    getUserRealtimeFilter,
    REALTIME_REFRESH_DELAY_MS,
} from "../../src/utils/realtime"

describe("realtime utils", () => {
    it("builds stable user-scoped channel names and filters", () => {
        const userId = "user-1"

        expect(getUserRealtimeChannelName(userId)).toBe(
            "lynflow-user-data-user-1"
        )
        expect(getUserRealtimeFilter(userId)).toBe("user_id=eq.user-1")
    })

    it("keeps realtime refreshes debounced", () => {
        expect(REALTIME_REFRESH_DELAY_MS).toBeGreaterThanOrEqual(100)
    })

    it("counts unique presence devices", () => {
        expect(
            countPresenceDevices({
                "device-a": [{ deviceId: "device-a" }],
                "device-b": [{ deviceId: "device-b" }],
                "device-a-duplicate": [{ deviceId: "device-a" }],
            })
        ).toBe(2)
    })
})
