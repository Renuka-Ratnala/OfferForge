import { useEffect, useState } from "react";
import api from "../api/api";
import JobCard from "../components/JobCard";

export default function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        try {

            const response = await api.get("/users/recommendations");
            console.log(response.data[0]);

            setJobs(response.data);

        } catch (err) {

            console.log(err);

        }

    };

    const filteredJobs = jobs.filter(job =>

        job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||

        job.companyName.toLowerCase().includes(search.toLowerCase()) ||

        job.location.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <div
            style={{
                background: "#0F172A",
                minHeight: "100vh",
                padding: "40px"
            }}
        >

            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >

                <h1
                    style={{
                        color: "white",
                        fontSize: "40px",
                        marginBottom: "10px"
                    }}
                >
                    💼 Recommended Jobs
                </h1>

                <p
                    style={{
                        color: "#94A3B8",
                        marginBottom: "30px"
                    }}
                >
                    Find internships and jobs that best match your resume.
                </p>

                <input
                    type="text"
                    placeholder="🔍 Search by job, company or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "15px",
                        borderRadius: "12px",
                        border: "1px solid #334155",
                        background: "#16213E",
                        color: "white",
                        outline: "none",
                        fontSize: "16px",
                        marginBottom: "30px"
                    }}
                />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: "20px",
                        marginBottom: "35px"
                    }}
                >

                    <div
                        style={{
                            background: "#16213E",
                            padding: "20px",
                            borderRadius: "15px",
                            color: "white",
                            textAlign: "center"
                        }}
                    >
                        <h2>{jobs.length}</h2>
                        <p>Total Jobs</p>
                    </div>

                    <div
                        style={{
                            background: "#16213E",
                            padding: "20px",
                            borderRadius: "15px",
                            color: "white",
                            textAlign: "center"
                        }}
                    >
                        <h2>
                            {jobs.length > 0
                                ? Math.max(...jobs.map(j => j.matchScore))
                                : 0}
                            %
                        </h2>
                        <p>Best Match</p>
                    </div>

                    <div
                        style={{
                            background: "#16213E",
                            padding: "20px",
                            borderRadius: "15px",
                            color: "white",
                            textAlign: "center"
                        }}
                    >
                        <h2>
                            {
                                jobs.filter(j => j.matchScore >= 80).length
                            }
                        </h2>
                        <p>High Match Jobs</p>
                    </div>

                </div>

                <JobCard jobs={filteredJobs} />

            </div>

        </div>

    );

}