import { useEffect, useState } from "react";
import api from "../api/api";
import JobCard from "../components/JobCard";

import "./Jobs.css";

export default function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [aiError, setAiError] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);


    // ============================================================
    // CONVERT PYTHON SNAKE_CASE → FRONTEND camelCase
    // ============================================================

    const normalizeAIJob = (job) => {

        return {

            jobId:
                job.job_id,

            jobTitle:
                job.job_title,

            companyName:
                job.company_name,

            location:
                job.location,

            jobType:
                job.job_type,

            salary:
                job.salary,

            description:
                job.description,

            requiredSkills:
                job.required_skills,

            // NEW: REAL JOB APPLICATION URL
            externalUrl:
                job.external_url,

            matchScore:
                job.match_score ?? 0,

            matchedSkills:
                job.matched_skills || [],

            missingSkills:
                job.missing_skills || [],

            aiRecommendation:
                job.ai_recommendation,

            interviewChance:
                job.interview_chance,

            reason:
                job.reason
        };
    };


    // ============================================================
    // FETCH AI RECOMMENDATIONS
    // ============================================================

    const fetchJobs = async () => {

        setLoading(true);
        setAiError(false);

        try {

            const response = await api.post(
                "/ai/recommend",
                {
                    message:
                        "Find the best jobs for my profile."
                }
            );

            console.log(
                "AI job recommendations:",
                response.data
            );

            const recommendations =
                response.data?.recommendations || [];

            // Convert Python response to frontend format
            const normalizedJobs =
                recommendations.map(
                    normalizeAIJob
                );

            console.log(
                "Normalized AI jobs:",
                normalizedJobs
            );

            setJobs(
                normalizedJobs
            );

        } catch (err) {

            console.error(
                "AI job recommendation error:",
                err
            );


            // ====================================================
            // FALLBACK
            // ====================================================

            try {

                const fallbackResponse =
                    await api.get(
                        "/users/recommendations"
                    );

                console.log(
                    "Fallback job recommendations:",
                    fallbackResponse.data
                );

                const fallbackJobs =
                    Array.isArray(
                        fallbackResponse.data
                    )
                        ? fallbackResponse.data
                        : fallbackResponse.data?.recommendations || [];

                setJobs(
                    fallbackJobs
                );

                setAiError(true);

            } catch (fallbackError) {

                console.error(
                    "Fallback job fetch error:",
                    fallbackError
                );

                setJobs([]);

                setAiError(true);
            }

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // SEARCH
    // ============================================================

    const filteredJobs =
        jobs.filter((job) => {

            const title =
                job.jobTitle?.toLowerCase() || "";

            const company =
                job.companyName?.toLowerCase() || "";

            const location =
                job.location?.toLowerCase() || "";

            const query =
                search.toLowerCase().trim();

            return (
                title.includes(query) ||
                company.includes(query) ||
                location.includes(query)
            );
        });


    // ============================================================
    // STATISTICS
    // ============================================================

    const bestMatch =
        jobs.length > 0
            ? Math.max(
                ...jobs.map(
                    (job) =>
                        Number(job.matchScore) || 0
                )
            )
            : 0;


    const highMatchJobs =
        jobs.filter(
            (job) =>
                (Number(job.matchScore) || 0) >= 80
        ).length;


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="jobs-page">

            {/* ================= HEADER ================= */}

            <div className="jobs-header">

                <div>

                    <h1>
                        Find Your Next Opportunity
                        <span>💼</span>
                    </h1>

                    <p>
                        AI-powered opportunities matched
                        to your skills and career goals.
                    </p>

                </div>

            </div>


            {/* ================= AI STATUS ================= */}

            {aiError && (

                <div
                    style={{
                        marginBottom: "18px",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background:
                            "rgba(245, 158, 11, 0.10)",
                        border:
                            "1px solid rgba(245, 158, 11, 0.25)",
                        color: "#fbbf24",
                        fontSize: "13px"
                    }}
                >
                    ⚡ AI recommendations are temporarily
                    unavailable. Showing available job matches.
                </div>

            )}


            {/* ================= SEARCH ================= */}

            <div className="jobs-search">

                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search jobs, companies or locations..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* ================= STATS ================= */}

            <div className="jobs-stats">

                <div className="job-stat-card purple-stat">

                    <div className="job-stat-icon">
                        💼
                    </div>

                    <div>

                        <p>
                            Recommended Jobs
                        </p>

                        <h2>
                            {jobs.length}
                        </h2>

                    </div>

                </div>


                <div className="job-stat-card blue-stat">

                    <div className="job-stat-icon">
                        📈
                    </div>

                    <div>

                        <p>
                            Best Match
                        </p>

                        <h2>
                            {bestMatch}%
                        </h2>

                    </div>

                </div>


                <div className="job-stat-card green-stat">

                    <div className="job-stat-icon">
                        🎯
                    </div>

                    <div>

                        <p>
                            High Match Jobs
                        </p>

                        <h2>
                            {highMatchJobs}
                        </h2>

                    </div>

                </div>

            </div>


            {/* ================= JOB SECTION ================= */}

            <div className="jobs-section">

                <div className="jobs-section-header">

                    <div>

                        <h2>
                            AI Recommended Jobs
                        </h2>

                        <p>
                            Jobs ranked using your profile,
                            skills and semantic matching.
                        </p>

                    </div>

                    <span className="jobs-count">

                        {filteredJobs.length}
                        {" "}
                        opportunities

                    </span>

                </div>


                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="no-jobs">

                        <div className="no-jobs-icon">
                            🤖
                        </div>

                        <h3>
                            Finding your best opportunities...
                        </h3>

                        <p>
                            OfferForge AI is analyzing your
                            profile and matching relevant jobs.
                        </p>

                    </div>

                ) : filteredJobs.length > 0 ? (

                    <JobCard
                        jobs={filteredJobs}
                    />

                ) : (

                    <div className="no-jobs">

                        <div className="no-jobs-icon">
                            🔍
                        </div>

                        <h3>
                            No matching jobs found
                        </h3>

                        <p>
                            Try searching for a different
                            job title, company or location.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );
}