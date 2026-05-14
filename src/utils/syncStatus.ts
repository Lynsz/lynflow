export type DataMode = "local" | "supabase"

export type SyncState =
    | "offline"
    | "local-only"
    | "connecting"
    | "connected"
    | "syncing"
    | "synced"
    | "error"

export type SyncStatus = {
    state: SyncState
    stateLabel: string
    modeLabel: "Local" | "Supabase"
    connectionLabel: string
    syncLabel: string
    description: string
    lastSyncedAt: string | null
    lastSyncedAtLabel: string
    errorMessage: string | null
    connectedDevices: number
    connectedDevicesLabel: string
    canRetry: boolean
    isRemote: boolean
    isSynced: boolean
}

type GetSyncStatusInput = {
    dataMode: DataMode
    isReady: boolean
    userId?: string
    isOnline?: boolean
    isRealtimeConnected?: boolean
    isSyncing?: boolean
    lastSyncedAt?: string | null
    errorMessage?: string | null
    connectedDevices?: number
}

const stateLabels: Record<SyncState, string> = {
    offline: "Offline",
    "local-only": "Somente local",
    connecting: "Conectando",
    connected: "Conectado",
    syncing: "Sincronizando",
    synced: "Sincronizado",
    error: "Erro de sincronização",
}

function getLastSyncedAtLabel(lastSyncedAt?: string | null) {
    if (!lastSyncedAt) {
        return "Ainda não sincronizado"
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(lastSyncedAt))
}

function getConnectedDevicesLabel(count: number) {
    if (count <= 0) {
        return "Nenhum dispositivo conectado"
    }

    if (count === 1) {
        return "1 sessão ativa"
    }

    return `${count} sessões ativas`
}

function getRemoteState({
    isReady,
    userId,
    isOnline,
    isRealtimeConnected,
    isSyncing,
    errorMessage,
}: Required<
    Pick<
        GetSyncStatusInput,
        "isReady" | "isOnline" | "isRealtimeConnected" | "isSyncing"
    >
> &
    Pick<GetSyncStatusInput, "userId" | "errorMessage">): SyncState {
    if (!isOnline) return "offline"
    if (errorMessage) return "error"
    if (!userId) return "connecting"
    if (isSyncing) return "syncing"
    if (isReady && isRealtimeConnected) return "synced"
    if (isRealtimeConnected) return "connected"
    return "connecting"
}

export function getSyncStatus({
    dataMode,
    isReady,
    userId,
    isOnline = true,
    isRealtimeConnected = false,
    isSyncing = false,
    lastSyncedAt = null,
    errorMessage = null,
    connectedDevices = 0,
}: GetSyncStatusInput): SyncStatus {
    if (!isOnline) {
        const state: SyncState = "offline"

        return {
            state,
            stateLabel: stateLabels[state],
            modeLabel: dataMode === "supabase" ? "Supabase" : "Local",
            connectionLabel: "Sem conexão",
            syncLabel:
                dataMode === "supabase"
                    ? "Aguardando conexão para sincronizar"
                    : "Dados locais disponíveis offline",
            description:
                dataMode === "supabase"
                    ? "O app continua aberto, mas a sincronização entre dispositivos pausa enquanto você estiver offline."
                    : "Os dados locais continuam disponíveis neste navegador mesmo sem internet.",
            lastSyncedAt,
            lastSyncedAtLabel: getLastSyncedAtLabel(lastSyncedAt),
            errorMessage,
            connectedDevices,
            connectedDevicesLabel: getConnectedDevicesLabel(connectedDevices),
            canRetry: dataMode === "supabase",
            isRemote: dataMode === "supabase",
            isSynced: false,
        }
    }

    if (dataMode === "local") {
        const state: SyncState = "local-only"

        return {
            state,
            stateLabel: stateLabels[state],
            modeLabel: "Local",
            connectionLabel: "localStorage ativo",
            syncLabel: isReady ? "Somente local" : "Carregando dados locais",
            description:
                "Os dados ficam salvos apenas neste navegador. Não há sincronização entre dispositivos sem Supabase.",
            lastSyncedAt: null,
            lastSyncedAtLabel: "Não se aplica ao modo local",
            errorMessage: null,
            connectedDevices: 0,
            connectedDevicesLabel: "Somente este navegador",
            canRetry: false,
            isRemote: false,
            isSynced: isReady,
        }
    }

    const state = getRemoteState({
        isReady,
        userId,
        isOnline,
        isRealtimeConnected,
        isSyncing,
        errorMessage,
    })

    if (!userId) {
        return {
            state,
            stateLabel: stateLabels[state],
            modeLabel: "Supabase",
            connectionLabel: "Aguardando sessão",
            syncLabel: "Sem usuário remoto autenticado",
            description:
                "O modo Supabase precisa de uma sessão autenticada para sincronizar dados.",
            lastSyncedAt,
            lastSyncedAtLabel: getLastSyncedAtLabel(lastSyncedAt),
            errorMessage,
            connectedDevices,
            connectedDevicesLabel: getConnectedDevicesLabel(connectedDevices),
            canRetry: true,
            isRemote: true,
            isSynced: false,
        }
    }

    const connectionLabel =
        state === "error"
            ? "Falha na sincronização"
            : state === "syncing"
              ? "Sincronizando com Supabase"
              : isRealtimeConnected
                ? "Realtime conectado"
                : "Conectando ao Supabase"

    const syncLabel =
        state === "error"
            ? "Erro recente"
            : state === "syncing"
              ? "Sincronizando agora"
              : state === "synced"
                ? "Dados sincronizados"
                : "Conectando sincronização"

    return {
        state,
        stateLabel: stateLabels[state],
        modeLabel: "Supabase",
        connectionLabel,
        syncLabel,
        description:
            "Tarefas e atividades usam user_id, RLS e realtime filtrado para sincronizar a conta atual entre dispositivos.",
        lastSyncedAt,
        lastSyncedAtLabel: getLastSyncedAtLabel(lastSyncedAt),
        errorMessage,
        connectedDevices,
        connectedDevicesLabel: getConnectedDevicesLabel(connectedDevices),
        canRetry: true,
        isRemote: true,
        isSynced: state === "synced",
    }
}
