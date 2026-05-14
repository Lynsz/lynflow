import { CheckCircle2, Moon, Palette, Sun } from "lucide-react"
import { useTheme } from "../../hooks/useTheme"
import { useToast } from "../ui/ToastProvider"

export function AppearanceSettings() {
    const { isDark, toggleTheme } = useTheme()
    const { showToast } = useToast()

    function handleToggleTheme() {
        toggleTheme()

        showToast({
            type: "success",
            title: "Tema atualizado",
            description: `Tema ${isDark ? "claro" : "escuro"} ativado.`,
        })
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
                    <div className="mb-5 flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)]">
                            <Palette size={21} aria-hidden="true" />
                        </div>

                        <div>
                            <p className="font-semibold text-[var(--text)]">
                                Preferência visual
                            </p>

                            <p className="ly-muted-soft mt-1 text-sm leading-6">
                                Escolha o tema que combina melhor com seu ambiente de
                                trabalho. A preferência fica salva no navegador.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleTheme}
                        className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 text-sm transition hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
                        aria-label={
                            isDark ? "Ativar tema claro" : "Ativar tema escuro"
                        }
                        title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
                        aria-pressed={isDark ? "true" : "false"}
                    >
                        <span
                            className={`absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-[var(--primary)] shadow-lg shadow-black/20 transition-transform duration-300 ${isDark
                                    ? "translate-x-[calc(100%+0.375rem)]"
                                    : "translate-x-0"
                                }`}
                            aria-hidden="true"
                        />

                        <span
                            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 transition ${!isDark ? "text-white" : "text-[var(--muted)]"
                                }`}
                        >
                            <Sun size={16} aria-hidden="true" />
                            <span className="font-medium">Light</span>
                        </span>

                        <span
                            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 transition ${isDark ? "text-white" : "text-[var(--muted)]"
                                }`}
                        >
                            <Moon size={16} aria-hidden="true" />
                            <span className="font-medium">Dark</span>
                        </span>
                    </button>

                    <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={16}
                                className="text-emerald-400"
                                aria-hidden="true"
                            />

                            <p className="text-sm font-medium text-[var(--text)]">
                                Tema atual: {isDark ? "Escuro" : "Claro"}
                            </p>
                        </div>

                        <p className="ly-muted-soft mt-2 text-sm leading-6">
                            {isDark
                                ? "Ideal para trabalhar à noite, reduzir brilho e manter foco visual."
                                : "Ideal para leitura, revisão de layout e uso em ambientes claros."}
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-[var(--text)]">
                                Preview da interface
                            </p>

                            <p className="ly-muted-soft text-xs">
                                Exemplo visual do tema aplicado.
                            </p>
                        </div>

                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
                            {isDark ? "Dark" : "Light"}
                        </span>
                    </div>

                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <div className="h-3 w-24 rounded-full bg-[var(--text)]/80" />
                                <div className="mt-2 h-2 w-36 rounded-full bg-[var(--muted-soft)]/40" />
                            </div>

                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)]">
                                {isDark ? (
                                    <Moon size={17} aria-hidden="true" />
                                ) : (
                                    <Sun size={17} aria-hidden="true" />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                                <div className="h-2 w-10 rounded-full bg-[var(--primary)]" />
                                <div className="mt-3 h-6 rounded-xl bg-[var(--muted-soft)]/20" />
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                                <div className="h-2 w-12 rounded-full bg-emerald-400" />
                                <div className="mt-3 h-6 rounded-xl bg-[var(--muted-soft)]/20" />
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                                <div className="h-2 w-8 rounded-full bg-amber-400" />
                                <div className="mt-3 h-6 rounded-xl bg-[var(--muted-soft)]/20" />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                                <div className="h-2 w-32 rounded-full bg-[var(--text)]/70" />
                                <div className="mt-2 h-2 w-full rounded-full bg-[var(--muted-soft)]/20" />
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
                                <div className="h-2 w-24 rounded-full bg-[var(--text)]/70" />
                                <div className="mt-2 h-2 w-4/5 rounded-full bg-[var(--muted-soft)]/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}