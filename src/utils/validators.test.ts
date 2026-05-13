import { describe, expect, it } from "vitest"
import {
    isValidEmail,
    validateLoginForm,
    validateProfileForm,
    validateRegisterForm,
} from "../../src/utils/validators"

describe("validators", () => {
    describe("isValidEmail", () => {
        it("returns true for a valid email", () => {
            expect(isValidEmail("lyn@example.com")).toBe(true)
        })

        it("returns false for an invalid email", () => {
            expect(isValidEmail("lyn-example.com")).toBe(false)
            expect(isValidEmail("lyn@")).toBe(false)
            expect(isValidEmail("@example.com")).toBe(false)
        })
    })

    describe("validateLoginForm", () => {
        it("requires email and password", () => {
            expect(validateLoginForm("", "")).toBe("Preencha e-mail e senha.")
            expect(validateLoginForm("lyn@example.com", "")).toBe(
                "Preencha e-mail e senha."
            )
        })

        it("requires a valid email", () => {
            expect(validateLoginForm("invalid-email", "123456")).toBe(
                "Digite um e-mail válido."
            )
        })

        it("returns null for valid login data", () => {
            expect(validateLoginForm("lyn@example.com", "123456")).toBeNull()
        })
    })

    describe("validateRegisterForm", () => {
        it("requires all fields", () => {
            expect(validateRegisterForm("", "", "")).toBe(
                "Preencha todos os campos."
            )
        })

        it("requires a name with at least 2 characters", () => {
            expect(validateRegisterForm("L", "lyn@example.com", "123456")).toBe(
                "Digite um nome com pelo menos 2 caracteres."
            )
        })

        it("requires a valid email", () => {
            expect(validateRegisterForm("Lyn", "invalid-email", "123456")).toBe(
                "Digite um e-mail válido."
            )
        })

        it("requires a password with at least 6 characters", () => {
            expect(validateRegisterForm("Lyn", "lyn@example.com", "12345")).toBe(
                "A senha precisa ter pelo menos 6 caracteres."
            )
        })

        it("returns null for valid register data", () => {
            expect(validateRegisterForm("Lyn", "lyn@example.com", "123456")).toBeNull()
        })
    })

    describe("validateProfileForm", () => {
        it("requires name and email", () => {
            expect(validateProfileForm("", "")).toBe("Preencha nome e e-mail.")
        })

        it("requires a name with at least 2 characters", () => {
            expect(validateProfileForm("L", "lyn@example.com")).toBe(
                "Digite um nome com pelo menos 2 caracteres."
            )
        })

        it("requires a valid email", () => {
            expect(validateProfileForm("Lyn", "invalid-email")).toBe(
                "Digite um e-mail válido."
            )
        })

        it("returns null for valid profile data", () => {
            expect(validateProfileForm("Lyn", "lyn@example.com")).toBeNull()
        })
    })
})