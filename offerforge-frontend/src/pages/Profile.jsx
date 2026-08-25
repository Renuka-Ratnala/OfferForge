import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Profile.css";

export default function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        location: "",
        college: "",
        branch: "",
        graduationYear: "",
        skills: "",
        linkedinUrl: "",
        githubUrl: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/users/profile");

            setProfile(response.data);

            setForm({
                fullName: response.data.fullName || "",
                phone: response.data.phone || "",
                location: response.data.location || "",
                college: response.data.college || "",
                branch: response.data.branch || "",
                graduationYear:
                    response.data.graduationYear || "",
                skills: response.data.skills || "",
                linkedinUrl:
                    response.data.linkedinUrl || "",
                githubUrl:
                    response.data.githubUrl || ""
            });

        } catch (err) {

            console.error("Profile fetch error:", err);

            setError("Unable to load your profile.");

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    const handleSave = async (e) => {

        e.preventDefault();

        if (!form.fullName.trim()) {
            setError("Full name is required.");
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                ...form,
                graduationYear:
                    form.graduationYear
                        ? Number(form.graduationYear)
                        : null
            };

            const response =
                await api.put(
                    "/users/profile",
                    payload
                );

            setProfile(response.data);

            setForm({
                fullName: response.data.fullName || "",
                phone: response.data.phone || "",
                location: response.data.location || "",
                college: response.data.college || "",
                branch: response.data.branch || "",
                graduationYear:
                    response.data.graduationYear || "",
                skills: response.data.skills || "",
                linkedinUrl:
                    response.data.linkedinUrl || "",
                githubUrl:
                    response.data.githubUrl || ""
            });

            setEditing(false);
            setSuccess("Profile updated successfully.");

        } catch (err) {

            console.error(
                "Profile update error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update your profile."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleCancel = () => {

        if (!profile) return;

        setForm({
            fullName: profile.fullName || "",
            phone: profile.phone || "",
            location: profile.location || "",
            college: profile.college || "",
            branch: profile.branch || "",
            graduationYear:
                profile.graduationYear || "",
            skills: profile.skills || "",
            linkedinUrl:
                profile.linkedinUrl || "",
            githubUrl:
                profile.githubUrl || ""
        });

        setEditing(false);
        setError("");
        setSuccess("");

    };

    const initials = useMemo(() => {

        const name =
            profile?.fullName?.trim() || "Candidate";

        return name
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    }, [profile]);

    const profileCompletion = useMemo(() => {

        if (!profile) return 0;

        const fields = [
            profile.fullName,
            profile.email,
            profile.phone,
            profile.location,
            profile.college,
            profile.branch,
            profile.graduationYear,
            profile.skills,
            profile.linkedinUrl,
            profile.githubUrl,
            profile.resumeUrl
        ];

        const completed = fields.filter((field) => {

            if (
                field === null ||
                field === undefined
            ) {
                return false;
            }

            return String(field).trim() !== "";

        }).length;

        return Math.round(
            (completed / fields.length) * 100
        );

    }, [profile]);

    if (loading) {

        return (
            <div className="profile-page">

                <div className="profile-state">

                    <div className="profile-spinner">
                        ⟳
                    </div>

                    <h2>
                        Loading your profile...
                    </h2>

                    <p>
                        Fetching your OfferForge profile.
                    </p>

                </div>

            </div>
        );

    }

    if (!profile) {

        return (
            <div className="profile-page">

                <div className="profile-state">

                    <div className="profile-state-icon">
                        ⚠️
                    </div>

                    <h2>
                        Profile unavailable
                    </h2>

                    <p>
                        {error || "Unable to load your profile."}
                    </p>

                    <button
                        className="profile-primary-btn"
                        onClick={fetchProfile}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );

    }

    return (

        <div className="profile-page">

            <div className="profile-header">

                <div>

                    <span className="profile-eyebrow">
                        OFFERFORGE PROFILE
                    </span>

                    <h1>
                        Your Career Profile
                    </h1>

                    <p>
                        Keep your information updated to improve
                        job matching and career recommendations.
                    </p>

                </div>

                {!editing && (

                    <button
                        className="profile-primary-btn"
                        onClick={() => {
                            setEditing(true);
                            setSuccess("");
                            setError("");
                        }}
                    >
                        ✏️ Edit Profile
                    </button>

                )}

            </div>

            {success && (

                <div className="profile-message success-message">
                    ✓ {success}
                </div>

            )}

            {error && (

                <div className="profile-message error-message">
                    ⚠️ {error}
                </div>

            )}

            <div className="profile-layout">

                <div className="profile-main">

                    <div className="profile-card profile-hero">

                        <div className="profile-avatar-large">
                            {initials}
                        </div>

                        <div className="profile-identity">

                            <h2>
                                {profile.fullName || "Candidate"}
                            </h2>

                            <p>
                                {profile.email}
                            </p>

                            {profile.location && (

                                <span>
                                    📍 {profile.location}
                                </span>

                            )}

                        </div>

                        <div className="profile-completion-mini">

                            <span>
                                Profile
                            </span>

                            <strong>
                                {profileCompletion}%
                            </strong>

                            <div className="mini-progress">

                                <div
                                    style={{
                                        width:
                                            `${profileCompletion}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    <form
                        className="profile-card profile-form-card"
                        onSubmit={handleSave}
                    >

                        <div className="profile-section-heading">

                            <div>

                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Your basic contact and academic details.
                                </p>

                            </div>

                        </div>

                        <div className="profile-form-grid">

                            <div className="profile-field">

                                <label>
                                    Full Name
                                </label>

                                {editing ? (

                                    <input
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                    />

                                ) : (

                                    <div className="profile-value">
                                        {profile.fullName || "Not added"}
                                    </div>

                                )}

                            </div>

                            <div className="profile-field">

                                <label>
                                    Email
                                </label>

                                <div className="profile-value readonly">
                                    {profile.email || "Not available"}
                                </div>

                            </div>

                            <div className="profile-field">

                                <label>
                                    Phone
                                </label>

                                {editing ? (

                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />

                                ) : (

                                    <div className="profile-value">
                                        {profile.phone || "Not added"}
                                    </div>

                                )}

                            </div>

                            <div className="profile-field">

                                <label>
                                    Location
                                </label>

                                {editing ? (

                                    <input
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="City, State"
                                    />

                                ) : (

                                    <div className="profile-value">
                                        {profile.location || "Not added"}
                                    </div>

                                )}

                            </div>

                            <div className="profile-field">

                                <label>
                                    College
                                </label>

                                {editing ? (

                                    <input
                                        name="college"
                                        value={form.college}
                                        onChange={handleChange}
                                        placeholder="College name"
                                    />

                                ) : (

                                    <div className="profile-value">
                                        {profile.college || "Not added"}
                                    </div>

                                )}

                            </div>

                            <div className="profile-field">

                                <label>
                                    Branch
                                </label>

                                {editing ? (

                                    <input
                                        name="branch"
                                        value={form.branch}
                                        onChange={handleChange}
                                        placeholder="Branch / specialization"
                                    />

                                ) : (

                                    <div className="profile-value">
                                        {profile.branch || "Not added"}
                                    </div>

                                )}

                            </div>

                            <div className="profile-field">

                                <label>
                                    Graduation Year
                                </label>

                                {editing ? (

                                    <input
                                        type="number"
                                        name="graduationYear"
                                        value={form.graduationYear}
                                        onChange={handleChange}
                                        placeholder="2028"
                                    />

                                ) : (

                                    <div className="profile-value">
                                        {profile.graduationYear || "Not added"}
                                    </div>

                                )}

                            </div>

                        </div>

                        <div className="profile-section-heading skills-heading">

                            <div>

                                <h2>
                                    Technical Skills
                                </h2>

                                <p>
                                    Add technologies that represent your current skill set.
                                </p>

                            </div>

                        </div>

                        {editing ? (

                            <textarea
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Java, Spring Boot, React, PostgreSQL..."
                            />

                        ) : (

                            <div className="skills-display">

                                {profile.skills ? (

                                    profile.skills
                                        .split(",")
                                        .map((skill) => skill.trim())
                                        .filter(Boolean)
                                        .map((skill) => (

                                            <span key={skill}>
                                                {skill}
                                            </span>

                                        ))

                                ) : (

                                    <span className="empty-skill">
                                        No skills added yet
                                    </span>

                                )}

                            </div>

                        )}

                        <div className="profile-section-heading links-heading">

                            <div>

                                <h2>
                                    Professional Links
                                </h2>

                                <p>
                                    Help recruiters discover your professional presence.
                                </p>

                            </div>

                        </div>

                        <div className="profile-form-grid">

                            <div className="profile-field">

                                <label>
                                    LinkedIn
                                </label>

                                {editing ? (

                                    <input
                                        name="linkedinUrl"
                                        value={form.linkedinUrl}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/..."
                                    />

                                ) : profile.linkedinUrl ? (

                                    <a
                                        className="profile-link"
                                        href={profile.linkedinUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        🔗 Open LinkedIn
                                    </a>

                                ) : (

                                    <div className="profile-value">
                                        Not added
                                    </div>

                                )}

                            </div>

                            <div className="profile-field">

                                <label>
                                    GitHub
                                </label>

                                {editing ? (

                                    <input
                                        name="githubUrl"
                                        value={form.githubUrl}
                                        onChange={handleChange}
                                        placeholder="https://github.com/..."
                                    />

                                ) : profile.githubUrl ? (

                                    <a
                                        className="profile-link"
                                        href={profile.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        💻 Open GitHub
                                    </a>

                                ) : (

                                    <div className="profile-value">
                                        Not added
                                    </div>

                                )}

                            </div>

                        </div>

                        {editing && (

                            <div className="profile-form-actions">

                                <button
                                    type="button"
                                    className="profile-secondary-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-primary-btn"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        )}

                    </form>

                </div>

                <div className="profile-sidebar">

                    <div className="profile-card career-card">

                        <div className="profile-section-heading">

                            <div>

                                <h2>
                                    Career Readiness
                                </h2>

                                <p>
                                    Your current preparation snapshot.
                                </p>

                            </div>

                        </div>

                        <div className="readiness-item">

                            <div className="readiness-icon purple">
                                👤
                            </div>

                            <div>

                                <span>
                                    Profile
                                </span>

                                <strong>
                                    {profileCompletion}%
                                </strong>

                            </div>

                        </div>

                        <div className="readiness-item">

                            <div className="readiness-icon blue">
                                📄
                            </div>

                            <div>

                                <span>
                                    Resume
                                </span>

                                <strong>
                                    {profile.resumeUrl
                                        ? "Uploaded"
                                        : "Pending"}
                                </strong>

                            </div>

                        </div>

                        <button
                            className="sidebar-action"
                            onClick={() => navigate("/resume")}
                        >
                            📄 Manage Resume
                        </button>

                        <button
                            className="sidebar-action"
                            onClick={() => navigate("/ai")}
                        >
                            🤖 Open AI Coach
                        </button>

                    </div>

                    <div className="profile-card profile-tip-card">

                        <div className="tip-icon">
                            ✨
                        </div>

                        <h3>
                            Make your profile stronger
                        </h3>

                        <p>
                            Add your skills, GitHub and LinkedIn
                            profiles to improve your career matching.
                        </p>

                        {!profile.githubUrl && (
                            <div className="tip-row">
                                <span>GitHub</span>
                                <strong>Missing</strong>
                            </div>
                        )}

                        {!profile.linkedinUrl && (
                            <div className="tip-row">
                                <span>LinkedIn</span>
                                <strong>Missing</strong>
                            </div>
                        )}

                        {!profile.skills && (
                            <div className="tip-row">
                                <span>Skills</span>
                                <strong>Missing</strong>
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>

    );
}