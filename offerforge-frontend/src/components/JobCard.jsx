import { useState } from "react";
import "./JobCard.css";

export default function JobCard({ jobs = [] }) {

    const [selectedJob, setSelectedJob] = useState(null);


    /* ============================================================
       EMPTY STATE
       ============================================================ */

    if (jobs.length === 0) {
        return (
            <div className="no-recommended-jobs">
                No recommended jobs found.
            </div>
        );
    }


    /* ============================================================
       APPLY
       ============================================================ */

    const handleApply = (job) => {

        if (!job.externalUrl) {
            console.warn(
                "No external application URL available for:",
                job.jobTitle
            );
            return;
        }

        window.open(
            job.externalUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    /* ============================================================
       MATCH CLASS
       ============================================================ */

    const getMatchClass = (score) => {

        const matchScore = Number(score) || 0;

        if (matchScore >= 80) {
            return "match-high";
        }

        if (matchScore >= 60) {
            return "match-medium";
        }

        return "match-low";
    };


    /* ============================================================
       RENDER
       ============================================================ */

    return (

        <div className="jobs-list">

            {jobs.map((job) => {

                const isSelected =
                    selectedJob === job.jobId;

                const matchClass =
                    getMatchClass(job.matchScore);


                return (

                    <div
                        key={job.jobId}
                        className="job-card"
                    >

                        {/* =================================================
                           HEADER
                           ================================================= */}

                        <div className="job-header">

                            <div className="job-heading">

                                <h2 className="job-title">
                                    {job.jobTitle}
                                </h2>

                                <div className="company">
                                    🏢 {job.companyName}
                                </div>

                            </div>


                            {/* =================================================
                               MATCH + DETAILS
                               ================================================= */}

                            <div className="job-actions">

                                <div
                                    className={`match-badge ${matchClass}`}
                                >
                                    ⭐ {job.matchScore}% Match
                                </div>


                                <button
                                    className="details-btn secondary-btn"
                                    onClick={() =>
                                        setSelectedJob(
                                            isSelected
                                                ? null
                                                : job.jobId
                                        )
                                    }
                                >
                                    {isSelected
                                        ? "Hide Details"
                                        : "View Details"}
                                </button>

                            </div>

                        </div>


                        {/* =================================================
                           JOB INFORMATION
                           ================================================= */}

                        <div className="job-info">

                            <span>
                                📍 {job.location || "Location not specified"}
                            </span>

                            <span>
                                💼 {job.jobType || "Not specified"}
                            </span>

                            <span>
                                💰 ₹
                                {Number(job.salary || 0)
                                    .toLocaleString("en-IN")}
                            </span>

                        </div>


                        {/* =================================================
                           DETAILS
                           ================================================= */}

                        {isSelected && (

                            <div className="details">


                                {/* =================================================
                                   DESCRIPTION
                                   ================================================= */}

                                <div className="description-box">

                                    <h3>
                                        📄 Job Description
                                    </h3>

                                    <p>
                                        {job.description ||
                                            "No job description available."}
                                    </p>

                                </div>


                                {/* =================================================
                                   MATCHED SKILLS
                                   ================================================= */}

                                <h3>
                                    ✅ Matched Skills
                                </h3>

                                <div className="skills">

                                    {job.matchedSkills?.length > 0 ? (

                                        job.matchedSkills.map(
                                            (skill) => (

                                                <span
                                                    key={skill}
                                                    className="skill-green"
                                                >
                                                    {skill}
                                                </span>

                                            )
                                        )

                                    ) : (

                                        <span className="empty-skill">
                                            No matched skills
                                        </span>

                                    )}

                                </div>


                                {/* =================================================
                                   MISSING SKILLS
                                   ================================================= */}

                                <h3 className="missing-skills-title">
                                    ❌ Missing Skills
                                </h3>

                                <div className="skills">

                                    {job.missingSkills?.length > 0 ? (

                                        job.missingSkills.map(
                                            (skill) => (

                                                <span
                                                    key={skill}
                                                    className="skill-red"
                                                >
                                                    {skill}
                                                </span>

                                            )
                                        )

                                    ) : (

                                        <span className="empty-skill">
                                            No major skill gaps 🎉
                                        </span>

                                    )}

                                </div>


                                {/* =================================================
                                   AI CAREER ADVICE
                                   ================================================= */}

                                <div className="ai-box">

                                    <h3 className="ai-title">
                                        🤖 AI Career Advice
                                    </h3>

                                    <p>
                                        {job.aiRecommendation ||
                                            "No additional advice available."}
                                    </p>


                                    <div className="interview-chance">

                                        🎯 Interview Chance:

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
                                            {job.interviewChance || "Unknown"}
                                        </span>

                                    </div>

                                </div>


                                {/* =================================================
                                   APPLY
                                   ================================================= */}

                                <div className="apply-container">

                                    {job.externalUrl ? (

                                        <button
                                            className="apply-btn"
                                            onClick={() =>
                                                handleApply(job)
                                            }
                                        >
                                            🚀 View Job & Apply ↗
                                        </button>

                                    ) : (

                                        <button
                                            className="apply-btn apply-disabled"
                                            disabled
                                            title="Application link is not available"
                                        >
                                            Application Link Unavailable
                                        </button>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                );
            })}

        </div>
    );
}