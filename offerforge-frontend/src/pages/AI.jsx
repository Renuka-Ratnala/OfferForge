import { useEffect, useRef, useState } from "react";
import api from "../api/api";

export default function AI() {

    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Hi! I'm your OfferForge AI Career Coach. I can help with your resume, ATS score, interviews, skills, projects, internships, and career preparation."
        }
    ]);

    const [input, setInput] = useState("");

    const [tips, setTips] = useState([]);

    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);


    useEffect(() => {

        fetchTips();

    }, []);


    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, loading]);


    const fetchTips = async () => {

        try {

            const response =
                await api.get("/ai/tips");

            setTips(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load AI tips:",
                error
            );

        }

    };


    const sendMessage = async (
        message = input
    ) => {

        const text =
            message.trim();

        if (!text || loading) {
            return;
        }


        setMessages(
            previous => [
                ...previous,
                {
                    role: "user",
                    text: text
                }
            ]
        );

        setInput("");

        setLoading(true);


        try {

            const response =
                await api.post(
                    "/ai/chat",
                    {
                        message: text
                    }
                );


            setMessages(
                previous => [
                    ...previous,
                    {
                        role: "ai",
                        text:
                            response.data?.response ||
                            "I couldn't generate a response right now."
                    }
                ]
            );

        } catch (error) {

            console.error(
                "AI Coach error:",
                error
            );

            setMessages(
                previous => [
                    ...previous,
                    {
                        role: "ai",
                        text:
                            "I couldn't connect to the AI Career Coach right now. Please try again."
                    }
                ]
            );

        } finally {

            setLoading(false);

        }

    };


    const handleSubmit = (e) => {

        e.preventDefault();

        sendMessage();

    };


    const handleSuggestion = (
        suggestion
    ) => {

        sendMessage(
            suggestion
        );

    };


    return (

        <div
            style={{
                minHeight: "100vh",
                padding: "30px",
                color: "#f8fafc",
                background:
                    "linear-gradient(135deg, #080d19, #111827)"
            }}
        >

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        marginBottom: "25px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px"
                        }}
                    >

                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "26px",
                                background:
                                    "linear-gradient(135deg, #7c3aed, #ec4899)"
                            }}
                        >
                            🤖
                        </div>


                        <div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "30px",
                                    fontWeight: 700
                                }}
                            >
                                AI Career Coach
                            </h1>

                            <p
                                style={{
                                    margin:
                                        "6px 0 0",
                                    color:
                                        "#94a3b8"
                                }}
                            >
                                Personalized career guidance powered by your OfferForge data.
                            </p>

                        </div>

                    </div>

                </div>


                {/* MAIN GRID */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 300px",
                        gap: "20px"
                    }}
                >

                    {/* CHAT */}

                    <div
                        style={{
                            height: "650px",
                            display: "flex",
                            flexDirection:
                                "column",
                            background:
                                "#111827",
                            border:
                                "1px solid #1e293b",
                            borderRadius:
                                "18px",
                            overflow:
                                "hidden"
                        }}
                    >

                        {/* CHAT HEADER */}

                        <div
                            style={{
                                padding: "18px 22px",
                                borderBottom:
                                    "1px solid #1e293b",
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: "10px"
                            }}
                        >

                            <div
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "#22c55e"
                                }}
                            />

                            <span
                                style={{
                                    color:
                                        "#cbd5e1",
                                    fontSize:
                                        "14px"
                                }}
                            >
                                AI Coach Online
                            </span>

                        </div>


                        {/* MESSAGES */}

                        <div
                            style={{
                                flex: 1,
                                overflowY:
                                    "auto",
                                padding: "25px"
                            }}
                        >

                            {messages.map(
                                (
                                    message,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                message.role ===
                                                "user"
                                                    ? "flex-end"
                                                    : "flex-start",
                                            marginBottom:
                                                "18px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                maxWidth:
                                                    "75%",
                                                padding:
                                                    "14px 17px",
                                                borderRadius:
                                                    "14px",
                                                lineHeight:
                                                    "1.55",
                                                whiteSpace:
                                                    "pre-wrap",
                                                background:
                                                    message.role ===
                                                    "user"
                                                        ? "#7c3aed"
                                                        : "#182235",
                                                color:
                                                    "#f8fafc",
                                                border:
                                                    message.role ===
                                                    "user"
                                                        ? "none"
                                                        : "1px solid #263247"
                                            }}
                                        >

                                            {message.role ===
                                                "ai" && (

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "12px",
                                                        color:
                                                            "#a78bfa",
                                                        fontWeight:
                                                            600,
                                                        marginBottom:
                                                            "5px"
                                                    }}
                                                >
                                                    OFFERFORGE AI
                                                </div>

                                            )}

                                            {message.text}

                                        </div>

                                    </div>

                                )
                            )}


                            {loading && (

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        marginBottom:
                                            "18px"
                                    }}
                                >

                                    <div
                                        style={{
                                            padding:
                                                "14px 18px",
                                            borderRadius:
                                                "14px",
                                            background:
                                                "#182235",
                                            color:
                                                "#94a3b8"
                                        }}
                                    >
                                        Thinking...
                                    </div>

                                </div>

                            )}


                            <div
                                ref={
                                    messagesEndRef
                                }
                            />

                        </div>


                        {/* INPUT */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            style={{
                                padding:
                                    "18px",
                                borderTop:
                                    "1px solid #1e293b",
                                display:
                                    "flex",
                                gap: "10px"
                            }}
                        >

                            <input
                                value={input}
                                onChange={(e) =>
                                    setInput(
                                        e.target.value
                                    )
                                }
                                placeholder="Ask your career question..."
                                disabled={
                                    loading
                                }
                                style={{
                                    flex: 1,
                                    padding:
                                        "14px 16px",
                                    borderRadius:
                                        "12px",
                                    border:
                                        "1px solid #273044",
                                    outline:
                                        "none",
                                    background:
                                        "#0b1120",
                                    color:
                                        "#f8fafc",
                                    fontSize:
                                        "14px"
                                }}
                            />


                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !input.trim()
                                }
                                style={{
                                    padding:
                                        "0 22px",
                                    border: "none",
                                    borderRadius:
                                        "12px",
                                    background:
                                        "#7c3aed",
                                    color:
                                        "white",
                                    fontWeight:
                                        600,
                                    cursor:
                                        loading
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        loading ||
                                        !input.trim()
                                            ? 0.6
                                            : 1
                                }}
                            >

                                {loading
                                    ? "..."
                                    : "Send →"
                                }

                            </button>

                        </form>

                    </div>


                    {/* SIDEBAR */}

                    <div
                        style={{
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            gap: "20px"
                        }}
                    >

                        {/* SUGGESTIONS */}

                        <div
                            style={{
                                padding:
                                    "20px",
                                borderRadius:
                                    "18px",
                                background:
                                    "#111827",
                                border:
                                    "1px solid #1e293b"
                            }}
                        >

                            <h2
                                style={{
                                    margin:
                                        "0 0 15px",
                                    fontSize:
                                        "17px"
                                }}
                            >
                                ✨ Try asking
                            </h2>


                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    gap:
                                        "9px"
                                }}
                            >

                                {[
                                    "How can I improve my resume?",
                                    "Am I ready for a software engineering interview?",
                                    "What skills should I learn next?",
                                    "How can I improve my ATS score?"
                                ].map(
                                    (
                                        question,
                                        index
                                    ) => (

                                        <button
                                            key={
                                                index
                                            }
                                            onClick={() =>
                                                handleSuggestion(
                                                    question
                                                )
                                            }
                                            disabled={
                                                loading
                                            }
                                            style={{
                                                textAlign:
                                                    "left",
                                                padding:
                                                    "11px",
                                                border:
                                                    "1px solid #273044",
                                                borderRadius:
                                                    "10px",
                                                background:
                                                    "#151e2e",
                                                color:
                                                    "#cbd5e1",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >

                                            {question}

                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* AI TIPS */}

                        <div
                            style={{
                                padding:
                                    "20px",
                                borderRadius:
                                    "18px",
                                background:
                                    "#111827",
                                border:
                                    "1px solid #1e293b"
                            }}
                        >

                            <h2
                                style={{
                                    margin:
                                        "0 0 15px",
                                    fontSize:
                                        "17px"
                                }}
                            >
                                💡 Career Tips
                            </h2>


                            {tips.length >
                            0 ? (

                                tips.map(
                                    (
                                        tip,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                index
                                            }
                                            style={{
                                                padding:
                                                    "11px 0",
                                                borderBottom:
                                                    index <
                                                    tips.length -
                                                        1
                                                        ? "1px solid #1e293b"
                                                        : "none",
                                                color:
                                                    "#cbd5e1",
                                                fontSize:
                                                    "13px",
                                                lineHeight:
                                                    "1.5"
                                            }}
                                        >

                                            {tip}

                                        </div>

                                    )
                                )

                            ) : (

                                <p
                                    style={{
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "13px"
                                    }}
                                >
                                    Loading personalized tips...
                                </p>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}