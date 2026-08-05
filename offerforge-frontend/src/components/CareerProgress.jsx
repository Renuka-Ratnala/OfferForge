import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const data = [
    { week: "Week 1", score: 58 },
    { week: "Week 2", score: 64 },
    { week: "Week 3", score: 71 },
    { week: "Week 4", score: 78 }
];

export default function CareerProgress() {

    return (

        <div
            style={{
                background: "#16213E",
                padding: "30px",
                borderRadius: "20px",
                marginTop: "35px"
            }}
        >

            <h2
                style={{
                    color: "white",
                    marginBottom: "25px"
                }}
            >
                📈 Career Progress
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart data={data}>

                    <CartesianGrid stroke="#334155" />

                    <XAxis
                        dataKey="week"
                        stroke="#94A3B8"
                    />

                    <YAxis
                        stroke="#94A3B8"
                    />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={4}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}