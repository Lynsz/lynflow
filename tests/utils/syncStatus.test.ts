import { describe, expect, it } from "vitest"
import { getSyncStatus } from "../../src/utils/syncStatus"

describe("syncStatus", () => {
    it("describes localStorage mode as local and ready when data loaded", () => {
        const status = getSyncStatus({
            dataMode: "local",
            isReady: true,
        })

        expect(status.modeLabel).toBe("Local")
        expect(status.state).toBe("local-only")
        expect(status.stateLabel).toBe("Somente local")
        expect(status.isRemote).toBe(false)
        expect(status.isSynced).toBe(true)
        expect(status.connectionLabel).toBe("localStorage ativo")
        expect(status.syncLabel).toBe("Somente local")
    })

    it("requires an authenticated user before Supabase can sync", () => {
        const status = getSyncStatus({
            dataMode: "supabase",
            isReady: true,
        })

        expect(status.modeLabel).toBe("Supabase")
        expect(status.state).toBe("connecting")
        expect(status.isRemote).toBe(true)
        expect(status.isSynced).toBe(false)
        expect(status.syncLabel).toBe("Sem usuário remoto autenticado")
    })

    it("marks Supabase data as user-scoped when a user is authenticated", () => {
        const status = getSyncStatus({
            dataMode: "supabase",
            isReady: true,
            userId: "user-1",
            isRealtimeConnected: true,
            lastSyncedAt: "2026-05-14T12:00:00.000Z",
            connectedDevices: 2,
        })

        expect(status.state).toBe("synced")
        expect(status.connectionLabel).toBe("Realtime conectado")
        expect(status.syncLabel).toBe("Dados sincronizados")
        expect(status.description).toContain("user_id")
        expect(status.isSynced).toBe(true)
        expect(status.connectedDevicesLabel).toBe("2 sessões ativas")
        expect(status.lastSyncedAtLabel).not.toBe("Ainda não sincronizado")
    })

    it("uses offline labels when the browser has no connection", () => {
        const status = getSyncStatus({
            dataMode: "supabase",
            isReady: true,
            userId: "user-1",
            isOnline: false,
        })

        expect(status.state).toBe("offline")
        expect(status.stateLabel).toBe("Offline")
        expect(status.connectionLabel).toBe("Sem conexão")
        expect(status.canRetry).toBe(true)
    })

    it("surfaces sync errors with retry enabled", () => {
        const status = getSyncStatus({
            dataMode: "supabase",
            isReady: true,
            userId: "user-1",
            errorMessage: "Realtime indisponível.",
        })

        expect(status.state).toBe("error")
        expect(status.stateLabel).toBe("Erro de sincronização")
        expect(status.syncLabel).toBe("Erro recente")
        expect(status.errorMessage).toBe("Realtime indisponível.")
        expect(status.canRetry).toBe(true)
    })
})
