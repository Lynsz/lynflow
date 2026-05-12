import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

const data = [
    { day: "Mon", productivity: 40 },
    { day: "Tue", productivity: 65 },
    { day: "Wed", productivity: 55 },
    { day: "Thu", productivity: 80 },
    { day: "Fri", productivity: 72 },
    { day: "Sat", productivity: 90 },
    { day: "Sun", productivity: 76 },
]

export function ProductivityChart() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">
                Productivity Analytics
            </h2>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="day"
                            stroke="#a1a1aa"
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="productivity"
                            stroke="#ffffff"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}