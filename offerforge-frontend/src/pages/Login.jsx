import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowRight
} from "react-icons/fa";
import { loginUser } from "../services/authService";
import "./Auth.css";

export default function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.email || !form.password) {

            setError(
                "Please enter your email and password."
            );

            return;
        }

        setLoading(true);
        setError("");

        try {

            const response =
                await loginUser(form);

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">


            {/* =================================================
                LEFT BRAND SECTION
            ================================================= */}

            <div className="auth-brand-section">

                <div className="auth-brand">

                    <div className="auth-logo">
                        ⚡
                    </div>

                    <span>
                        OfferForge
                    </span>

                </div>


                <div className="auth-brand-content">

                    <span className="auth-eyebrow">
                        AI-POWERED CAREER INTELLIGENCE
                    </span>

                    <h1>
                        Build confidence.
                        <br />
                        <span>Build your career.</span>
                    </h1>

                    <p>
                        Practice interviews, analyze your
                        resume, and turn your preparation
                        into real career opportunities.
                    </p>


                    <div className="auth-features">

                        <div className="auth-feature">

                            <span>
                                ✦
                            </span>

                            <div>

                                <strong>
                                    AI Mock Interviews
                                </strong>

                                <p>
                                    Practice realistic
                                    interview questions.
                                </p>

                            </div>

                        </div>


                        <div className="auth-feature">

                            <span>
                                ✦
                            </span>

                            <div>

                                <strong>
                                    Resume Intelligence
                                </strong>

                                <p>
                                    Improve your resume
                                    with AI-powered insights.
                                </p>

                            </div>

                        </div>


                        <div className="auth-feature">

                            <span>
                                ✦
                            </span>

                            <div>

                                <strong>
                                    Personalized Feedback
                                </strong>

                                <p>
                                    Understand your strengths
                                    and areas to improve.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="auth-brand-footer">
                    Your career deserves better preparation.
                </div>

            </div>


            {/* =================================================
                RIGHT LOGIN SECTION
            ================================================= */}

            <div className="auth-form-section">

                <div className="auth-card">


                    {/* HEADER */}

                    <div className="auth-card-header">

                        <span className="mobile-auth-logo">
                            ⚡ OfferForge
                        </span>

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to continue your
                            career journey.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="auth-error">

                            <span>
                                ⚠
                            </span>

                            {error}

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >


                        {/* EMAIL */}

                        <div className="auth-field">

                            <label>
                                Email address
                            </label>

                            <div className="auth-input-wrapper">

                                <FaEnvelope />

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    placeholder="you@example.com"
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="auth-field">

                            <div className="auth-label-row">

                                <label>
                                    Password
                                </label>

                            </div>


                            <div className="auth-input-wrapper">

                                <FaLock />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        form.password
                                    }
                                    placeholder="Enter your password"
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="current-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="auth-spinner" />

                                    Signing in...

                                </>

                            ) : (

                                <>

                                    Sign in

                                    <FaArrowRight />

                                </>

                            )}

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="auth-divider">

                        <span />

                        <p>
                            New to OfferForge?
                        </p>

                        <span />

                    </div>


                    <Link
                        to="/register"
                        className="auth-secondary-button"
                    >
                        Create an account
                    </Link>


                </div>

            </div>

        </div>

    );

}