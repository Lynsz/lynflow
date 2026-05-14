import { describe, expect, it } from "vitest"
import { getSyncStatus } from "../../src/utils/syncStatus"

describe("syncStatus", () => {
    it("describes localStorage mode as local and ready when data loaded", () => {
        const status = getSyncStatus({
            dataMode: "local",
            isReady: true,
        })

        expect(status.modeLabel).toBe("Local")
        expect(status.isRemote).toBe(false)
        expect(status.isSynced).toBe(true)
        expect(status.connectionLabel).toBe("localStorage ativo")
    })

    it("requires an authenticated user before Supabase can sync", () => {
        const status = getSyncStatus({
            dataMode: "supabase",
            isReady: true,
        })

        expect(status.modeLabel).toBe("Supabase")
        expect(status.isRemote).toBe(true)
        expect(status.isSynced).toBe(false)
        expect(status.syncLabel).toBe("Sem usuario remoto autenticado")
    })

    it("marks Supabase data as user-scoped when a user is authenticated", () => {
        const status = getSyncStatus({
            dataMode: "supabase",
            isReady: true,
            userId: "user-1",
        })

        expect(status.connectionLabel).toBe("Backend conectado")
        expect(status.syncLabel).toBe("Dados sincronizados por usuario")
        expect(status.description).toContain("user_id")
        expect(status.isSynced).toBe(true)
    })
})
