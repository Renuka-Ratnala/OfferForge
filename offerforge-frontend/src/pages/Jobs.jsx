import { useEffect, useState } from "react";
import api from "../api/api";
import JobCard from "../components/JobCard";

import "./Jobs.css";

export default function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        try {

            const response = await api.get("/users/recommendations");

            console.log("Recommended jobs:", response.data);

            setJobs(response.data);

        } catch (err) {

            console.log("Jobs fetch error:", err);

        }

    };

    const filteredJobs = jobs.filter((job) => {

        const title = job.jobTitle?.toLowerCase() || "";
        const company = job.companyName?.toLowerCase() || "";
        const location = job.location?.toLowerCase() || "";

        const query = search.toLowerCase();

        return (
            title.includes(query) ||
            company.includes(query) ||
            location.includes(query)
        );

    });

    const bestMatch =
        jobs.length > 0
            ? Math.max(...jobs.map((job) => job.matchScore || 0))
            : 0;

    const highMatchJobs =
        jobs.filter((job) => (job.matchScore || 0) >= 80).length;

    return (

        <div className="jobs-page">

            {/* ================= HEADER ================= */}

            <div className="jobs-header">

                <div>

                    <h1>
                        Find Your Next Opportunity <span>💼</span>
                    </h1>

                    <p>
                        Discover internships and jobs that match your skills and career goals.
                    </p>

                </div>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="jobs-search">

                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search jobs, companies or locations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>


            {/* ================= STATS ================= */}

            <div className="jobs-stats">

                <div className="job-stat-card purple-stat">

                    <div className="job-stat-icon">
                        💼
                    </div>

                    <div>

                        <p>Total Jobs</p>

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

                        <p>Best Match</p>

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

                        <p>High Match Jobs</p>

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
                            Recommended Jobs
                        </h2>

                        <p>
                            Opportunities selected based on your profile.
                        </p>

                    </div>

                    <span className="jobs-count">
                        {filteredJobs.length} opportunities
                    </span>

                </div>


                {/* ================= JOB CARDS ================= */}

                {filteredJobs.length > 0 ? (

                    <JobCard jobs={filteredJobs} />

                ) : (

                    <div className="no-jobs">

                        <div className="no-jobs-icon">
                            🔍
                        </div>

                        <h3>
                            No matching jobs found
                        </h3>

                        <p>
                            Try searching for a different job title, company or location.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}