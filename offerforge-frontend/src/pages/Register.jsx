import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowRight
} from "react-icons/fa";
import { registerUser } from "../services/authService";
import "./Auth.css";

export default function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] =
        useState("");


    // =========================================================
    // HANDLE INPUT CHANGES
    // =========================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");

    };


    // =========================================================
    // REGISTER
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (
            !form.fullName ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        if (form.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        setLoading(true);
        setError("");


        // -----------------------------------------------------
        // API REQUEST
        // -----------------------------------------------------

        try {

            await registerUser({

                fullName: form.fullName,

                email: form.email,

                password: form.password

            });


            // Registration successful
            // Go to login page

            navigate("/login");


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Registration failed. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="auth-page">


            {/* =================================================
                LEFT BRAND SECTION
            ================================================= */}

            <div className="auth-brand-section">


                {/* BRAND */}

                <div className="auth-brand">

                    <div className="auth-logo">
                        ⚡
                    </div>

                    <span>
                        OfferForge
                    </span>

                </div>


                {/* BRAND CONTENT */}

                <div className="auth-brand-content">

                    <span className="auth-eyebrow">
                        BUILD YOUR CAREER
                    </span>


                    <h1>

                        Prepare smarter.

                        <br />

                        <span>
                            Interview better.
                        </span>

                    </h1>


                    <p>

                        Create your OfferForge account
                        and start preparing with
                        AI-powered career tools built
                        for real interviews.

                    </p>


                    {/* FEATURES */}

                    <div className="auth-features">


                        {/* FEATURE 1 */}

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


                        {/* FEATURE 2 */}

                        <div className="auth-feature">

                            <span>
                                ✦
                            </span>

                            <div>

                                <strong>
                                    Resume Intelligence
                                </strong>

                                <p>
                                    Optimize your resume
                                    for better opportunities.
                                </p>

                            </div>

                        </div>


                        {/* FEATURE 3 */}

                        <div className="auth-feature">

                            <span>
                                ✦
                            </span>

                            <div>

                                <strong>
                                    Track Your Progress
                                </strong>

                                <p>
                                    Turn every practice session
                                    into measurable improvement.
                                </p>

                            </div>

                        </div>


                    </div>

                </div>


                {/* FOOTER */}

                <div className="auth-brand-footer">

                    One platform. Better preparation.
                    Better opportunities.

                </div>

            </div>


            {/* =================================================
                RIGHT REGISTER SECTION
            ================================================= */}

            <div className="auth-form-section">

                <div className="auth-card">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="auth-card-header">


                        {/* MOBILE LOGO */}

                        <span className="mobile-auth-logo">

                            ⚡ OfferForge

                        </span>


                        <h2>
                            Create your account
                        </h2>


                        <p>

                            Start building your career
                            with smarter preparation.

                        </p>

                    </div>


                    {/* =================================================
                        ERROR MESSAGE
                    ================================================= */}

                    {error && (

                        <div className="auth-error">

                            <span>
                                ⚠
                            </span>

                            {error}

                        </div>

                    )}


                    {/* =================================================
                        REGISTRATION FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >


                        {/* =================================================
                            FULL NAME
                        ================================================= */}

                        <div className="auth-field">

                            <label>
                                Full name
                            </label>


                            <div className="auth-input-wrapper">

                                <FaUser />


                                <input
                                    type="text"
                                    name="fullName"
                                    value={
                                        form.fullName
                                    }
                                    placeholder="Your name"
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="name"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="auth-field">

                            <label>
                                Email address
                            </label>


                            <div className="auth-input-wrapper">

                                <FaEnvelope />


                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        form.email
                                    }
                                    placeholder="you@example.com"
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div className="auth-field">

                            <label>
                                Password
                            </label>


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
                                    placeholder="Create a password"
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="new-password"
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


                        {/* =================================================
                            CONFIRM PASSWORD
                        ================================================= */}

                        <div className="auth-field">

                            <label>
                                Confirm password
                            </label>


                            <div className="auth-input-wrapper">

                                <FaLock />


                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        form.confirmPassword
                                    }
                                    placeholder="Confirm your password"
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="new-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >

                                    {showConfirmPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            REGISTER BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="auth-spinner" />

                                    Creating account...

                                </>

                            ) : (

                                <>

                                    Create account

                                    <FaArrowRight />

                                </>

                            )}

                        </button>

                    </form>


                    {/* =================================================
                        LOGIN LINK
                    ================================================= */}

                    <div className="auth-divider">

                        <span />

                        <p>
                            Already have an account?
                        </p>

                        <span />

                    </div>


                    <Link
                        to="/login"
                        className="auth-secondary-button"
                    >
                        Sign in instead
                    </Link>


                </div>

            </div>


        </div>

    );

}