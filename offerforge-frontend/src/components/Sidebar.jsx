import {
    FaHome,
    FaFileAlt,
    FaBriefcase,
    FaRobot,
    FaUser
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const linkStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        borderRadius: "10px",
        color: isActive ? "#3B82F6" : "white",
        background: isActive ? "#1E293B" : "transparent",
        textDecoration: "none",
        marginBottom: "10px",
        transition: "0.3s"
    });

    return (

        <div
            style={{
                width: "240px",
                background: "#111827",
                color: "white",
                padding: "30px"
            }}
        >

            <h1
                style={{
                    fontSize: "30px",
                    marginBottom: "40px"
                }}
            >
                OfferForge
            </h1>

            <NavLink to="/dashboard" style={linkStyle}>
                <FaHome />
                Dashboard
            </NavLink>

            <NavLink to="/resume" style={linkStyle}>
                <FaFileAlt />
                Resume
            </NavLink>

            <NavLink to="/jobs" style={linkStyle}>
                <FaBriefcase />
                Jobs
            </NavLink>

            <NavLink to="/ai" style={linkStyle}>
                <FaRobot />
                AI Coach
            </NavLink>

            <NavLink to="/profile" style={linkStyle}>
                <FaUser />
                Profile
            </NavLink>

        </div>

    );

}