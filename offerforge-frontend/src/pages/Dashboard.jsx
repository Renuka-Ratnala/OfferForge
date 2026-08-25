import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import DashboardStats from "../components/DashboardStats";
import QuickActionCard from "../components/QuickActionCard";

import "./Dashboard.css";

export default function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/dashboard");

            console.log("Dashboard data:", response.data);

            setDashboard(response.data);

        } catch (err) {

            console.error("Dashboard error:", err);

            setError("Unable to load dashboard data.");

        } finally {

            setLoading(false);

        }
    };

    const profile = dashboard?.profile;

    const fullName =
        profile?.fullName?.trim() || "Candidate";

    const initials = fullName
        .split(/\s+/)
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const handleSearch = (e) => {

        const value = e.target.value;

        setSearch(value);

        const query = value.trim().toLowerCase();

        if (!query) {
            return;
        }

        const routes = [
            {
                keywords: ["resume", "cv", "ats"],
                path: "/resume"
            },
            {
                keywords: ["job", "jobs", "career", "opportunity"],
                path: "/jobs"
            },
            {
                keywords: ["profile", "account", "personal"],
                path: "/profile"
            },
            {
                keywords: ["ai", "coach", "career coach"],
                path: "/ai"
            },
            {
                keywords: ["interview", "mock", "practice"],
                path: "/mock-interview"
            }
        ];

        const matchedRoute = routes.find((route) =>
            route.keywords.some((keyword) =>
                keyword.includes(query) ||
                query.includes(keyword)
            )
        );

        if (matchedRoute) {
            navigate(matchedRoute.path);
            setSearch("");
        }
    };

    if (loading) {

        return (
            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <div className="loading-spinner">
                        ⟳
                    </div>

                    <h2>
                        Loading your dashboard...
                    </h2>

                    <p>
                        Fetching your latest career data.
                    </p>

                </div>

            </div>
        );

    }

    if (error) {

        return (
            <div className="dashboard-page">

                <div className="dashboard-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button onClick={fetchDashboard}>
                        Try Again
                    </button>

                </div>

            </div>
        );

    }

    const stats = {

        resumeUploaded:
            dashboard?.resumeUploaded ?? false,

        atsScore:
            dashboard?.atsScore ?? 0,

        jobMatches:
            dashboard?.jobMatches ?? 0,

        profileCompletion:
            dashboard?.profileCompletion ?? 0

    };

    const activities =
        dashboard?.recentActivities || [];

    const aiTips =
        dashboard?.aiTips || [];

    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <div className="dashboard-welcome">

                    <span className="dashboard-eyebrow">
                        OFFERFORGE DASHBOARD
                    </span>

                    <h1>
                        Welcome back,{" "}
                        <span>{fullName}</span>
                    </h1>

                    <p>
                        Here's your career progress at a glance.
                    </p>

                </div>

                <div className="dashboard-header-actions">

                    <div className="search-box">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search dashboard..."
                            value={search}
                            onChange={handleSearch}
                        />

                    </div>

                    <div className="notification">

                        🔔

                        <span />

                    </div>

                    <button
                        className="profile-avatar"
                        onClick={() => navigate("/profile")}
                        title="Open profile"
                    >
                        {initials}
                    </button>

                </div>

            </div>

            <DashboardStats stats={stats} />

            <div className="dashboard-main-grid">

                <div className="dashboard-card career-progress-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                📈 Career Progress
                            </h2>

                            <p className="card-subtitle">
                                Your current OfferForge profile health
                            </p>

                        </div>

                        <span className="progress-badge">
                            {stats.profileCompletion}%
                        </span>

                    </div>

                    <div className="career-progress-content">

                        <div className="progress-score-row">

                            <div>

                                <div className="progress-big-number">
                                    {stats.profileCompletion}%
                                </div>

                                <p>
                                    Profile completion
                                </p>

                            </div>

                            <div className="progress-ring">
                                <div
                                    className="progress-ring-value"
                                    style={{
                                        "--progress":
                                            `${stats.profileCompletion * 3.6}deg`
                                    }}
                                >
                                    {stats.profileCompletion}%
                                </div>
                            </div>

                        </div>

                        <div className="dashboard-progress-bar">

                            <div
                                className="dashboard-progress-fill"
                                style={{
                                    width:
                                        `${stats.profileCompletion}%`
                                }}
                            />

                        </div>

                        <div className="career-progress-details">

                            <div>
                                <span>Resume</span>
                                <strong>
                                    {stats.resumeUploaded
                                        ? "Uploaded"
                                        : "Pending"}
                                </strong>
                            </div>

                            <div>
                                <span>ATS Score</span>
                                <strong>
                                    {stats.atsScore}%
                                </strong>
                            </div>

                            <div>
                                <span>Job Matches</span>
                                <strong>
                                    {stats.jobMatches}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                ⚡ Quick Actions
                            </h2>

                            <p className="card-subtitle">
                                Jump straight into your preparation
                            </p>

                        </div>

                    </div>

                    <div className="quick-actions">

                        <QuickActionCard
                            title="Upload Resume"
                            description="Improve your ATS score"
                            icon="📄"
                            path="/resume"
                        />

                        <QuickActionCard
                            title="Find Jobs"
                            description="Explore matching opportunities"
                            icon="💼"
                            path="/jobs"
                        />

                        <QuickActionCard
                            title="Mock Interview"
                            description="Practice with AI"
                            icon="🎤"
                            path="/mock-interview"
                        />

                        <QuickActionCard
                            title="AI Career Coach"
                            description="Get personalized guidance"
                            icon="🤖"
                            path="/ai"
                        />

                    </div>

                </div>

            </div>

            <div className="bottom-grid">

                <div className="dashboard-card ai-tip-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                🤖 AI Career Coach
                            </h2>

                            <p className="card-subtitle">
                                Personalized suggestions based on your profile
                            </p>

                        </div>

                        <span className="ai-status">
                            AI ACTIVE
                        </span>

                    </div>

                    {aiTips.length > 0 ? (

                        <>

                            <div className="quote">
                                "
                            </div>

                            <p className="tip">
                                {aiTips[0]}
                            </p>

                            {aiTips
                                .slice(1)
                                .map((tip, index) => (

                                    <div
                                        className="example positive"
                                        key={index}
                                    >
                                        💡 {tip}
                                    </div>

                                ))}

                        </>

                    ) : (

                        <p className="tip">
                            Complete your profile and upload your
                            resume to receive personalized career guidance.
                        </p>

                    )}

                    <button
                        className="tips-button"
                        onClick={() => navigate("/ai")}
                    >
                        Open AI Career Coach →
                    </button>

                </div>

                <div className="dashboard-card activity-card">

                    <div className="card-header">

                        <div>

                            <h2>
                                🕒 Recent Activity
                            </h2>

                            <p className="card-subtitle">
                                What's happening in your career journey
                            </p>

                        </div>

                    </div>

                    {activities.length > 0 ? (

                        activities.map((activity, index) => (

                            <div
                                className="activity-item"
                                key={index}
                            >

                                <div className="activity-icon">
                                    ✓
                                </div>

                                <div>

                                    <h3>
                                        {activity}
                                    </h3>

                                    <p>
                                        Updated from your OfferForge data
                                    </p>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="activity-item">

                            <div className="activity-icon">
                                ℹ
                            </div>

                            <div>

                                <h3>
                                    No recent activity
                                </h3>

                                <p>
                                    Start using OfferForge to see activity here.
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}