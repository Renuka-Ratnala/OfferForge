import { FaRobot, FaCheckCircle } from "react-icons/fa";

export default function AIResumeSuggestions({ suggestions }) {

    let tips = [];

    if (Array.isArray(suggestions)) {
        tips = suggestions;
    } else if (typeof suggestions === "string" && suggestions.trim()) {
        tips = suggestions
            .split(".")
            .map((tip) => tip.trim())
            .filter((tip) => tip.length > 0);
    }

    return (

        <div
            style={{
                background: "#111827",
                border: "1px solid #1e293b",
                borderRadius: "15px",
                padding: "22px",
                color: "white",
                marginBottom: "20px"
            }}
        >

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px"
                }}
            >

                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(139, 92, 246, 0.15)",
                        color: "#a78bfa",
                        fontSize: "18px"
                    }}
                >
                    <FaRobot />
                </div>

                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "17px",
                            fontWeight: "600"
                        }}
                    >
                        AI Resume Coach
                    </h2>

                    <p
                        style={{
                            margin: "4px 0 0",
                            color: "#64748b",
                            fontSize: "12px"
                        }}
                    >
                        Personalized resume recommendations
                    </p>
                </div>

            </div>


            {/* Suggestions */}

            {tips.length > 0 ? (

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >

                    {tips.map((tip, index) => (

                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                padding: "12px",
                                borderRadius: "10px",
                                background: "#151e2e"
                            }}
                        >

                            <FaCheckCircle
                                style={{
                                    color: "#22c55e",
                                    marginTop: "2px",
                                    flexShrink: 0
                                }}
                            />

                            <span
                                style={{
                                    color: "#cbd5e1",
                                    fontSize: "13px",
                                    lineHeight: "1.5"
                                }}
                            >
                                {tip.trim()}
                            </span>

                        </div>

                    ))}

                </div>

            ) : (

                /* Empty state */

                <div
                    style={{
                        padding: "20px",
                        borderRadius: "10px",
                        background: "#0f172a",
                        border: "1px dashed #273044",
                        textAlign: "center"
                    }}
                >

                    <FaRobot
                        style={{
                            fontSize: "28px",
                            color: "#8b5cf6",
                            marginBottom: "10px"
                        }}
                    />

                    <p
                        style={{
                            margin: 0,
                            color: "#cbd5e1",
                            fontSize: "14px"
                        }}
                    >
                        Upload your resume to receive AI-powered suggestions.
                    </p>

                    <p
                        style={{
                            margin: "6px 0 0",
                            color: "#64748b",
                            fontSize: "12px"
                        }}
                    >
                        Improve your ATS score and strengthen your resume.
                    </p>

                </div>

            )}

        </div>

    );
}