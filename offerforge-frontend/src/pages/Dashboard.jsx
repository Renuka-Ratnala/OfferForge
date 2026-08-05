import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import StatCard from "../components/StatCard";
import ChatbotButton from "../components/ChatbotButton";
import api from "../api/api";
import DashboardStats from "../components/DashboardStats";
import CareerProgress from "../components/CareerProgress";
import FeaturedCompanies from "../components/FeaturedCompanies";

import AICareerTips from "../components/AICareerTips";

export default function Dashboard() {

    const [jobs, setJobs] = useState([]);
    const [profile, setProfile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [dashboard, setDashboard] = useState(null);


     useEffect(() => {

         fetchDashboard();

     }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            setProfile(response.data);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchDashboard = async () => {

        try {

            const response = await api.get("/dashboard");

            console.log(response.data);

            setDashboard(response.data);

        } catch (err) {

            console.log(err);

        }

    };

    return (
        <div
            style={{
                flex: 1,
                padding: "40px",
                background: "#0F172A",
                minHeight: "100vh",
            }}
        >



            {/* Overview Cards */}

              <HeroSection />

               <DashboardStats
                   stats={{
                       resumeUploaded: dashboard?.resumeUploaded || false,
                       atsScore: dashboard?.atsScore || 0,
                       jobMatches: dashboard?.jobMatches || 0,
                       profileCompletion: dashboard?.profileCompletion || 0,
                   }}
               />

               <div
                   style={{
                       display:"grid",
                       gridTemplateColumns:"2fr 1fr",
                       gap:"25px",
                       marginTop:"35px"
                   }}
               >





               </div>

               <div
                   style={{
                       display:"grid",
                       gridTemplateColumns:"2fr 1fr",
                       gap:"25px",
                       marginTop:"35px"
                   }}
               >



               </div>
               <div
                   style={{
                       display:"grid",
                       gridTemplateColumns:"2fr 1fr",
                       gap:"25px",
                       marginTop:"35px"
                   }}
               >

                   <CareerProgress />

                   <AICareerTips />

               </div>

               <div
                   style={{
                       marginTop:"25px"
                   }}
               >

                   <FeaturedCompanies />

               </div>

              <ChatbotButton />

            {/* Placeholder */}

            <div
                style={{
                    marginTop: "40px",
                    background: "#16213E",
                    borderRadius: "20px",
                    padding: "35px",
                    color: "white",
                }}
            >

                <h2>📈 Career Progress</h2>

                <p
                    style={{
                        color: "#94A3B8",
                        marginTop: "15px",
                    }}
                >
                    Resume growth charts, ATS progress and career analytics
                    will appear here.
                </p>

            </div>

            <div
                style={{
                    marginTop: "30px",
                    background: "#16213E",
                    borderRadius: "20px",
                    padding: "35px",
                    color: "white",
                }}
            >

                <h2>🔥 Featured Companies</h2>

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        marginTop: "20px",
                        flexWrap: "wrap",
                    }}
                >

                    <div>Google</div>
                    <div>Microsoft</div>
                    <div>Amazon</div>
                    <div>Adobe</div>
                    <div>Oracle</div>

                </div>

            </div>

            <ChatbotButton />

        </div>
    );
}