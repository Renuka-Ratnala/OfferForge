import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ResumeCard from "../components/ResumeCard";
import JobCard from "../components/JobCard";
import ChatbotButton from "../components/ChatbotButton";
import { useState, useEffect } from "react";
import api from "../api/api";

export default function Dashboard() {
    const [analysis, setAnalysis] = useState(null);
    const [jobs, setJobs] = useState([]);
    useEffect(() => {

        const fetchAnalysis = async () => {

            try {

                const response = await api.post(
                    "/users/resume/analyze?jobId=2"
                );

                console.log(response.data);

                setAnalysis(response.data);

            } catch (err) {

                console.log(err);

            }

        };

        fetchAnalysis();

        const fetchJobs = async () => {

            try {

                const response = await api.get("/users/recommendations");

                console.log(response.data);

                setJobs(response.data);

            } catch (err) {

                console.log(err);

            }

        };

        fetchJobs();

    }, []);
    return (
         <div style={{ padding: "30px", flex: 1 }}>

             <h1 style={{ color: "white" }}>
                 Welcome to OfferForge
             </h1>

             <div
                 style={{
                     display: "grid",
                     gridTemplateColumns: "repeat(4,1fr)",
                     gap: "20px",
                     marginTop: "30px"
                 }}
             >
                  <StatCard
                      title="ATS Score"
                      value={analysis ? `${analysis.matchScore}%` : "..."}
                  />
                 <StatCard title="Job Matches" value="24" />
                 <StatCard title="Skills" value="18" />
                 <StatCard title="Interviews" value="2" />
             </div>

             <div
                 style={{
                     display: "grid",
                     gridTemplateColumns: "1fr 1fr",
                     gap: "20px",
                     marginTop: "30px"
                 }}
             >
                  <ResumeCard analysis={analysis} />
                  <JobCard jobs={jobs} />
             </div>

             <ChatbotButton />

         </div>
    );
}