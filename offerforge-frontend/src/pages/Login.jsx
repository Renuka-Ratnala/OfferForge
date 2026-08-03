import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../services/authService";

export default function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

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
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await loginUser(form);

            localStorage.setItem("token", response.data.token);

            navigate("/dashboard");

        } catch {

            setError("Invalid Email or Password");

        }

    };

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center">

            <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl p-10">

                <h1 className="text-4xl font-bold text-center text-white">
                    OfferForge
                </h1>

                <p className="text-gray-400 text-center mt-2">
                    AI Powered Career Intelligence
                </p>

                {error && (
                    <div className="mt-5 bg-red-500 text-white rounded-lg p-3 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                    <div className="relative">

                        <FaEnvelope className="absolute left-4 top-4 text-gray-400"/>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full bg-slate-800 rounded-lg py-3 pl-12 pr-4 text-white outline-none"
                            onChange={handleChange}
                        />

                    </div>

                    <div className="relative">

                        <FaLock className="absolute left-4 top-4 text-gray-400"/>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="w-full bg-slate-800 rounded-lg py-3 pl-12 pr-12 text-white outline-none"
                            onChange={handleChange}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-gray-400"
                        >
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </button>

                    </div>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 text-white font-semibold"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center text-gray-400 mt-6">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-400 ml-2"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}