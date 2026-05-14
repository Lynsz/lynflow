export type DataMode = "local" | "supabase"

export type SyncStatus = {
    modeLabel: "Local" | "Supabase"
    connectionLabel: string
    syncLabel: string
    description: string
    isRemote: boolean
    isSynced: boolean
}

type GetSyncStatusInput = {
    dataMode: DataMode
    isReady: boolean
    userId?: string
}

export function getSyncStatus({
    dataMode,
    isReady,
    userId,
}: GetSyncStatusInput): SyncStatus {
    if (dataMode === "local") {
        return {
            modeLabel: "Local",
            connectionLabel: "localStorage ativo",
            syncLabel: isReady ? "Dados locais prontos" : "Carregando dados locais",
            description:
                "Os dados ficam salvos apenas neste navegador. Supabase continua opcional.",
            isRemote: false,
            isSynced: isReady,
        }
    }

    if (!userId) {
        return {
            modeLabel: "Supabase",
            connectionLabel: "Aguardando sessao",
            syncLabel: "Sem usuario remoto autenticado",
            description:
                "O modo Supabase precisa de uma sessao autenticada para sincronizar dados.",
            isRemote: true,
            isSynced: false,
        }
    }

    return {
        modeLabel: "Supabase",
        connectionLabel: "Backend conectado",
        syncLabel: isReady ? "Dados sincronizados por usuario" : "Sincronizando dados",
        description:
            "Tarefas e atividades usam user_id e RLS para isolar os dados da conta atual.",
        isRemote: true,
        isSynced: isReady,
    }
}
