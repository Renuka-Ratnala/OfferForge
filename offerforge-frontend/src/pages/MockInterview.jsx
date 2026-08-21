import { useState } from "react";
import "./MockInterview.css";

export default function MockInterview() {

    const [started, setStarted] = useState(false);
    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [difficulty, setDifficulty] = useState("");

    const startInterview = () => {

        if (!role || !type || !difficulty) {
            alert("Please select all interview options.");
            return;
        }

        setStarted(true);
    };

    return (

        <div className="mock-interview-page">

            {!started ? (

                <div className="interview-setup">

                    <div className="interview-header">

                        <div className="interview-icon">
                            🎤
                        </div>

                        <h1>
                            AI Mock Interview
                        </h1>

                        <p>
                            Practice real interview questions and receive
                            AI-powered feedback on your answers.
                        </p>

                    </div>


                    <div className="setup-card">

                        <div className="form-group">

                            <label>
                                Target Role
                            </label>

                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="">
                                    Select a role
                                </option>

                                <option value="Software Engineer">
                                    Software Engineer
                                </option>

                                <option value="Backend Developer">
                                    Backend Developer
                                </option>

                                <option value="Frontend Developer">
                                    Frontend Developer
                                </option>

                                <option value="Full Stack Developer">
                                    Full Stack Developer
                                </option>

                                <option value="AI/ML Engineer">
                                    AI/ML Engineer
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Interview Type
                            </label>

                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">
                                    Select interview type
                                </option>

                                <option value="Technical">
                                    Technical
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="Project">
                                    Project Discussion
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Difficulty
                            </label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(e.target.value)
                                }
                            >
                                <option value="">
                                    Select difficulty
                                </option>

                                <option value="Easy">
                                    Easy
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Hard">
                                    Hard
                                </option>

                            </select>

                        </div>


                        <button
                            className="start-interview-button"
                            onClick={startInterview}
                        >
                            Start Mock Interview
                            <span>→</span>
                        </button>

                    </div>

                </div>

            ) : (

                <div className="interview-screen">

                    <div className="interview-topbar">

                        <div>

                            <span className="interview-label">
                                AI MOCK INTERVIEW
                            </span>

                            <h1>
                                {role}
                            </h1>

                        </div>

                        <div className="question-progress">
                            Question 1 / 5
                        </div>

                    </div>


                    <div className="question-card">

                        <span className="question-label">
                            TECHNICAL QUESTION
                        </span>

                        <h2>
                            Tell me about a challenging technical
                            problem you solved in one of your projects.
                        </h2>

                        <p>
                            Explain the problem, your approach,
                            the technologies you used, and the result.
                        </p>

                    </div>


                    <div className="answer-card">

                        <div className="recording-status">

                            <div className="microphone-circle">
                                🎤
                            </div>

                            <div>

                                <h3>
                                    Ready to answer?
                                </h3>

                                <p>
                                    Speak your answer clearly.
                                    Your communication will be analyzed.
                                </p>

                            </div>

                        </div>


                        <button className="record-button">
                            🎙 Start Recording
                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}