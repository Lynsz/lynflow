import { CheckCircle2, ClipboardCheck, Rocket, Terminal } from "lucide-react"
import { Button } from "../ui/Button"
import { useToast } from "../ui/ToastProvider"

const buildCommands = `npm run build`

const gitCommands = `git add .
git commit -m "chore: prepare Lynflow for deploy"
git push`

const deployRoutes = [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/tasks",
    "/goals",
    "/insights",
    "/activity",
    "/profile",
    "/settings",
    "/qualquer-rota",
]

const deploySteps = [
    "Rodar npm run build e confirmar que não existe erro.",
    "Fazer commit final e push para o GitHub.",
    "Entrar na Vercel e importar o repositório do Lynflow.",
    "Conferir se o framework detectado é Vite.",
    "Usar npm run build como Build Command.",
    "Usar dist como Output Directory.",
    "Publicar e testar a URL final.",
    "Adicionar o link do deploy no README, GitHub e LinkedIn.",
]

type CommandBoxProps = {
    title: string
    command: string
}

function CommandBox({ title, command }: CommandBoxProps) {
    const { showToast } = useToast()

    async function copyCommand() {
        try {
            await navigator.clipboard.writeText(command)

            showToast({
                type: "success",
                title: "Comando copiado",
                description: `${title} foi copiado para a área de transferência.`,
            })
        } catch {
            showToast({
                type: "error",
                title: "Não foi possível copiar",
                description: "Copie o comando manualmente.",
            })
        }
    }

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Terminal size={18} className="ly-accent" />
                    <h3 className="font-semibold">{title}</h3>
                </div>

                <Button variant="secondary" size="sm" onClick={copyCommand}>
                    Copiar
                </Button>
            </div>

            <pre className="ly-scrollbar overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--muted)]">
                <code>{command}</code>
            </pre>
        </div>
    )
}

export function DeployGuide() {
    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                    <Rocket size={20} className="ly-accent" />
                    <h3 className="font-semibold">Guia final de publicação</h3>
                </div>

                <p className="text-sm leading-6 text-[var(--text)] opacity-85">
                    Use este guia depois que o checklist pré-deploy estiver completo. Ele
                    serve para fechar o projeto, publicar na Vercel e preparar o link para
                    portfólio.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <CommandBox title="Testar build" command={buildCommands} />
                <CommandBox title="Commit final" command={gitCommands} />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <ClipboardCheck size={18} className="ly-accent" />
                        <h3 className="font-semibold">Rotas para testar</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {deployRoutes.map((route) => (
                            <div
                                key={route}
                                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)]"
                            >
                                <CheckCircle2 size={15} className="ly-accent" />
                                <span>{route}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <Rocket size={18} className="ly-accent" />
                        <h3 className="font-semibold">Passos de publicação</h3>
                    </div>

                    <div className="space-y-3">
                        {deploySteps.map((step, index) => (
                            <div
                                key={step}
                                className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm"
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-500">
                                    {index + 1}
                                </span>

                                <p className="ly-muted leading-6">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <h3 className="mb-2 font-semibold">Configuração esperada na Vercel</h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                        <p className="ly-muted-soft text-xs">Framework</p>
                        <strong className="mt-1 block text-sm">Vite</strong>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                        <p className="ly-muted-soft text-xs">Build Command</p>
                        <strong className="mt-1 block text-sm">npm run build</strong>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
                        <p className="ly-muted-soft text-xs">Output Directory</p>
                        <strong className="mt-1 block text-sm">dist</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}