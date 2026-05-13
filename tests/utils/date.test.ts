import { describe, expect, it } from "vitest"
import {
    createLocalDate,
    formatDatePtBr,
    isBeforeLocalDay,
    normalizeDateToStartOfDay,
} from "./date"

describe("date utils", () => {
    it("creates local date from yyyy-mm-dd string", () => {
        const date = createLocalDate("2026-05-13")

        expect(date.getFullYear()).toBe(2026)
        expect(date.getMonth()).toBe(4)
        expect(date.getDate()).toBe(13)
    })

    it("formats date to pt-BR", () => {
        expect(formatDatePtBr("2026-05-13")).toBe("13/05/2026")
    })

    it("normalizes date to start of day", () => {
        const date = normalizeDateToStartOfDay(
            new Date("2026-05-13T18:30:45.000Z")
        )

        expect(date.getHours()).toBe(0)
        expect(date.getMinutes()).toBe(0)
        expect(date.getSeconds()).toBe(0)
        expect(date.getMilliseconds()).toBe(0)
    })

    it("detects date before reference day", () => {
        const referenceDate = new Date("2026-05-13T12:00:00.000Z")

        expect(isBeforeLocalDay("2026-05-12", referenceDate)).toBe(true)
        expect(isBeforeLocalDay("2026-05-13", referenceDate)).toBe(false)
        expect(isBeforeLocalDay("2026-05-14", referenceDate)).toBe(false)
    })
})