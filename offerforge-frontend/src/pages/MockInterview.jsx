import { useEffect, useRef, useState } from "react";
import "./MockInterview.css";

const API_URL =
    "https://offerforge-backend-rxyb.onrender.com";

export default function MockInterview() {

    // =========================================================
    // INTERVIEW SETUP
    // =========================================================

    const [started, setStarted] = useState(false);

    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [difficulty, setDifficulty] = useState("");

    // =========================================================
    // QUESTION
    // =========================================================

    const [question, setQuestion] = useState("");
    const [category, setCategory] = useState("");

    const [questionNumber, setQuestionNumber] = useState(1);

    const [loading, setLoading] = useState(false);

    // =========================================================
    // EVALUATION
    // =========================================================

    const [evaluation, setEvaluation] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    // =========================================================
    // RECORDING
    // =========================================================

    const [isRecording, setIsRecording] = useState(false);

    const [audioURL, setAudioURL] = useState("");

    const [transcript, setTranscript] = useState("");

    const [interimTranscript, setInterimTranscript] = useState("");

    // =========================================================
    // REFS
    // =========================================================

    const mediaRecorderRef = useRef(null);

    const audioChunksRef = useRef([]);

    const recognitionRef = useRef(null);


    // =========================================================
    // GENERATE FIRST INTERVIEW QUESTION
    // =========================================================

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
                        "Content-Type": "application/json"
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
                    "Question API error:",
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

            setQuestionNumber(1);

            setEvaluation(null);

            setTranscript("");

            setInterimTranscript("");

            setAudioURL("");

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


    // =========================================================
    // START RECORDING
    // =========================================================

    const startRecording = async () => {

        try {

            console.log(
                "Requesting microphone..."
            );

            // Clear previous answer

            setTranscript("");

            setInterimTranscript("");

            setAudioURL("");

            setEvaluation(null);


            // =================================================
            // MICROPHONE
            // =================================================

            const stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        audio: true
                    }
                );

            console.log(
                "Microphone access granted"
            );


            // =================================================
            // MEDIA RECORDER
            // =================================================

            const mediaRecorder =
                new MediaRecorder(stream);

            mediaRecorderRef.current =
                mediaRecorder;

            audioChunksRef.current = [];


            // =================================================
            // AUDIO DATA
            // =================================================

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


            // =================================================
            // RECORDING STOPPED
            // =================================================

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

                console.log(
                    "Audio created successfully"
                );


                // Stop microphone

                stream
                    .getTracks()
                    .forEach(
                        (track) => {
                            track.stop();
                        }
                    );

            };


            // =================================================
            // SPEECH RECOGNITION
            // =================================================

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
                        (track) => {
                            track.stop();
                        }
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


            // =================================================
            // RECOGNITION START
            // =================================================

            recognition.onstart = () => {

                console.log(
                    "Speech recognition started"
                );

            };


            // =================================================
            // SPEECH RESULT
            // =================================================

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


                    // Add final transcript

                    if (finalText) {

                        setTranscript(
                            (previous) =>
                                previous +
                                finalText
                        );

                    }


                    // Show live transcript

                    setInterimTranscript(
                        interimText
                    );

                };


            // =================================================
            // RECOGNITION ERROR
            // =================================================

            recognition.onerror =
                (event) => {

                    console.error(
                        "Speech recognition error:",
                        event.error
                    );

                };


            // =================================================
            // RECOGNITION END
            // =================================================

            recognition.onend = () => {

                console.log(
                    "Speech recognition ended"
                );

            };


            // =================================================
            // START RECORDING + RECOGNITION
            // =================================================

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


    // =========================================================
    // STOP RECORDING
    // =========================================================

    const stopRecording = () => {

        console.log(
            "Stopping recording..."
        );


        // Stop MediaRecorder

        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !==
                "inactive"
        ) {

            mediaRecorderRef.current.stop();

        }


        // Stop speech recognition

        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(
                    "Recognition already stopped."
                );

            }

        }


        setIsRecording(false);

        setInterimTranscript("");

        console.log(
            "Recording stopped"
        );

    };


    // =========================================================
    // SUBMIT ANSWER FOR AI EVALUATION
    // =========================================================

    const submitAnswer = async () => {

        if (!transcript.trim()) {

            alert(
                "Please record your answer before submitting."
            );

            return;
        }

        setSubmitting(true);

        try {

            console.log(
                "Submitting answer for evaluation..."
            );


            const response = await fetch(
                `${API_URL}/api/ai/interview/evaluate`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        role: role,

                        type: type,

                        difficulty: difficulty,

                        question: question,

                        answer: transcript.trim()

                    })
                }
            );


            console.log(
                "Evaluation API status:",
                response.status
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Evaluation API error:",
                    errorText
                );

                throw new Error(
                    `Server error: ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "AI Evaluation:",
                data
            );


            setEvaluation(data);


        } catch (error) {

            console.error(
                "Evaluation failed:",
                error
            );

            alert(
                "Unable to evaluate your answer.\n" +
                error.message
            );

        } finally {

            setSubmitting(false);

        }

    };


    // =========================================================
    // GENERATE NEXT QUESTION
    // =========================================================

    const nextQuestion = async () => {

        // Finish after question 5

        if (questionNumber >= 5) {

            alert(
                "Interview completed!"
            );

            return;

        }


        setLoading(true);

        setEvaluation(null);

        setTranscript("");

        setInterimTranscript("");

        setAudioURL("");


        try {

            console.log(
                "Generating next question..."
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
                "Next question API status:",
                response.status
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Next question error:",
                    errorText
                );

                throw new Error(
                    `Server error: ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Next question:",
                data
            );


            setQuestion(
                data.question
            );


            setCategory(
                data.category || type
            );


            setQuestionNumber(
                (previous) =>
                    previous + 1
            );


        } catch (error) {

            console.error(
                "Next question failed:",
                error
            );

            alert(
                "Unable to generate the next question.\n" +
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // CLEANUP
    // =========================================================

    useEffect(() => {

        return () => {

            // Stop speech recognition

            if (recognitionRef.current) {

                try {

                    recognitionRef.current.stop();

                } catch (error) {

                    console.log(
                        "Speech recognition already stopped."
                    );

                }

            }


            // Stop media recorder

            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !==
                    "inactive"
            ) {

                mediaRecorderRef.current.stop();

            }

        };

    }, []);


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="mock-interview-page">


            {/* =================================================
                SETUP SCREEN
            ================================================= */}

            {!started ? (

                <div className="interview-setup">


                    {/* HEADER */}

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


                    {/* SETUP CARD */}

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


                        {/* INTERVIEW TYPE */}

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


                        {/* START INTERVIEW */}

                        <button
                            className="start-interview-button"
                            onClick={startInterview}
                            disabled={loading}
                        >

                            {loading
                                ? "Generating Question..."
                                : "Start Mock Interview"
                            }

                            {!loading && (
                                <span>
                                    →
                                </span>
                            )}

                        </button>

                    </div>

                </div>


            ) : (


                /* =================================================
                   INTERVIEW SCREEN
                ================================================= */

                <div className="interview-screen">


                    {/* =================================================
                        TOP BAR
                    ================================================= */}

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

                            Question{" "}
                            {questionNumber} / 5

                        </div>

                    </div>


                    {/* =================================================
                        QUESTION CARD
                    ================================================= */}

                    <div className="question-card">

                        <span className="question-label">

                            {(
                                category ||
                                type ||
                                "INTERVIEW"
                            ).toUpperCase()}{" "}

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


                    {/* =================================================
                        ANSWER CARD
                    ================================================= */}

                    <div className="answer-card">


                        {/* =================================================
                            RECORDING STATUS
                        ================================================= */}

                        <div className="recording-status">

                            <div className="microphone-circle">

                                {isRecording
                                    ? "🔴"
                                    : "🎤"
                                }

                            </div>


                            <div>

                                <h3>

                                    {isRecording
                                        ? "Recording..."
                                        : "Ready to answer?"
                                    }

                                </h3>


                                <p>

                                    {isRecording
                                        ? "Speak clearly. Click Stop Recording when you finish."
                                        : "Speak your answer clearly. Your communication will be analyzed."
                                    }

                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            RECORD / STOP BUTTON
                        ================================================= */}

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
                                className="record-button stop-recording-button"
                                onClick={
                                    stopRecording
                                }
                            >

                                ⏹ Stop Recording

                            </button>

                        )}


                        {/* =================================================
                            LIVE TRANSCRIPT
                        ================================================= */}

                        {isRecording && (

                            <div className="live-transcript">

                                <h3>
                                    Your answer
                                </h3>

                                <p>

                                    {transcript}

                                    {interimTranscript && (

                                        <span className="interim-text">

                                            {" "}
                                            {interimTranscript}

                                        </span>

                                    )}

                                </p>

                            </div>

                        )}


                        {/* =================================================
                            RECORDED ANSWER
                        ================================================= */}

                        {audioURL && (

                            <div className="recorded-answer">

                                <h3>
                                    Your recorded answer
                                </h3>


                                <audio
                                    controls
                                    src={audioURL}
                                    className="recorded-audio"
                                />


                                {/* =================================================
                                    SUBMIT ANSWER
                                ================================================= */}

                                {!evaluation && (

                                    <button
                                        className="submit-answer-button"
                                        onClick={
                                            submitAnswer
                                        }
                                        disabled={
                                            submitting
                                        }
                                    >

                                        {submitting
                                            ? "Analyzing Answer..."
                                            : "Submit Answer →"
                                        }

                                    </button>

                                )}

                            </div>

                        )}


                        {/* =================================================
                            AI EVALUATION
                        ================================================= */}

                        {evaluation && (

                            <div className="evaluation-card">


                                {/* =================================================
                                    EVALUATION HEADER
                                ================================================= */}

                                <div className="evaluation-header">

                                    <div>

                                        <span className="interview-label">
                                            AI EVALUATION
                                        </span>

                                        <h2>
                                            Your Answer Feedback
                                        </h2>

                                    </div>


                                    <div className="overall-score">

                                        {evaluation.score ??
                                            0}/100

                                    </div>

                                </div>


                                {/* =================================================
                                    SCORE GRID
                                ================================================= */}

                                <div className="score-grid">


                                    <div className="score-item">

                                        <span>
                                            Confidence
                                        </span>

                                        <strong>

                                            {evaluation.confidence ??
                                                0}/100

                                        </strong>

                                    </div>


                                    <div className="score-item">

                                        <span>
                                            Communication
                                        </span>

                                        <strong>

                                            {evaluation.communication ??
                                                0}/100

                                        </strong>

                                    </div>


                                    <div className="score-item">

                                        <span>
                                            Technical Accuracy
                                        </span>

                                        <strong>

                                            {evaluation.technicalAccuracy ??
                                                0}/100

                                        </strong>

                                    </div>

                                </div>


                                {/* =================================================
                                    FEEDBACK
                                ================================================= */}

                                <div className="feedback-section">

                                    <h3>
                                        AI Feedback
                                    </h3>

                                    <p>

                                        {evaluation.feedback ||
                                            "No feedback available."}

                                    </p>

                                </div>


                                {/* =================================================
                                    STRENGTHS
                                ================================================= */}

                                <div className="feedback-section">

                                    <h3>
                                        Strengths
                                    </h3>


                                    {evaluation.strengths &&
                                    evaluation.strengths.length >
                                        0 ? (

                                        <ul>

                                            {evaluation.strengths.map(
                                                (
                                                    strength,
                                                    index
                                                ) => (

                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >

                                                        {strength}

                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    ) : (

                                        <p>
                                            No strengths provided.
                                        </p>

                                    )}

                                </div>


                                {/* =================================================
                                    IMPROVEMENTS
                                ================================================= */}

                                <div className="feedback-section">

                                    <h3>
                                        Areas to Improve
                                    </h3>


                                    {evaluation.improvements &&
                                    evaluation.improvements.length >
                                        0 ? (

                                        <ul>

                                            {evaluation.improvements.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >

                                                        {item}

                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    ) : (

                                        <p>
                                            No improvement suggestions provided.
                                        </p>

                                    )}

                                </div>


                                {/* =================================================
                                    NEXT QUESTION
                                ================================================= */}

                                <button
                                    className="next-question-button"
                                    onClick={
                                        nextQuestion
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    {loading

                                        ? "Generating Question..."

                                        : questionNumber >=
                                          5

                                        ? "Finish Interview"

                                        : "Next Question →"

                                    }

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}