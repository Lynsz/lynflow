import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { usePersistentState } from "../../src/hooks/usePersistentState"

type TestViewMode = "list" | "kanban"

const storageKey = "lynflow:test-view-mode"

function isTestViewMode(value: string): value is TestViewMode {
    return value === "list" || value === "kanban"
}

describe("usePersistentState", () => {
    it("returns default value when storage is empty", () => {
        const { result } = renderHook(() =>
            usePersistentState<TestViewMode>({
                storageKey,
                defaultValue: "list",
                isValidValue: isTestViewMode,
            })
        )

        expect(result.current[0]).toBe("list")
    })

    it("returns stored value when storage has a valid value", () => {
        localStorage.setItem(storageKey, "kanban")

        const { result } = renderHook(() =>
            usePersistentState<TestViewMode>({
                storageKey,
                defaultValue: "list",
                isValidValue: isTestViewMode,
            })
        )

        expect(result.current[0]).toBe("kanban")
    })

    it("ignores invalid stored value", () => {
        localStorage.setItem(storageKey, "invalid")

        const { result } = renderHook(() =>
            usePersistentState<TestViewMode>({
                storageKey,
                defaultValue: "list",
                isValidValue: isTestViewMode,
            })
        )

        expect(result.current[0]).toBe("list")
    })

    it("persists updated value in localStorage", () => {
        const { result } = renderHook(() =>
            usePersistentState<TestViewMode>({
                storageKey,
                defaultValue: "list",
                isValidValue: isTestViewMode,
            })
        )

        act(() => {
            result.current[1]("kanban")
        })

        expect(result.current[0]).toBe("kanban")
        expect(localStorage.getItem(storageKey)).toBe("kanban")
    })
})