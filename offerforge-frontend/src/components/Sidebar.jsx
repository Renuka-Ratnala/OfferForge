import {
    FaHome,
    FaFileAlt,
    FaBriefcase,
    FaRobot,
    FaUser,
    FaMicrophone
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

export default function Sidebar() {

    return (

        <aside className="sidebar">

            {/* Logo */}

            <div className="sidebar-logo">

                <div className="logo-icon">
                    ✦
                </div>

                <div className="logo-text">
                    Offer<span>Forge</span>
                </div>

            </div>


            {/* Navigation */}

            <nav className="sidebar-nav">

                <NavLink
                    to="/dashboard"
                    className="sidebar-link"
                >
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/resume"
                    className="sidebar-link"
                >
                    <FaFileAlt />
                    <span>Resume</span>
                </NavLink>


                <NavLink
                    to="/jobs"
                    className="sidebar-link"
                >
                    <FaBriefcase />
                    <span>Jobs</span>
                </NavLink>


                <NavLink
                    to="/ai"
                    className="sidebar-link"
                >
                    <FaRobot />
                    <span>AI Coach</span>
                </NavLink>
                <NavLink
                    to="/mock-interview"
                    style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        color: isActive ? "white" : "#CBD5E1",
                        background: isActive
                            ? "linear-gradient(90deg, #7C3AED, #8B5CF6)"
                            : "transparent",
                        marginBottom: "8px"
                    })}
                >
                    <FaMicrophone />
                    Mock Interview
                </NavLink>

                <NavLink
                    to="/profile"
                    className="sidebar-link"
                >
                    <FaUser />
                    <span>Profile</span>
                </NavLink>

            </nav>




        </aside>

    );
}