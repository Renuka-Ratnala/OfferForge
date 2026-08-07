import { useState, useEffect } from "react";
import api from "../api/api";

import ResumeOverview from "../components/ResumeOverview";
import ATSGauge from "../components/ATSGauge";
import ResumeHealth from "../components/ResumeHealth";
import AIResumeSuggestions from "../components/AIResumeSuggestions";

export default function Resume() {

    const [file, setFile] = useState(null);
    const [profile, setProfile] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchAnalysis();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            setProfile(response.data);
        } catch (err) {
            console.log(err);
        }
    };

     const fetchAnalysis = async () => {
         try {
             const response = await api.get(
                 "/users/resume/analyze"
             );

             console.log(response.data);

             setAnalysis(response.data);

         } catch (err) {
             console.log(err);
         }
     };

    const uploadResume = async () => {

        if (!file) {
            alert("Please select a resume.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {

            await api.post(
                "/users/resume",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            fetchProfile();
            fetchAnalysis();

            alert("Resume uploaded successfully!");

        } catch (err) {

            console.log(err);
            alert("Upload failed.");

        }

    };

    return (

        <div
            style={{
                padding: "40px",
                maxWidth: "1200px",
                margin: "0 auto",
                color: "white"
            }}
        >

            <h1
                style={{
                    fontSize: "36px",
                    fontWeight: "700",
                    marginBottom: "10px"
                }}
            >
                Resume Manager 📄
            </h1>

            <p
                style={{
                    color: "#94A3B8",
                    marginBottom: "35px"
                }}
            >
                Upload, replace and optimize your resume for better ATS scores.
            </p>

            {/* Top Section */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "25px",
                    marginBottom: "30px"
                }}
            >
            <ResumeHealth />

            <div style={{ marginTop: "30px" }}>

                <AIResumeSuggestions
                    suggestions={analysis?.suggestion}
                />

            </div>

                <ResumeOverview
                    profile={profile}
                    file={file}
                    setFile={setFile}
                    uploadResume={uploadResume}
                />

                <ATSGauge
                    score={analysis?.matchScore}
                />

            </div>

            {/* Skills */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "25px",
                    marginBottom: "30px"
                }}
            >



            </div>

            {/* AI Suggestions */}

            <AIResumeSuggestions
                suggestions={analysis?.suggestion}
            />

        </div>

    );

}