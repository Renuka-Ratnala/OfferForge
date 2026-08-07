export default function ResumeHealthCard({ analysis }) {

    const score = analysis?.matchScore || 0;

    let status = "Needs Improvement";

    if (score >= 80) status = "Excellent";
    else if (score >= 60) status = "Good";

    return (

        <div
            style={{
                background: "#16213E",
                borderRadius: "18px",
                padding: "30px",
                height: "100%"
            }}
        >

            <h2 style={{ color: "white" }}>
                📊 Resume Health
            </h2>

            <h1
                style={{
                    color: "#22C55E",
                    fontSize: "48px",
                    margin: "25px 0 10px"
                }}
            >
                {score}%
            </h1>

            <div
                style={{
                    width: "100%",
                    height: "12px",
                    background: "#1E293B",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >

                <div
                    style={{
                        width: `${score}%`,
                        height: "100%",
                        background: "#22C55E"
                    }}
                />

            </div>

            <p
                style={{
                    color: "#CBD5E1",
                    marginTop: "20px"
                }}
            >
                {status}
            </p>

        </div>

    );

}