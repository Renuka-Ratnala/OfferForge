import { useState, useEffect } from "react";
import api from "../api/api";

import ResumeOverview from "../components/ResumeOverview";
import ATSGauge from "../components/ATSGauge";
import ResumeHealth from "../components/ResumeHealth";
 
import "./Resume.css";

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

            console.log("Resume analysis:", response.data);

            setAnalysis(response.data);

        } catch (err) {
            console.log(err);
        }
    };

    const uploadResume = async (selectedFile) => {

        if (!selectedFile) {
            alert("Please select a resume.");
            return;
        }

        const formData = new FormData();

        formData.append("file", selectedFile);

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

            setFile(selectedFile);

            await fetchProfile();
            await fetchAnalysis();

            alert("Resume uploaded successfully!");

        } catch (err) {

            console.log("Resume upload error:", err);

            alert("Upload failed.");

        }
    };

    return (

        <div className="resume-page">

            {/* ================= HEADER ================= */}

            <div className="resume-header">

                <div>

                    <h1>
                        Resume Manager <span>📄</span>
                    </h1>

                    <p>
                        Upload, analyze and optimize your resume for better ATS scores.
                    </p>

                </div>

            </div>


            {/* ================= RESUME + ATS ================= */}

            <div className="resume-top-grid">

                <div className="resume-panel">

                    <ResumeOverview
                        profile={profile}
                        file={file}
                        setFile={setFile}
                        uploadResume={uploadResume}
                    />

                </div>


                <div className="resume-panel">

                    <ATSGauge
                        score={analysis?.matchScore || 0}
                    />

                </div>

            </div>


            {/* ================= RESUME HEALTH ================= */}

            <div className="resume-section">

                <ResumeHealth />

            </div>


            {/* ================= AI RESUME COACH ================= */}

            <div className="resume-section">

                <AIResumeSuggestions
                    suggestions={analysis?.suggestion}
                />

            </div>

        </div>

    );
}