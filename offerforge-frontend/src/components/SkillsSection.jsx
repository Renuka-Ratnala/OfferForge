export default function SkillsSection({ title, skills, matched }) {

    return (

        <div
            style={{
                background: "#16213E",
                borderRadius: "18px",
                padding: "25px",
                height: "100%"
            }}
        >

            <h2 style={{ color: "white", marginBottom: "20px" }}>
                {title}
            </h2>

            {
                skills && skills.length > 0 ? (

                    skills.map((skill, index) => (

                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "15px",
                                color: "white"
                            }}
                        >

                            <span
                                style={{
                                    color: matched ? "#22C55E" : "#EF4444",
                                    marginRight: "10px",
                                    fontSize: "18px"
                                }}
                            >
                                {matched ? "✔" : "✖"}
                            </span>

                            {skill}

                        </div>

                    ))

                ) : (

                    <p style={{ color: "#94A3B8" }}>
                        No skills available.
                    </p>

                )
            }

        </div>

    );

}