import { Download } from "lucide-react"
import { useInstallPrompt } from "../../hooks/useInstallPrompt"
import { Button } from "../ui/Button"
import { useToast } from "../ui/ToastProvider"

type StatusBadgeProps = {
    label: string
    active: boolean
    activeText: string
    inactiveText: string
}

function StatusBadge({
    label,
    active,
    activeText,
    inactiveText,
}: StatusBadgeProps) {
    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <p className="ly-muted-soft text-sm">{label}</p>

            <strong className="mt-2 block text-base">
                {active ? activeText : inactiveText}
            </strong>

            <span
                className={[
                    "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    active
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400",
                ].join(" ")}
            >
                {active ? "Ativo" : "Atenção"}
            </span>
        </div>
    )
}

export function PwaStatus() {
    const { showToast } = useToast()

    const {
        canInstall,
        installStatusLabel,
        isOnline,
        isServiceWorkerReady,
        isServiceWorkerSupported,
        isStandalone,
        promptInstall,
    } = useInstallPrompt()

    async function handleInstall() {
        const wasInstalled = await promptInstall()

        if (wasInstalled) {
            showToast({
                type: "success",
                title: "Lynflow instalado",
                description: "O app foi instalado com sucesso neste dispositivo.",
            })

            return
        }

        showToast({
            type: "info",
            title: "Instalação cancelada",
            description: "O Lynflow continua disponível pelo navegador.",
        })
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatusBadge
                    label="Conexão"
                    active={isOnline}
                    activeText="Online"
                    inactiveText="Offline"
                />

                <StatusBadge
                    label="Service Worker"
                    active={isServiceWorkerSupported && isServiceWorkerReady}
                    activeText="Ativo"
                    inactiveText={
                        isServiceWorkerSupported
                            ? "Carregando"
                            : "Não suportado"
                    }
                />

                <StatusBadge
                    label="Modo app"
                    active={isStandalone}
                    activeText="Standalone"
                    inactiveText="Navegador"
                />

                <StatusBadge
                    label="Instalação"
                    active={canInstall || isStandalone}
                    activeText={installStatusLabel}
                    inactiveText={installStatusLabel}
                />
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-medium">Instalar Lynflow</p>

                    <p className="ly-muted-soft mt-1 text-sm leading-6">
                        Quando disponível, o navegador permite instalar o Lynflow
                        como aplicativo no computador ou celular.
                    </p>
                </div>

                <Button
                    variant="secondary"
                    icon={<Download size={18} />}
                    onClick={handleInstall}
                    disabled={!canInstall}
                >
                    {canInstall ? "Instalar app" : "Instalação indisponível"}
                </Button>
            </div>
        </div>
    )
}