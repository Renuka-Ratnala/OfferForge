export default function ATSGauge({ score }) {

    const percentage = score || 0;

    return (

        <div
            style={{
                background: "#16213E",
                borderRadius: "18px",
                padding: "30px",
                textAlign: "center"
            }}
        >

            <h2
                style={{
                    color: "white",
                    marginBottom: "25px"
                }}
            >
                ATS Score
            </h2>

            <div
                style={{
                    width: "180px",
                    height: "180px",
                    margin: "auto",
                    borderRadius: "50%",
                    background: `conic-gradient(
                        #2563EB ${percentage * 3.6}deg,
                        #23324E 0deg
                    )`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <div
                    style={{
                        width: "140px",
                        height: "140px",
                        borderRadius: "50%",
                        background: "#0F172A",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >

                    <h1
                        style={{
                            color: "#38BDF8",
                            margin: 0,
                            fontSize: "42px"
                        }}
                    >
                        {percentage}%
                    </h1>

                    <p
                        style={{
                            color: "#94A3B8",
                            marginTop: "8px"
                        }}
                    >
                        ATS Score
                    </p>

                </div>

            </div>

        </div>

    );

}