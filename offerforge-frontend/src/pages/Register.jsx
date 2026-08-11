import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Register.css";
export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        college: "",
        branch: "",
        graduationYear: "",
        skills: "",
        linkedinUrl: "",
        githubUrl: "",
        resumeUrl: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const dataToSend = {
                ...formData,
                graduationYear: Number(formData.graduationYear)
            };

            const response = await registerUser(dataToSend);

            setMessage(response.data);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            console.error(err);

            if (err.response?.data) {
                setError(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : "Registration failed."
                );
            } else {
                setError("Unable to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                {/* Header */}
                <div className="register-header">
                    <div className="brand">
                        <div className="brand-icon">✦</div>
                        <span>OfferForge</span>
                    </div>

                    <h1>Create your account</h1>

                    <p>
                        Start building your career with OfferForge
                    </p>
                </div>

                {/* Messages */}
                {message && (
                    <div className="success-message">
                        ✓ {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ⚠ {error}
                    </div>
                )}

                {/* Form */}
                <form className="register-form" onSubmit={handleSubmit}>

                    {/* Personal Information */}
                    <div className="section-title">
                        <span>01</span>
                        Personal Information
                    </div>

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {/* Academic Information */}
                    <div className="section-title">
                        <span>02</span>
                        Academic Information
                    </div>

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label>College</label>
                            <input
                                type="text"
                                name="college"
                                placeholder="Enter your college name"
                                value={formData.college}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Branch</label>
                            <input
                                type="text"
                                name="branch"
                                placeholder="e.g. IT, CSE, AIML"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Graduation Year</label>
                            <input
                                type="number"
                                name="graduationYear"
                                placeholder="e.g. 2028"
                                value={formData.graduationYear}
                                onChange={handleChange}
                                min="2024"
                                max="2040"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="City, State"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {/* Career Information */}
                    <div className="section-title">
                        <span>03</span>
                        Career Profile
                    </div>

                    <div className="form-grid">

                        <div className="form-group full-width">
                            <label>Skills</label>
                            <input
                                type="text"
                                name="skills"
                                placeholder="Java, Python, SQL, React..."
                                value={formData.skills}
                                onChange={handleChange}
                                required
                            />
                            <small>
                                Separate multiple skills with commas
                            </small>
                        </div>

                        <div className="form-group full-width">
                            <label>LinkedIn URL <span>Optional</span></label>
                            <input
                                type="url"
                                name="linkedinUrl"
                                placeholder="https://linkedin.com/in/your-profile"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>GitHub URL <span>Optional</span></label>
                            <input
                                type="url"
                                name="githubUrl"
                                placeholder="https://github.com/your-username"
                                value={formData.githubUrl}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Resume URL <span>Optional</span></label>
                            <input
                                type="url"
                                name="resumeUrl"
                                placeholder="https://your-resume-link.com"
                                value={formData.resumeUrl}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <span>→</span>
                            </>
                        )}
                    </button>

                </form>

                {/* Login */}
                <div className="login-link">
                    Already have an account?
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>

            </div>

        </div>
    );
}