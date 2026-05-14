export type DashboardFocusStatus =
    | "launch-ready"
    | "almost-there"
    | "needs-focus"
    | "start-building"

export type DashboardFocus = {
    status: DashboardFocusStatus
    label: string
    title: string
    description: string
    primaryAction: string
    secondaryAction: string
}

type DashboardFocusParams = {
    productivity: number
    pendingTasks: number
    highPriorityTasks: number
    totalTasks: number
}

export function getDashboardFocus({
    productivity,
    pendingTasks,
    highPriorityTasks,
    totalTasks,
}: DashboardFocusParams): DashboardFocus {
    if (totalTasks === 0) {
        return {
            status: "start-building",
            label: "Comece criando dados",
            title: "Seu dashboard ainda precisa de tarefas",
            description:
                "Crie tarefas, defina prioridades e organize categorias para gerar métricas úteis.",
            primaryAction: "Criar primeiras tarefas",
            secondaryAction: "Definir categorias",
        }
    }

    if (productivity >= 80 && pendingTasks <= 3 && highPriorityTasks <= 2) {
        return {
            status: "launch-ready",
            label: "Pronto para divulgação",
            title: "O Lynflow está em fase forte de apresentação",
            description:
                "O projeto já tem boa maturidade. Foque em README, screenshots, deploy e post no LinkedIn.",
            primaryAction: "Preparar divulgação",
            secondaryAction: "Revisar documentação",
        }
    }

    if (productivity >= 60) {
        return {
            status: "almost-there",
            label: "Quase pronto",
            title: "O projeto está avançando bem",
            description:
                "A base está sólida. Reduza pendências e finalize os pontos de maior impacto visual.",
            primaryAction: "Fechar pendências",
            secondaryAction: "Polir interface",
        }
    }

    if (pendingTasks > 0 || highPriorityTasks > 0) {
        return {
            status: "needs-focus",
            label: "Precisa de foco",
            title: "Priorize o que destrava o MVP",
            description:
                "Existem tarefas importantes em aberto. Trabalhe primeiro nas pendências de alta prioridade.",
            primaryAction: "Resolver alta prioridade",
            secondaryAction: "Revisar backlog",
        }
    }

    return {
        status: "start-building",
        label: "Sem leitura suficiente",
        title: "Ainda não há dados suficientes para análise",
        description:
            "Cadastre tarefas e acompanhe a evolução para gerar recomendações melhores.",
        primaryAction: "Criar tarefas",
        secondaryAction: "Organizar projeto",
    }
}