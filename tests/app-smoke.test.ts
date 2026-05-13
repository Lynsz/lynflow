import { render, screen } from "@testing-library/react"
import { createElement } from "react"
import { describe, expect, it } from "vitest"
import App from "../src/App"

describe("App", () => {
    it("renders the landing route without crashing", async () => {
        window.history.pushState({}, "", "/")

        render(createElement(App))

        expect(await screen.findByText("Lynflow")).toBeTruthy()
    })
})
