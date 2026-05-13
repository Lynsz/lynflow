import { describe, expect, it } from "vitest"
import {
    isValidEmail,
    validateLoginForm,
    validateProfileForm,
    validateRegisterForm,
} from "../../src/utils/validators"

describe("validators", () => {
    it("validates email format", () => {
        expect(isValidEmail("kethe@example.com")).toBe(true)
        expect(isValidEmail("kethe@example")).toBe(false)
        expect(isValidEmail("kethe example.com")).toBe(false)
    })

    it("validates login fields", () => {
        expect(validateLoginForm("kethe@example.com", "123456")).toBeNull()
        expect(validateLoginForm("", "123456")).toBeTruthy()
        expect(validateLoginForm("invalid-email", "123456")).toBeTruthy()
    })

    it("validates register fields", () => {
        expect(validateRegisterForm("Kethe", "kethe@example.com", "123456")).toBeNull()
        expect(validateRegisterForm("K", "kethe@example.com", "123456")).toBeTruthy()
        expect(validateRegisterForm("Kethe", "kethe@example.com", "123")).toBeTruthy()
    })

    it("validates profile fields", () => {
        expect(validateProfileForm("Kethe", "kethe@example.com")).toBeNull()
        expect(validateProfileForm("", "kethe@example.com")).toBeTruthy()
        expect(validateProfileForm("Kethe", "invalid-email")).toBeTruthy()
    })
})
