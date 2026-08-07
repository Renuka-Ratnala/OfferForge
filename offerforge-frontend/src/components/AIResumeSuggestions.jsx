export default function AIResumeSuggestions({ suggestions }) {

    const tips =
        suggestions && suggestions.length > 0
            ? suggestions.split(".").filter(s => s.trim() !== "")
            : [];

    return (

        <div
            style={{
                background: "#16213E",
                borderRadius: "18px",
                padding: "25px",
                marginBottom: "30px"
            }}
        >

            <h2
                style={{
                    color: "white",
                    marginBottom: "20px"
                }}
            >
                🤖 AI Resume Coach
            </h2>

            {
                tips.length > 0 ? (

                    tips.map((tip, index) => (

                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                marginBottom: "15px",
                                color: "white"
                            }}
                        >

                            <span
                                style={{
                                    color: "#22C55E",
                                    marginRight: "10px"
                                }}
                            >
                                ✔
                            </span>

                            <span>{tip.trim()}.</span>

                        </div>

                    ))

                ) : (

                    <p style={{ color: "#94A3B8" }}>
                        No AI suggestions available.
                    </p>

                )
            }

        </div>

    );

}