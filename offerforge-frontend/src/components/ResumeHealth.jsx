export default function ResumeHealth() {

    const items = [
        { title: "Contact Information", status: "good" },
        { title: "Education", status: "good" },
        { title: "Technical Skills", status: "good" },
        { title: "Projects", status: "good" },
        { title: "Achievements", status: "warning" },
        { title: "Certifications", status: "warning" },
        { title: "GitHub Portfolio", status: "missing" }
    ];

    return (

        <div
            style={{
                background: "#16213E",
                borderRadius: "18px",
                padding: "25px"
            }}
        >

            <h2 style={{ color: "white" }}>
                📋 Resume Health
            </h2>

            <div
                style={{
                    marginTop: "20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px"
                }}
            >

                {items.map((item) => (

                    <div
                        key={item.title}
                        style={{
                            color:
                                item.status === "good"
                                    ? "#22C55E"
                                    : item.status === "warning"
                                    ? "#F59E0B"
                                    : "#EF4444"
                        }}
                    >

                        {item.status === "good"
                            ? "✅"
                            : item.status === "warning"
                            ? "⚠️"
                            : "❌"}{" "}

                        {item.title}

                    </div>

                ))}

            </div>

        </div>

    );

}