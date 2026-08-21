import { useEffect, useRef, useState } from "react";
import "./MockInterview.css";

const API_URL =
    "https://offerforge-backend-rxyb.onrender.com";

export default function MockInterview() {

    // ==============================
    // INTERVIEW SETUP
    // ==============================

    const [started, setStarted] = useState(false);

    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [difficulty, setDifficulty] = useState("");

    const [question, setQuestion] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(false);


    // ==============================
    // RECORDING
    // ==============================

    const [isRecording, setIsRecording] =
        useState(false);

    const [audioURL, setAudioURL] =
        useState("");

    const [transcript, setTranscript] =
        useState("");

    const [interimTranscript, setInterimTranscript] =
        useState("");

    const mediaRecorderRef =
        useRef(null);

    const audioChunksRef =
        useRef([]);

    const recognitionRef =
        useRef(null);


    // ==============================
    // GENERATE INTERVIEW QUESTION
    // ==============================

    const startInterview = async () => {

        if (!role || !type || !difficulty) {

            alert(
                "Please select all interview options."
            );

            return;
        }

        setLoading(true);

        try {

            console.log(
                "Generating interview question..."
            );

            const response = await fetch(
                `${API_URL}/api/ai/interview/question`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        role: role,
                        type: type,
                        difficulty: difficulty
                    })
                }
            );

            console.log(
                "Question API status:",
                response.status
            );

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Server error:",
                    errorText
                );

                throw new Error(
                    `Server error: ${response.status}`
                );
            }

            const data =
                await response.json();

            console.log(
                "Generated question:",
                data
            );

            setQuestion(
                data.question
            );

            setCategory(
                data.category || type
            );

            setStarted(true);

        } catch (error) {

            console.error(
                "Interview question error:",
                error
            );

            alert(
                "Unable to generate interview question.\n" +
                error.message
            );

        } finally {

            setLoading(false);

        }
    };


    // ==============================
    // START RECORDING
    // ==============================

    const startRecording = async () => {

        try {

            console.log(
                "Requesting microphone..."
            );

            // Clear previous answer

            setTranscript("");
            setInterimTranscript("");
            setAudioURL("");

            // ==============================
            // MICROPHONE
            // ==============================

            const stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        audio: true
                    }
                );

            console.log(
                "Microphone access granted"
            );


            // ==============================
            // AUDIO RECORDER
            // ==============================

            const mediaRecorder =
                new MediaRecorder(stream);

            mediaRecorderRef.current =
                mediaRecorder;

            audioChunksRef.current = [];


            mediaRecorder.ondataavailable =
                (event) => {

                    if (
                        event.data &&
                        event.data.size > 0
                    ) {

                        audioChunksRef.current.push(
                            event.data
                        );

                    }
                };


            mediaRecorder.onstop = () => {

                console.log(
                    "Creating recorded audio..."
                );

                const audioBlob =
                    new Blob(
                        audioChunksRef.current,
                        {
                            type: "audio/webm"
                        }
                    );

                const url =
                    URL.createObjectURL(
                        audioBlob
                    );

                setAudioURL(url);


                // Stop microphone

                stream
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );

            };


            // ==============================
            // SPEECH RECOGNITION
            // ==============================

            const SpeechRecognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;


            if (!SpeechRecognition) {

                alert(
                    "Speech recognition is not supported. Please use Google Chrome."
                );

                stream
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );

                return;
            }


            const recognition =
                new SpeechRecognition();

            recognitionRef.current =
                recognition;

            recognition.continuous =
                true;

            recognition.interimResults =
                true;

            recognition.lang =
                "en-US";


            recognition.onstart = () => {

                console.log(
                    "Speech recognition started"
                );

            };


            recognition.onresult =
                (event) => {

                    let finalText = "";
                    let interimText = "";

                    for (
                        let i = event.resultIndex;
                        i < event.results.length;
                        i++
                    ) {

                        const text =
                            event.results[i][0]
                                .transcript;

                        if (
                            event.results[i]
                                .isFinal
                        ) {

                            finalText +=
                                text + " ";

                        } else {

                            interimText +=
                                text;

                        }
                    }


                    if (finalText) {

                        setTranscript(
                            (previous) =>
                                previous +
                                finalText
                        );

                    }


                    setInterimTranscript(
                        interimText
                    );
                };


            recognition.onerror =
                (event) => {

                    console.error(
                        "Speech recognition error:",
                        event.error
                    );

                };


            recognition.onend = () => {

                console.log(
                    "Speech recognition ended"
                );

            };


            // Start both

            mediaRecorder.start();

            recognition.start();

            setIsRecording(true);

            console.log(
                "Recording started"
            );

        } catch (error) {

            console.error(
                "Microphone error:",
                error
            );

            alert(
                "Unable to access microphone. Please allow microphone permission in Chrome."
            );

        }
    };


    // ==============================
    // STOP RECORDING
    // ==============================

    const stopRecording = () => {

        console.log(
            "Stopping recording..."
        );


        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !==
                "inactive"
        ) {

            mediaRecorderRef.current.stop();

        }


        if (recognitionRef.current) {

            recognitionRef.current.stop();

        }


        setIsRecording(false);

        setInterimTranscript("");

        console.log(
            "Recording stopped"
        );
    };


    // ==============================
    // CLEANUP
    // ==============================

    useEffect(() => {

        return () => {

            if (
                recognitionRef.current
            ) {

                recognitionRef.current.stop();

            }


            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !==
                    "inactive"
            ) {

                mediaRecorderRef.current.stop();

            }

        };

    }, []);


    // ==============================
    // UI
    // ==============================

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
                            Practice real interview
                            questions and receive
                            AI-powered feedback
                            on your answers.
                        </p>

                    </div>


                    <div className="setup-card">

                        {/* ROLE */}

                        <div className="form-group">

                            <label>
                                Target Role
                            </label>

                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(
                                        e.target.value
                                    )
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


                        {/* TYPE */}

                        <div className="form-group">

                            <label>
                                Interview Type
                            </label>

                            <select
                                value={type}
                                onChange={(e) =>
                                    setType(
                                        e.target.value
                                    )
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


                        {/* DIFFICULTY */}

                        <div className="form-group">

                            <label>
                                Difficulty
                            </label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(
                                        e.target.value
                                    )
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


                        {/* START */}

                        <button
                            className="start-interview-button"
                            onClick={
                                startInterview
                            }
                            disabled={loading}
                        >

                            {loading
                                ? "Generating Question..."
                                : "Start Mock Interview"
                            }

                            {!loading && (
                                <span>→</span>
                            )}

                        </button>

                    </div>

                </div>

            ) : (

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

                            {category ||
                                type ||
                                "INTERVIEW"}{" "}
                            QUESTION

                        </span>

                        <h2>
                            {question}
                        </h2>

                        <p>
                            Think carefully and
                            explain your answer
                            clearly.
                        </p>

                    </div>


                    {/* ANSWER */}

                    <div className="answer-card">

                        <div className="recording-status">

                            <div className="microphone-circle">
                                🎤
                            </div>

                            <div>

                                <h3>

                                    {isRecording
                                        ? "Listening..."
                                        : "Ready to answer?"
                                    }

                                </h3>

                                <p>

                                    {isRecording
                                        ? "Speak clearly. Your answer is being recorded."
                                        : "Speak your answer clearly. Your communication will be analyzed."
                                    }

                                </p>

                            </div>

                        </div>


                        {/* RECORD BUTTON */}

                        {!isRecording ? (

                            <button
                                className="record-button"
                                onClick={
                                    startRecording
                                }
                            >

                                🎙 Start Recording

                            </button>

                        ) : (

                            <button
                                className="record-button"
                                onClick={
                                    stopRecording
                                }
                            >

                                ⏹ Stop Recording

                            </button>

                        )}


                        {/* TRANSCRIPT */}

                        {(transcript ||
                            interimTranscript) && (

                            <div className="transcript-box">

                                <h3>
                                    Your spoken answer
                                </h3>

                                <p>

                                    {transcript}

                                    <span
                                        style={{
                                            opacity: 0.5
                                        }}
                                    >
                                        {
                                            interimTranscript
                                        }
                                    </span>

                                </p>

                            </div>

                        )}


                        {/* AUDIO */}

                        {audioURL && (

                            <div className="audio-section">

                                <h3>
                                    Your recorded answer
                                </h3>

                                <audio
                                    controls
                                    src={audioURL}
                                />

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );
}