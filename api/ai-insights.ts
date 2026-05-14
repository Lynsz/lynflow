import { Buffer } from "node:buffer"
import process from "node:process"
import type { IncomingMessage, ServerResponse } from "node:http"
import type { AiInsight, AiInsightsPayload } from "../src/services/aiInsights"

type ApiRequest = IncomingMessage & {
    body?: unknown
    method?: string
}

type OpenAiTextResponse = {
    output_text?: unknown
    output?: unknown
}

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
const DEFAULT_MODEL = "gpt-5.4-mini"

function sendJson(
    response: ServerResponse,
    statusCode: number,
    body: Record<string, unknown>
) {
    response.statusCode = statusCode
    response.setHeader("Content-Type", "application/json")
    response.end(JSON.stringify(body))
}

function isPayload(value: unknown): value is AiInsightsPayload {
    if (!value || typeof value !== "object") {
        return false
    }

    const payload = value as Partial<AiInsightsPayload>

    return (
        typeof payload.generatedAt === "string" &&
        Boolean(payload.summary) &&
        typeof payload.summary === "object"
    )
}

function isAiInsight(value: unknown): value is AiInsight {
    if (!value || typeof value !== "object") {
        return false
    }

    const insight = value as Partial<AiInsight>

    return (
        typeof insight.id === "string" &&
        typeof insight.title === "string" &&
        typeof insight.description === "string" &&
        typeof insight.action === "string" &&
        typeof insight.tone === "string"
    )
}

function normalizeInsights(value: unknown) {
    if (!value || typeof value !== "object") {
        return null
    }

    const parsed = value as {
        insights?: unknown
        message?: unknown
    }

    if (!Array.isArray(parsed.insights)) {
        return null
    }

    const insights = parsed.insights.filter(isAiInsight).slice(0, 4)

    if (insights.length === 0) {
        return null
    }

    return {
        insights,
        message:
            typeof parsed.message === "string"
                ? parsed.message
                : "Recomendacoes geradas com IA real.",
    }
}

function extractTextFromOpenAiResponse(value: OpenAiTextResponse) {
    if (typeof value.output_text === "string") {
        return value.output_text
    }

    return JSON.stringify(value.output ?? "")
}

async function readBody(request: ApiRequest) {
    if (request.body) {
        return request.body
    }

    const chunks: Buffer[] = []

    for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }

    const rawBody = Buffer.concat(chunks).toString("utf8")

    return rawBody ? JSON.parse(rawBody) : null
}

function buildPrompt(payload: AiInsightsPayload) {
    return [
        "Voce e um assistente de produtividade dentro do Lynflow.",
        "Gere recomendacoes curtas, praticas e em portugues do Brasil.",
        "Responda apenas JSON valido no formato:",
        '{"message":"string","insights":[{"id":"string","title":"string","description":"string","action":"string","tone":"positive|warning|critical|neutral"}]}',
        "Use no maximo 4 insights. Baseie-se somente nos dados abaixo.",
        JSON.stringify(payload),
    ].join("\n\n")
}

export default async function handler(
    request: ApiRequest,
    response: ServerResponse
) {
    if (request.method !== "POST") {
        sendJson(response, 405, { error: "Method not allowed" })
        return
    }

    if (process.env.AI_PROVIDER && process.env.AI_PROVIDER !== "openai") {
        sendJson(response, 503, { error: "AI provider is not enabled." })
        return
    }

    if (!process.env.OPENAI_API_KEY) {
        sendJson(response, 503, { error: "OPENAI_API_KEY is not configured." })
        return
    }

    const body = await readBody(request)

    if (!isPayload(body)) {
        sendJson(response, 400, { error: "Invalid AI insights payload." })
        return
    }

    try {
        const openAiResponse = await fetch(OPENAI_RESPONSES_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
                input: buildPrompt(body),
            }),
        })

        if (!openAiResponse.ok) {
            sendJson(response, 502, { error: "OpenAI request failed." })
            return
        }

        const data = (await openAiResponse.json()) as OpenAiTextResponse
        const parsed = JSON.parse(extractTextFromOpenAiResponse(data))
        const normalized = normalizeInsights(parsed)

        if (!normalized) {
            sendJson(response, 502, { error: "OpenAI response was invalid." })
            return
        }

        sendJson(response, 200, normalized)
    } catch {
        sendJson(response, 502, { error: "AI insights generation failed." })
    }
}
