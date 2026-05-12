type ProgressBarProps = {
    value: number
    label?: string
    showValue?: boolean
}

export function ProgressBar({
    value,
    label,
    showValue = true,
}: ProgressBarProps) {
    const safeValue = Math.min(100, Math.max(0, value))

    return (
        <div>
            {(label || showValue) && (
                <div className="mb-2 flex justify-between text-sm">
                    {label && <span className="ly-muted-soft">{label}</span>}
                    {showValue && <span>{safeValue}%</span>}
                </div>
            )}

            <div className="ly-progress-track h-2 overflow-hidden rounded-full">
                <div
                    className="ly-progress-fill h-full rounded-full transition-all duration-500"
                    style={{ width: `${safeValue}%` }}
                />
            </div>
        </div>
    )
}