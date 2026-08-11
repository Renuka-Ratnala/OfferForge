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

    const statusConfig = {
        good: {
            icon: "✓",
            label: "Good"
        },
        warning: {
            icon: "!",
            label: "Needs attention"
        },
        missing: {
            icon: "×",
            label: "Missing"
        }
    };

    return (

        <div className="resume-health">

            <div className="resume-health-header">

                <div>
                    <h2>
                        📋 Resume Health
                    </h2>

                    <p>
                        Check the important sections of your resume.
                    </p>
                </div>

            </div>


            <div className="health-grid">

                {items.map((item) => {

                    const config = statusConfig[item.status];

                    return (

                        <div
                            key={item.title}
                            className={`health-item ${item.status}`}
                        >

                            <div className="health-icon">
                                {config.icon}
                            </div>

                            <div className="health-info">

                                <h3>
                                    {item.title}
                                </h3>

                                <span>
                                    {config.label}
                                </span>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );
}