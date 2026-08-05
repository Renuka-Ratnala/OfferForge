import { useState, useEffect } from "react";
import api from "../api/api";

export default function Resume() {

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/users/profile");
            setProfile(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const uploadResume = async () => {

        if (!file) {
            alert("Please select a PDF.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {

            await api.post("/users/resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            fetchProfile();

            setMessage("✅ Resume uploaded successfully.");

            setFile(null);

        } catch (err) {

            console.log(err);
            setMessage("❌ Upload failed.");

        }

        setLoading(false);
    };

    return (

        <div
            style={{
                padding: "40px",
                color: "white",
                maxWidth: "700px",
                margin: "auto"
            }}
        >

            <h1
                style={{
                    fontSize: "36px",
                    fontWeight: "bold"
                }}
            >
                Resume Manager 📄
            </h1>

            <p
                style={{
                    color: "#94A3B8",
                    marginTop: "10px",
                    marginBottom: "30px"
                }}
            >
                Upload, replace and optimize your resume for better ATS scores.
            </p>

            <div
                style={{
                    background: "#16213E",
                    padding: "25px",
                    borderRadius: "15px",
                    marginBottom: "30px"
                }}
            >

                <h2>📄 Current Resume</h2>

                <p
                    style={{
                        marginTop: "15px",
                        fontSize: "16px"
                    }}
                >
                    {profile?.resumeUrl
                        ? profile.resumeUrl.split(/[\\/]/).pop()
                        : "No Resume Uploaded"}
                </p>

                <p
                    style={{
                        color: profile?.resumeUrl ? "#22C55E" : "#EF4444",
                        fontWeight: "bold",
                        marginTop: "10px"
                    }}
                >
                    {profile?.resumeUrl
                        ? "✅ Uploaded Successfully"
                        : "❌ Not Uploaded"}
                </p>

            </div>

            <div
                style={{
                    background: "#16213E",
                    padding: "35px",
                    borderRadius: "15px",
                    border: "2px dashed #2563EB",
                    textAlign: "center"
                }}
            >

                <h2>
                    {profile?.resumeUrl
                        ? "Replace Resume"
                        : "Upload Resume"}
                </h2>

                <br />

                {file && (
                    <>
                        <p>Selected File</p>
                        <b>{file.name}</b>
                        <br /><br />
                    </>
                )}

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <br /><br />

                <button
                    onClick={uploadResume}
                    disabled={loading}
                    style={{
                        background: "#2563EB",
                        color: "white",
                        border: "none",
                        padding: "12px 35px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    {loading
                        ? "Uploading..."
                        : profile?.resumeUrl
                            ? "Replace Resume"
                            : "Upload Resume"}
                </button>

            </div>

            {message && (
                <div
                    style={{
                        marginTop: "25px",
                        background: "#1F2937",
                        padding: "15px",
                        borderRadius: "10px",
                        textAlign: "center"
                    }}
                >
                    {message}
                </div>
            )}

        </div>

    );
}