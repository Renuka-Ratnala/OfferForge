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


        </div>
    );
}