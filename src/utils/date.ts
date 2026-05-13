export function createLocalDate(date: string) {
    return new Date(`${date}T00:00:00`)
}

export function formatDatePtBr(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(createLocalDate(date))
}

export function normalizeDateToStartOfDay(date: Date) {
    const normalizedDate = new Date(date)
    normalizedDate.setHours(0, 0, 0, 0)

    return normalizedDate
}

export function isBeforeLocalDay(date: string, referenceDate = new Date()) {
    const localDate = createLocalDate(date)
    const normalizedReferenceDate = normalizeDateToStartOfDay(referenceDate)

    return localDate.getTime() < normalizedReferenceDate.getTime()
}