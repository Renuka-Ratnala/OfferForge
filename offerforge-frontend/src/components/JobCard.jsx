import { useState } from "react";
import "./JobCard.css";

export default function JobCard({ jobs = [] }) {
    const [selectedJob, setSelectedJob] = useState(null);

    if (jobs.length === 0) {
        return (
            <div
                style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: "40px",
                    fontSize: "20px"
                }}
            >
                No recommended jobs found.
            </div>
        );
    }

    const handleApply = (job) => {

        if (job.externalUrl) {

            window.open(
                job.externalUrl,
                "_blank",
                "noopener,noreferrer"
            );

        } else {

            console.warn(
                "No external application URL available for:",
                job.jobTitle
            );

        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px"
            }}
        >
            {jobs.map((job) => (
                <div
                    key={job.jobId}
                    className="job-card"
                >

                    {/* ================= HEADER ================= */}

                    <div className="job-header">

                        <div>

                            <h2 className="job-title">
                                {job.jobTitle}
                            </h2>

                            <div className="company">
                                🏢 {job.companyName}
                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "15px",
                                alignItems: "center"
                            }}
                        >

                            <div className="match-badge">
                                ⭐ {job.matchScore}% Match
                            </div>


                            <button
                                className="details-btn"
                                onClick={() =>
                                    setSelectedJob(
                                        selectedJob === job.jobId
                                            ? null
                                            : job.jobId
                                    )
                                }
                            >
                                {selectedJob === job.jobId
                                    ? "Hide Details"
                                    : "View Details"}
                            </button>

                        </div>

                    </div>


                    {/* ================= JOB INFO ================= */}

                    <div className="job-info">

                        <span>
                            📍 {job.location}
                        </span>

                        <span>
                            💼 {job.jobType}
                        </span>

                        <span>
                            💰 ₹
                            {Number(job.salary).toLocaleString("en-IN")}
                        </span>

                    </div>


                    {/* ================= DETAILS ================= */}

                    {selectedJob === job.jobId && (

                        <div className="details">

                            {/* JOB DESCRIPTION */}

                            <div className="description-box">

                                <h3>
                                    📄 Job Description
                                </h3>

                                <p>
                                    {job.description}
                                </p>

                            </div>


                            {/* MATCHED SKILLS */}

                            <h3>
                                ✅ Matched Skills
                            </h3>

                            <div className="skills">

                                {(job.matchedSkills || []).map(
                                    (skill) => (

                                        <span
                                            key={skill}
                                            className="skill-green"
                                        >
                                            {skill}
                                        </span>

                                    )
                                )}

                            </div>


                            {/* MISSING SKILLS */}

                            <h3
                                style={{
                                    marginTop: "30px"
                                }}
                            >
                                ❌ Missing Skills
                            </h3>

                            <div className="skills">

                                {(job.missingSkills || []).map(
                                    (skill) => (

                                        <span
                                            key={skill}
                                            className="skill-red"
                                        >
                                            {skill}
                                        </span>

                                    )
                                )}

                            </div>


                            {/* AI CAREER ADVICE */}

                            <div className="ai-box">

                                <h3 className="ai-title">
                                    🤖 AI Career Advice
                                </h3>

                                <p>
                                    {job.aiRecommendation}
                                </p>


                                <div
                                    style={{
                                        marginTop: "20px",
                                        fontWeight: "700"
                                    }}
                                >

                                    🎯 Interview Chance :

                                    <span
                                        className={
                                            job.interviewChance === "High"
                                                ? "high"
                                                : job.interviewChance === "Medium"
                                                ? "medium"
                                                : "low"
                                        }
                                    >
                                        {" "}
                                        {job.interviewChance}
                                    </span>

                                </div>

                            </div>


                            {/* ================= APPLY BUTTON ================= */}

                            <div
                                style={{
                                    marginTop: "25px",
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >

                                {job.externalUrl ? (

                                    <button
                                        className="details-btn"
                                        onClick={() =>
                                            handleApply(job)
                                        }
                                    >
                                        🚀 View Job & Apply ↗
                                    </button>

                                ) : (

                                    <button
                                        className="details-btn"
                                        disabled
                                        title="Application link is not available"
                                        style={{
                                            opacity: 0.5,
                                            cursor: "not-allowed"
                                        }}
                                    >
                                        Application Link Unavailable
                                    </button>

                                )}

                            </div>

                        </div>

                    )}

                </div>
            ))}
        </div>
    );
}