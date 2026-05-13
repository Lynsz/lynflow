import { useEffect, useState } from "react"

type UsePersistentStateParams<T extends string> = {
    storageKey: string
    defaultValue: T
    isValidValue: (value: string) => value is T
}

export function usePersistentState<T extends string>({
    storageKey,
    defaultValue,
    isValidValue,
}: UsePersistentStateParams<T>) {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return defaultValue
        }

        const storedValue = window.localStorage.getItem(storageKey)

        if (storedValue && isValidValue(storedValue)) {
            return storedValue
        }

        return defaultValue
    })

    useEffect(() => {
        window.localStorage.setItem(storageKey, value)
    }, [storageKey, value])

    return [value, setValue] as const
}