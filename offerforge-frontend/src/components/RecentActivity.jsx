const activities = [
    {
        title: "Resume Uploaded",
        description: "Your latest resume was uploaded successfully.",
        time: "Today"
    },
    {
        title: "ATS Score Improved",
        description: "Your ATS score increased by 8%.",
        time: "Yesterday"
    },
    {
        title: "New Job Matches",
        description: "5 new internships match your profile.",
        time: "2 days ago"
    },
    {
        title: "AI Career Coach",
        description: "Interview preparation completed.",
        time: "3 days ago"
    }
];

export default function RecentActivity() {

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
                🕒 Recent Activity
            </h2>

            {activities.map((activity, index) => (

                <div
                    key={index}
                    style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "22px",
                        alignItems: "flex-start"
                    }}
                >

                    <div
                        style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            background: "#22C55E",
                            marginTop: "8px"
                        }}
                    />

                    <div>

                        <h3
                            style={{
                                color: "white",
                                marginBottom: "6px"
                            }}
                        >
                            {activity.title}
                        </h3>

                        <p
                            style={{
                                color: "#94A3B8",
                                marginBottom: "4px"
                            }}
                        >
                            {activity.description}
                        </p>

                        <small
                            style={{
                                color: "#64748B"
                            }}
                        >
                            {activity.time}
                        </small>

                    </div>

                </div>

            ))}

        </div>

    );

}