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

    const [questionNumber, setQuestionNumber] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    // =========================================================
    // EVALUATION
    // =========================================================

    const [evaluation, setEvaluation] =
        useState(null);

    const [evaluations, setEvaluations] =
        useState([]);

    const [showResults, setShowResults] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    // =========================================================
    // RECORDING
    // =========================================================

    const [isRecording, setIsRecording] =
        useState(false);

    const [audioURL, setAudioURL] =
        useState("");

    const [transcript, setTranscript] =
        useState("");

    const [interimTranscript, setInterimTranscript] =
        useState("");

    // =========================================================
    // REFS
    // =========================================================

    const mediaRecorderRef =
        useRef(null);

    const audioChunksRef =
        useRef([]);

    const recognitionRef =
        useRef(null);

    // Keeps transcript immediately available
    // even before React updates state.
    const transcriptRef =
        useRef("");


    // =========================================================
    // START INTERVIEW
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
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        role: role,

                        type: type,

                        difficulty: difficulty,

                        questionNumber: 1

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

            setEvaluations([]);

            setShowResults(false);

            setTranscript("");

            setInterimTranscript("");

            setAudioURL("");

            transcriptRef.current = "";

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

            transcriptRef.current = "";


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


                    // Save final transcript
                    // immediately to ref and state

                    if (finalText.trim()) {

                        transcriptRef.current =
                            `${transcriptRef.current} ${finalText}`
                                .trim();

                        setTranscript(
                            transcriptRef.current
                        );

                        console.log(
                            "Final transcript:",
                            transcriptRef.current
                        );

                    }


                    // Live interim text

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
            // START BOTH
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


        // Stop media recorder

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


        // Use the latest transcript
        // directly from the ref

        const currentTranscript =
            transcriptRef.current.trim();

        const currentInterim =
            interimTranscript.trim();

        const finalAnswer =
            currentTranscript ||
            currentInterim;


        if (finalAnswer) {

            transcriptRef.current =
                finalAnswer;

            setTranscript(
                finalAnswer
            );

        }


        setInterimTranscript("");

        setIsRecording(false);

        console.log(
            "Final answer:",
            finalAnswer
        );

        console.log(
            "Recording stopped"
        );

    };


    // =========================================================
    // SUBMIT ANSWER FOR AI EVALUATION
    // =========================================================

    const submitAnswer = async () => {

        // IMPORTANT:
        // Use the ref because React state can update slightly later.

        const finalAnswer =
            transcriptRef.current.trim() ||
            transcript.trim();

        if (!finalAnswer) {

            alert(
                "Please record your answer before submitting."
            );

            return;
        }

        if (submitting) {

            return;

        }

        setSubmitting(true);

        const maxAttempts = 3;

        try {

            for (
                let attempt = 1;
                attempt <= maxAttempts;
                attempt++
            ) {

                console.log(
                    `Submitting answer... Attempt ${attempt}/${maxAttempts}`
                );

                try {

                    const response =
                        await fetch(
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

                                    answer: finalAnswer

                                })
                            }
                        );


                    console.log(
                        "Evaluation API status:",
                        response.status
                    );


                    // =================================================
                    // SUCCESS
                    // =================================================

                    if (response.ok) {

                        const data =
                            await response.json();

                        console.log(
                            "AI Evaluation:",
                            data
                        );


                        // Save current evaluation

                        setEvaluation(
                            data
                        );


                        // IMPORTANT:
                        // Store evaluation for final interview results.

                        setEvaluations(
                            (previous) => [
                                ...previous,
                                data
                            ]
                        );


                        return;
                    }


                    // =================================================
                    // SERVER ERROR
                    // =================================================

                    const errorText =
                        await response.text();

                    console.error(
                        `Evaluation attempt ${attempt} failed:`,
                        errorText
                    );


                    // Retry if attempts remain

                    if (
                        attempt <
                        maxAttempts
                    ) {

                        console.log(
                            "Retrying evaluation..."
                        );

                        await new Promise(
                            (resolve) =>
                                setTimeout(
                                    resolve,
                                    1500
                                )
                        );

                    }

                } catch (error) {

                    console.error(
                        `Evaluation attempt ${attempt} error:`,
                        error
                    );


                    // Retry if attempts remain

                    if (
                        attempt <
                        maxAttempts
                    ) {

                        console.log(
                            "Retrying evaluation..."
                        );

                        await new Promise(
                            (resolve) =>
                                setTimeout(
                                    resolve,
                                    1500
                                )
                        );

                    }

                }

            }


            // =================================================
            // ALL ATTEMPTS FAILED
            // =================================================

            alert(
                "Unable to evaluate your answer right now. Please try again."
            );

        } finally {

            setSubmitting(false);

        }

    };


    // =========================================================
    // GENERATE NEXT QUESTION
    // =========================================================

    const nextQuestion = async () => {

        // =================================================
        // FINISH AFTER QUESTION 5
        // =================================================

        if (questionNumber >= 5) {

            setShowResults(true);

            return;

        }


        setLoading(true);

        setEvaluation(null);

        setTranscript("");

        setInterimTranscript("");

        setAudioURL("");

        transcriptRef.current = "";


        try {

            console.log(
                "Generating next question..."
            );


            const nextNumber =
                questionNumber + 1;


            const response =
                await fetch(
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

                            difficulty: difficulty,

                            questionNumber:
                                nextNumber

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
                nextNumber
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

            if (
                recognitionRef.current
            ) {

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
    // RESULT CALCULATIONS
    // =========================================================

    const calculateAverage = (field) => {

        if (
            evaluations.length === 0
        ) {

            return 0;

        }


        const total =
            evaluations.reduce(
                (sum, item) =>
                    sum +
                    (Number(item[field]) || 0),
                0
            );


        return Math.round(
            total / evaluations.length
        );

    };


    const overallScore =
        calculateAverage("score");

    const overallConfidence =
        calculateAverage("confidence");

    const overallCommunication =
        calculateAverage("communication");

    const overallTechnicalAccuracy =
        calculateAverage(
            "technicalAccuracy"
        );


    // =========================================================
    // PERFORMANCE LABEL
    // =========================================================

    const getPerformanceLabel =
        (score) => {

            if (score >= 85) {

                return "Excellent";

            }

            if (score >= 70) {

                return "Good";

            }

            if (score >= 50) {

                return "Needs Improvement";

            }

            return "Keep Practicing";

        };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="mock-interview-page">


            {/* =================================================
                FINAL RESULTS
            ================================================= */}

            {showResults ? (

                <div className="interview-results">


                    <div className="results-header">

                        <div className="interview-icon">
                            🏆
                        </div>

                        <span className="interview-label">
                            INTERVIEW COMPLETE
                        </span>

                        <h1>
                            Your Interview Results
                        </h1>

                        <p>
                            Here's how you performed
                            across{" "}
                            {evaluations.length}
                            {" "}questions.
                        </p>

                    </div>


                    {/* OVERALL SCORE */}

                    <div className="overall-result-card">

                        <span>
                            Overall Score
                        </span>

                        <div>

                            <strong>
                                {overallScore}
                            </strong>

                            <small>
                                / 100
                            </small>

                        </div>

                        <h2>
                            {getPerformanceLabel(
                                overallScore
                            )}
                        </h2>

                    </div>


                    {/* SCORE GRID */}

                    <div className="result-score-grid">


                        <div className="result-score-card">

                            <span>
                                Confidence
                            </span>

                            <strong>
                                {overallConfidence}/100
                            </strong>

                        </div>


                        <div className="result-score-card">

                            <span>
                                Communication
                            </span>

                            <strong>
                                {overallCommunication}/100
                            </strong>

                        </div>


                        <div className="result-score-card">

                            <span>
                                Technical Accuracy
                            </span>

                            <strong>
                                {overallTechnicalAccuracy}/100
                            </strong>

                        </div>

                    </div>


                    {/* SUMMARY */}

                    <div className="results-summary-card">

                        <h2>
                            Performance Summary
                        </h2>

                        <p>
                            You completed a{" "}
                            {evaluations.length}
                            -question{" "}
                            {type.toLowerCase()}
                            {" "}mock interview for the{" "}
                            {role} role at{" "}
                            {difficulty.toLowerCase()}
                            {" "}difficulty.
                        </p>

                    </div>


                    {/* NEW INTERVIEW */}

                    <button
                        className="start-interview-button"
                        onClick={() => {

                            setStarted(false);

                            setShowResults(false);

                            setQuestion("");

                            setQuestionNumber(1);

                            setEvaluation(null);

                            setEvaluations([]);

                            setTranscript("");

                            setInterimTranscript("");

                            setAudioURL("");

                            transcriptRef.current = "";

                        }}
                    >

                        Start New Interview →

                    </button>

                </div>


            ) : !started ? (


                /* =================================================
                   SETUP SCREEN
                ================================================= */

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

                            Question{" "}
                            {questionNumber} / 5

                        </div>

                    </div>


                    {/* QUESTION */}

                    <div className="question-card">

                        <span className="question-label">

                            {(
                                category ||
                                type ||
                                "INTERVIEW"
                            ).toUpperCase()}

                            {" "}QUESTION

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


                    {/* ANSWER CARD */}

                    <div className="answer-card">


                        {/* RECORDING STATUS */}

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


                        {/* RECORD / STOP */}

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


                        {/* LIVE TRANSCRIPT */}

                        {isRecording && (

                            <div className="live-transcript">

                                <h3>
                                    Listening...
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


                        {/* RECORDED ANSWER */}

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


                                {/* TRANSCRIBED ANSWER */}

                                <div className="transcribed-answer">

                                    <h3>
                                        Transcribed Answer
                                    </h3>

                                    {transcript ? (

                                        <p>
                                            {transcript}
                                        </p>

                                    ) : (

                                        <p className="no-transcript">

                                            No speech was detected.
                                            Please record your answer
                                            again.

                                        </p>

                                    )}

                                </div>


                                {/* SUBMIT */}

                                {!evaluation && (

                                    <button
                                        className="submit-answer-button"
                                        onClick={
                                            submitAnswer
                                        }
                                        disabled={
                                            submitting ||
                                            !transcript.trim()
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


                        {/* AI EVALUATION */}

                        {evaluation && (

                            <div className="evaluation-card">


                                {/* HEADER */}

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


                                {/* SCORES */}

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


                                {/* FEEDBACK */}

                                <div className="feedback-section">

                                    <h3>
                                        AI Feedback
                                    </h3>

                                    <p>

                                        {evaluation.feedback ||
                                            "No feedback available."}

                                    </p>

                                </div>


                                {/* STRENGTHS */}

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


                                {/* IMPROVEMENTS */}

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


                                {/* NEXT QUESTION */}

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

                                        : questionNumber >= 5

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