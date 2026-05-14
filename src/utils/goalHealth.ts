export type GoalHealthStatus = "excellent" | "good" | "attention" | "critical"

export type GoalHealth = {
    status: GoalHealthStatus
    label: string
    description: string
    recommendation: string
}

type GoalHealthParams = {
    productivity: number
    pendingTasks: number
    highPriorityTasks: number
}

export function getGoalHealth({
    productivity,
    pendingTasks,
    highPriorityTasks,
}: GoalHealthParams): GoalHealth {
    if (productivity >= 80 && highPriorityTasks <= 2) {
        return {
            status: "excellent",
            label: "Excelente",
            description: "O projeto está em uma fase muito avançada.",
            recommendation:
                "Priorize revisão final, documentação, deploy e divulgação no portfólio.",
        }
    }

    if (productivity >= 60) {
        return {
            status: "good",
            label: "Bom progresso",
            description: "O projeto está evoluindo bem.",
            recommendation:
                "Continue reduzindo pendências e finalize os pontos de maior impacto visual.",
        }
    }

    if (pendingTasks > 0 || highPriorityTasks > 0) {
        return {
            status: "attention",
            label: "Atenção",
            description: "Ainda existem pontos importantes para fechar.",
            recommendation:
                "Foque nas tarefas de alta prioridade antes de adicionar novas features.",
        }
    }

    return {
        status: "critical",
        label: "Sem dados suficientes",
        description: "Ainda não há progresso suficiente para analisar a meta.",
        recommendation:
            "Crie tarefas, defina prioridades e acompanhe o avanço pela página Tasks.",
    }
}