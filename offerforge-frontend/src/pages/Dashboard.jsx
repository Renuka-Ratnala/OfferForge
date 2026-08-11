import { useEffect, useState } from "react";
import { FaFileAlt, FaChartLine, FaBriefcase, FaUser, FaRobot, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import api from "../api/api";
import "./Dashboard.css";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await api.get("/dashboard");
            console.log(response.data);
            setDashboard(response.data);
        } catch (err) {
            console.log("Dashboard API error:", err);
        }
    };

    const stats = {
        resumeUploaded: dashboard?.resumeUploaded ?? true,
        atsScore: dashboard?.atsScore ?? 85,
        jobMatches: dashboard?.jobMatches ?? 24,
        profileCompletion: dashboard?.profileCompletion ?? 68
    };

    return (
        <div className="dashboard-page">

            {/* Header */}
            <div className="dashboard-header">

                <div>
                    <h1>
                        Welcome back, <span>Renuka!</span> 👋
                    </h1>

                    <p>
                        Let's build your dream career together.
                    </p>
                </div>

                <div className="dashboard-header-actions">

                    <div className="search-box">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search jobs, skills..."
                        />
                    </div>

                    <div className="notification">
                        🔔
                        <span></span>
                    </div>

                    <div className="profile-avatar">
                        R
                    </div>

                </div>

            </div>


            {/* Top Statistics */}
            <div className="stats-grid">

                <div className="stat-card green">

                    <div className="stat-icon">
                        <FaFileAlt />
                    </div>

                    <div className="stat-content">
                        <p>Resume Status</p>

                        <h2>
                            {stats.resumeUploaded ? "Good" : "Pending"}
                        </h2>

                        <span>
                            {stats.resumeUploaded
                                ? "Keep improving!"
                                : "Upload your resume"}
                        </span>
                    </div>

                    <div className="progress-wrapper">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: stats.resumeUploaded ? "72%" : "25%"
                                }}
                            ></div>
                        </div>

                        <small>
                            {stats.resumeUploaded ? "72%" : "25%"}
                        </small>
                    </div>

                </div>


                <div className="stat-card blue">

                    <div className="stat-icon">
                        <FaChartLine />
                    </div>

                    <div className="stat-content">
                        <p>ATS Score</p>

                        <h2>{stats.atsScore}%</h2>

                        <span>Great Score!</span>
                    </div>

                    <div className="progress-wrapper">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${stats.atsScore}%`
                                }}
                            ></div>
                        </div>

                        <small>{stats.atsScore}%</small>
                    </div>

                </div>


                <div className="stat-card purple">

                    <div className="stat-icon">
                        <FaBriefcase />
                    </div>

                    <div className="stat-content">
                        <p>Jobs Matched</p>

                        <h2>{stats.jobMatches}</h2>

                        <span>High match jobs</span>
                    </div>

                </div>


                <div className="stat-card yellow">

                    <div className="stat-icon">
                        <FaUser />
                    </div>

                    <div className="stat-content">
                        <p>Profile Strength</p>

                        <h2>{stats.profileCompletion}%</h2>

                        <span>Complete your profile</span>
                    </div>

                    <div className="progress-wrapper">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${stats.profileCompletion}%`
                                }}
                            ></div>
                        </div>

                        <small>{stats.profileCompletion}%</small>
                    </div>

                </div>

            </div>


            {/* Main Dashboard Grid */}
            <div className="dashboard-main-grid">

                {/* Career Progress */}
                <div className="dashboard-card career-card">

                    <div className="card-header">
                        <div>
                            <h2>
                                <FaChartLine />
                                Career Progress
                            </h2>
                        </div>

                        <select>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div className="chart">

                        <div className="chart-grid">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                        </div>

                        <svg
                            viewBox="0 0 700 260"
                            className="progress-chart"
                        >

                            <defs>
                                <linearGradient
                                    id="chartGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#8B5CF6"
                                        stopOpacity="0.35"
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="#8B5CF6"
                                        stopOpacity="0"
                                    />
                                </linearGradient>
                            </defs>

                            <path
                                d="M20 210
                                   C100 180, 140 170, 210 145
                                   C280 125, 330 145, 400 110
                                   C470 75, 520 80, 680 30
                                   L680 250
                                   L20 250 Z"
                                fill="url(#chartGradient)"
                            />

                            <path
                                d="M20 210
                                   C100 180, 140 170, 210 145
                                   C280 125, 330 145, 400 110
                                   C470 75, 520 80, 680 30"
                                fill="none"
                                stroke="#8B5CF6"
                                strokeWidth="4"
                            />

                            <circle cx="20" cy="210" r="5" fill="#fff" />
                            <circle cx="210" cy="145" r="5" fill="#fff" />
                            <circle cx="400" cy="110" r="5" fill="#fff" />
                            <circle cx="680" cy="30" r="5" fill="#fff" />

                        </svg>

                        <div className="chart-labels">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>

                    </div>

                </div>


                {/* Quick Actions */}
                <div className="dashboard-card">

                    <div className="card-header">
                        <h2>
                            <span className="purple-icon">⚡</span>
                            Quick Actions
                        </h2>
                    </div>

                    <div className="quick-actions">

                        <div className="quick-action">
                            <div className="action-icon purple-bg">
                                <FaFileAlt />
                            </div>

                            <div>
                                <h3>Upload New Resume</h3>
                                <p>Get AI-powered analysis</p>
                            </div>

                            <FaArrowRight />
                        </div>


                        <div className="quick-action">
                            <div className="action-icon blue-bg">
                                <FaBriefcase />
                            </div>

                            <div>
                                <h3>Explore Jobs</h3>
                                <p>Find jobs that match you</p>
                            </div>

                            <FaArrowRight />
                        </div>


                        <div className="quick-action">
                            <div className="action-icon green-bg">
                                <FaRobot />
                            </div>

                            <div>
                                <h3>Chat with AI Coach</h3>
                                <p>Get personalized guidance</p>
                            </div>

                            <FaArrowRight />
                        </div>


                        <div className="quick-action">
                            <div className="action-icon yellow-bg">
                                <FaUser />
                            </div>

                            <div>
                                <h3>Update Profile</h3>
                                <p>Improve your visibility</p>
                            </div>

                            <FaArrowRight />
                        </div>

                    </div>

                </div>

            </div>


            {/* Bottom Section */}
            <div className="bottom-grid">

                {/* Featured Opportunities */}
                <div className="dashboard-card featured-card">

                    <div className="card-header">

                        <h2>
                            💼 Featured Opportunities
                        </h2>

                        <button>
                            View All Jobs →
                        </button>

                    </div>

                    <div className="companies">

                        <Company
                            name="Google"
                            role="Software Engineer"
                            location="Bangalore"
                            match="95% Match"
                            logo="G"
                        />

                        <Company
                            name="Microsoft"
                            role="Backend Developer"
                            location="Hyderabad"
                            match="90% Match"
                            logo="M"
                        />

                        <Company
                            name="Amazon"
                            role="SDE Intern"
                            location="Bangalore"
                            match="88% Match"
                            logo="a"
                        />

                        <Company
                            name="Adobe"
                            role="Frontend Developer"
                            location="Noida"
                            match="85% Match"
                            logo="A"
                        />

                        <Company
                            name="Oracle"
                            role="Java Developer"
                            location="Bangalore"
                            match="82% Match"
                            logo="O"
                        />

                    </div>

                </div>


                {/* AI Coach */}
                <div className="dashboard-card ai-tip-card">

                    <h2>
                        <FaRobot />
                        AI Coach Tip
                    </h2>

                    <div className="quote">
                        “
                    </div>

                    <p className="tip">
                        Add quantifiable achievements in your resume to stand out!
                    </p>

                    <p className="example-title">
                        For example:
                    </p>

                    <div className="example positive">
                        <FaCheckCircle />
                        Increased efficiency by 30%
                    </div>

                    <div className="example negative">
                        ✕ Responsible for task management
                    </div>

                    <button className="tips-button">
                        Get More Tips →
                    </button>

                </div>

            </div>


            {/* Recent Activity */}
            <div className="dashboard-card activity-card">

                <h2>▣ Recent Activity</h2>

                <Activity
                    icon="✓"
                    text="Resume analyzed"
                    time="2 hours ago"
                />

                <Activity
                    icon="💼"
                    text="New job matches found"
                    time="5 hours ago"
                />

                <Activity
                    icon="🤖"
                    text="AI Coach session"
                    time="Yesterday"
                />

                <Activity
                    icon="👤"
                    text="Profile updated"
                    time="2 days ago"
                />

            </div>

        </div>
    );
}


function Company({ name, role, location, match, logo }) {

    return (
        <div className="company-card">

            <div className="company-logo">
                {logo}
            </div>

            <h3>{name}</h3>

            <p>{role}</p>

            <span>⌖ {location}</span>

            <div className="match">
                {match}
            </div>

        </div>
    );
}


function Activity({ icon, text, time }) {

    return (
        <div className="activity-item">

            <div className="activity-icon">
                {icon}
            </div>

            <div>
                <h3>{text}</h3>
                <p>{time}</p>
            </div>

        </div>
    );
}