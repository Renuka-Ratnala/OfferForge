import StatCard from "./StatCard";

export default function DashboardStats({ stats }) {

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "20px",
                marginTop: "30px"
            }}
        >

            <StatCard
                icon="📄"
                title="Resume Status"
                value={stats.resumeUploaded ? "Uploaded" : "Pending"}
                color="#22C55E"
            />

            <StatCard
                icon="📊"
                title="ATS Score"
                value={`${stats.atsScore}%`}
                color="#3B82F6"
            />

            <StatCard
                icon="💼"
                title="Job Matches"
                value={stats.jobMatches}
                color="#F59E0B"
            />

            <StatCard
                icon="👤"
                title="Profile"
                value={`${stats.profileCompletion}%`}
                color="#A855F7"
            />

        </div>

    );

}