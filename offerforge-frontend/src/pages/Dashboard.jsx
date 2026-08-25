import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import DashboardStats from "../components/DashboardStats";
import QuickActionCard from "../components/QuickActionCard";

import "./Dashboard.css";

export default function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        fetchDashboard();

    }, []);


    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/dashboard");

            console.log(
                "Dashboard data:",
                response.data
            );

            setDashboard(
                response.data
            );

        } catch (err) {

            console.error(
                "Dashboard error:",
                err
            );

            setError(
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

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

                    <button
                        onClick={
                            fetchDashboard
                        }
                    >
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

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Welcome back,{" "}
                        <span>
                            Candidate
                        </span>
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
                            placeholder="Search..."
                        />

                    </div>


                    <div className="notification">

                        🔔

                        <span />

                    </div>


                    <div className="profile-avatar">

                        C

                    </div>

                </div>

            </div>


            {/* =================================================
                STATS
            ================================================= */}

            <DashboardStats
                stats={stats}
            />


            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div className="dashboard-main-grid">


                {/* CAREER PROGRESS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <h2>
                            📈 Career Progress
                        </h2>

                        <select defaultValue="Current">

                            <option>
                                Current
                            </option>

                        </select>

                    </div>


                    <div className="career-progress-content">

                        <div className="progress-big-number">

                            {stats.profileCompletion}%

                        </div>

                        <p>
                            Profile completion
                        </p>


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

                            <span>
                                Resume
                                <strong>
                                    {stats.resumeUploaded
                                        ? " Uploaded"
                                        : " Pending"}
                                </strong>
                            </span>

                            <span>
                                ATS Score
                                <strong>
                                    {stats.atsScore}%
                                </strong>
                            </span>

                            <span>
                                Job Matches
                                <strong>
                                    {stats.jobMatches}
                                </strong>
                            </span>

                        </div>

                    </div>

                </div>


                {/* QUICK ACTIONS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <h2>
                            ⚡ Quick Actions
                        </h2>

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


            {/* =================================================
                AI COACH
            ================================================= */}

            <div className="bottom-grid">

                <div className="dashboard-card ai-tip-card">

                    <div className="card-header">

                        <h2>
                            🤖 AI Career Coach
                        </h2>

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
                                .map(
                                    (
                                        tip,
                                        index
                                    ) => (

                                        <div
                                            className="example positive"
                                            key={
                                                index
                                            }
                                        >

                                            💡{" "}
                                            {tip}

                                        </div>

                                    )
                                )}

                        </>

                    ) : (

                        <p className="tip">

                            Complete your profile and
                            upload your resume to receive
                            personalized career guidance.

                        </p>

                    )}


                    <button
                        className="tips-button"
                        onClick={() =>
                            navigate(
                                "/ai-coach"
                            )
                        }
                    >

                        Open AI Career Coach →

                    </button>

                </div>


                {/* =================================================
                    RECENT ACTIVITY
                ================================================= */}

                <div className="dashboard-card activity-card">

                    <div className="card-header">

                        <h2>
                            🕒 Recent Activity
                        </h2>

                    </div>


                    {activities.length > 0 ? (

                        activities.map(
                            (
                                activity,
                                index
                            ) => (

                                <div
                                    className="activity-item"
                                    key={
                                        index
                                    }
                                >

                                    <div className="activity-icon">

                                        ✓

                                    </div>


                                    <div>

                                        <h3>
                                            {activity}
                                        </h3>

                                        <p>
                                            From your latest
                                            OfferForge data
                                        </p>

                                    </div>

                                </div>

                            )
                        )

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
                                    Start using OfferForge
                                    to see your activity here.
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}