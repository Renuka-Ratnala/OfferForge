import { useNavigate } from "react-router-dom";

export default function HeroSection() {

    const navigate = useNavigate();

    return (

        <div
            style={{
                background:
                    "linear-gradient(135deg,#2563EB,#1D4ED8,#1E40AF)",
                borderRadius: "24px",
                padding: "55px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white",
            }}
        >

            <div>

                <p
                    style={{
                        color: "#FCD34D",
                        fontWeight: "600",
                        marginBottom: "15px"
                    }}
                >
                    👋 Welcome Back
                </p>

                <h1
                    style={{
                        fontSize: "54px",
                        margin: 0,
                        lineHeight: "65px"
                    }}
                >
                    Build Your Dream Career
                    <br />
                    with OfferForge AI
                </h1>

                <p
                    style={{
                        marginTop: "25px",
                        color: "#E2E8F0",
                        fontSize: "18px",
                        maxWidth: "600px",
                        lineHeight: "32px"
                    }}
                >
                    Upload your resume, discover internships,
                    improve your ATS score and receive AI-powered
                    career guidance.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "18px",
                        marginTop: "35px"
                    }}
                >

                    <button
                        onClick={() => navigate("/resume")}
                        style={{
                            padding: "15px 30px",
                            borderRadius: "14px",
                            border: "none",
                            background: "white",
                            color: "#2563EB",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        📄 Upload Resume
                    </button>

                    <button
                        onClick={() => navigate("/jobs")}
                        style={{
                            padding: "15px 30px",
                            borderRadius: "14px",
                            border: "2px solid white",
                            background: "transparent",
                            color: "white",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        💼 Explore Jobs
                    </button>

                    <button
                        onClick={() => navigate("/ai")}
                        style={{
                            padding: "15px 30px",
                            borderRadius: "14px",
                            border: "2px solid white",
                            background: "transparent",
                            color: "white",
                            fontWeight: "700",
                            cursor: "pointer"
                        }}
                    >
                        🤖 AI Coach
                    </button>

                </div>

            </div>

            <div
                style={{
                    fontSize: "150px"
                }}
            >
                🚀
            </div>

        </div>

    );

}