export default function ATSGauge({ score }) {

    const percentage = Math.min(Math.max(score || 0, 0), 100);

    return (

        <div className="ats-gauge-card">

            <h2>ATS Score</h2>

            <div
                className="ats-circle"
                style={{
                    background: `conic-gradient(
                        #8b5cf6 ${percentage * 3.6}deg,
                        #252d42 0deg
                    )`
                }}
            >

                <div className="ats-circle-inner">

                    <h1>
                        {percentage}%
                    </h1>

                    <p>
                        ATS Score
                    </p>

                </div>

            </div>

            <div className="ats-status">

                {percentage >= 80
                    ? "Excellent match"
                    : percentage >= 60
                        ? "Good match"
                        : percentage > 0
                            ? "Needs improvement"
                            : "Upload your resume"
                }

            </div>

        </div>

    );
}