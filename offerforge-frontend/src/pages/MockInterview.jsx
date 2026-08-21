import { useEffect, useRef, useState } from "react";
import "./MockInterview.css";

export default function MockInterview() {

    const [started, setStarted] = useState(false);

    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [difficulty, setDifficulty] = useState("");

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState(null);
    const [error, setError] = useState("");

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    // ==========================================
    // CLEANUP
    // ==========================================

    useEffect(() => {

        return () => {

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                });
            }

        };

    }, []);


    // ==========================================
    // START INTERVIEW
    // ==========================================

    const startInterview = () => {

        if (!role || !type || !difficulty) {

            alert("Please select all interview options.");

            return;
        }

        setStarted(true);
    };


    // ==========================================
    // START RECORDING
    // ==========================================

    const startRecording = async () => {

        setError("");

        try {

            // Check browser support

            if (!navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia) {

                setError(
                    "Microphone recording is not supported in this browser."
                );

                return;
            }


            if (!window.MediaRecorder) {

                setError(
                    "MediaRecorder is not supported in this browser."
                );

                return;
            }


            // Ask for microphone permission

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });console.log("Microphone stream:", stream);

                   stream.getAudioTracks().forEach((track) => {
                       console.log("Microphone track:", {
                           label: track.label,
                           enabled: track.enabled,
                           muted: track.muted,
                           readyState: track.readyState
                       });
                   });



            streamRef.current = stream;


            // Reset previous audio

            audioChunksRef.current = [];


            // Create recorder

             let mimeType = "audio/webm";

             if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
                 mimeType = "audio/webm;codecs=opus";
             }

             const mediaRecorder = new MediaRecorder(stream, {
                 mimeType
             });

             mediaRecorderRef.current = mediaRecorder;

            mediaRecorderRef.current = mediaRecorder;


            // When audio data is available

            mediaRecorder.ondataavailable = (event) => {

                if (event.data.size > 0) {

                    audioChunksRef.current.push(
                        event.data
                    );

                }

            };


            // When recording stops

            mediaRecorder.onstop = () => {

                 const audioBlob = new Blob(
                     audioChunksRef.current,
                     {
                         type: mediaRecorderRef.current?.mimeType || "audio/webm"
                     }
                 );


                const url =
                    URL.createObjectURL(audioBlob);


                setAudioUrl(url);


                // Stop microphone

                if (streamRef.current) {

                    streamRef.current
                        .getTracks()
                        .forEach(track => track.stop());

                }

            };


            // Start recording

            mediaRecorder.start();

            setIsRecording(true);

            setRecordingTime(0);


            // Start timer

            timerRef.current =
                setInterval(() => {

                    setRecordingTime(
                        previous => previous + 1
                    );

                }, 1000);

        }

        catch (err) {

            console.error(
                "Microphone error:",
                err
            );


            if (err.name === "NotAllowedError") {

                setError(
                    "Microphone permission was denied. Please allow microphone access and try again."
                );

            }
            else if (err.name === "NotFoundError") {

                setError(
                    "No microphone was found on this device."
                );

            }
            else {

                setError(
                    "Unable to access your microphone."
                );

            }

        }

    };


    // ==========================================
    // STOP RECORDING
    // ==========================================

    const stopRecording = () => {

        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {

            mediaRecorderRef.current.stop();

        }


        setIsRecording(false);


        if (timerRef.current) {

            clearInterval(timerRef.current);

            timerRef.current = null;

        }

    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (seconds) => {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${minutes}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;

    };


    // ==========================================
    // SETUP SCREEN
    // ==========================================

    if (!started) {

        return (

            <div className="mock-interview-page">

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
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
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
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
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

                            <span>
                                →
                            </span>

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // INTERVIEW SCREEN
    // ==========================================

    return (

        <div className="mock-interview-page">

            <div className="interview-screen">

                {/* TOP BAR */}

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


                {/* QUESTION */}

                <div className="question-card">

                    <span className="question-label">
                        {type.toUpperCase()} QUESTION
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


                {/* ANSWER */}

                <div className="answer-card">

                    <div className="recording-status">

                        <div
                            className={`microphone-circle ${
                                isRecording
                                    ? "recording"
                                    : ""
                            }`}
                        >

                            {isRecording
                                ? "🔴"
                                : "🎤"}

                        </div>


                        <div>

                            <h3>

                                {isRecording
                                    ? "Recording..."
                                    : "Ready to answer?"}

                            </h3>


                            <p>

                                {isRecording
                                    ? "Speak clearly. Your answer is being recorded."
                                    : "Speak your answer clearly. Your communication will be analyzed."}

                            </p>

                        </div>

                    </div>


                    {/* TIMER */}

                    {isRecording && (

                        <div
                            style={{
                                textAlign: "center",
                                color: "#A78BFA",
                                fontSize: "24px",
                                fontWeight: "600",
                                margin: "20px 0"
                            }}
                        >

                            {formatTime(recordingTime)}

                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                background: "rgba(239,68,68,0.12)",
                                border: "1px solid rgba(239,68,68,0.4)",
                                color: "#F87171",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                marginTop: "15px",
                                marginBottom: "15px"
                            }}
                        >

                            ⚠️ {error}

                        </div>

                    )}


                    {/* RECORD BUTTON */}

                    {!isRecording ? (

                        <button
                            className="record-button"
                            onClick={startRecording}
                        >

                            🎙 Start Recording

                        </button>

                    ) : (

                        <button
                            className="record-button"
                            onClick={stopRecording}
                            style={{
                                background: "#DC2626"
                            }}
                        >

                            ⏹ Stop Recording

                        </button>

                    )}


                    {/* AUDIO PREVIEW */}

                    {audioUrl && !isRecording && (

                        <div
                            style={{
                                marginTop: "25px"
                            }}
                        >

                            <p
                                style={{
                                    color: "#94A3B8",
                                    marginBottom: "10px"
                                }}
                            >
                                Your recorded answer:
                            </p>


                            <audio
                                controls
                                src={audioUrl}
                                style={{
                                    width: "100%"
                                }}
                            />

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}