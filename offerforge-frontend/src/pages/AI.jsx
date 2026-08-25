import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import "./AI.css";

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

            setTips(response.data || []);

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

        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                text
            }
        ]);

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

            setMessages((previous) => [
                ...previous,
                {
                    role: "ai",
                    text:
                        response.data?.response ||
                        "I couldn't generate a response right now."
                }
            ]);

        } catch (error) {

            console.error(
                "AI Coach error:",
                error
            );

            console.error(
                "AI Coach response:",
                error.response?.data
            );

            setMessages((previous) => [
                ...previous,
                {
                    role: "ai",
                    text:
                        error.response?.data?.message ||
                        "I couldn't connect to the AI Career Coach right now. Please try again."
                }
            ]);

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

        sendMessage(suggestion);

    };

    const suggestions = [
        {
            icon: "📄",
            title: "Resume Review",
            text: "How can I improve my resume?"
        },
        {
            icon: "🎤",
            title: "Interview Prep",
            text: "Am I ready for a software engineering interview?"
        },
        {
            icon: "🧠",
            title: "Skills",
            text: "What skills should I learn next?"
        },
        {
            icon: "📊",
            title: "ATS Score",
            text: "How can I improve my ATS score?"
        }
    ];

    return (

        <div className="ai-page">

            <div className="ai-container">

                <header className="ai-page-header">

                    <div className="ai-header-icon">
                        🤖
                    </div>

                    <div>

                        <span className="ai-eyebrow">
                            OFFERFORGE AI
                        </span>

                        <h1>
                            AI Career Coach
                        </h1>

                        <p>
                            Your personal assistant for resumes,
                            interviews, skills and career preparation.
                        </p>

                    </div>

                    <div className="ai-online-badge">
                        <span />
                        AI ONLINE
                    </div>

                </header>

                <div className="ai-layout">

                    <main className="ai-chat-card">

                        <div className="ai-chat-header">

                            <div className="ai-chat-avatar">
                                🤖
                            </div>

                            <div>

                                <h2>
                                    OfferForge AI
                                </h2>

                                <p>
                                    Career guidance assistant
                                </p>

                            </div>

                            <span className="ai-chat-status">
                                ● Online
                            </span>

                        </div>

                        <div className="ai-messages">

                            {messages.map(
                                (message, index) => (

                                    <div
                                        key={index}
                                        className={
                                            message.role === "user"
                                                ? "ai-message-row user-message-row"
                                                : "ai-message-row"
                                        }
                                    >

                                        {message.role === "ai" && (

                                            <div className="ai-message-avatar">
                                                🤖
                                            </div>

                                        )}

                                        <div
                                            className={
                                                message.role === "user"
                                                    ? "ai-message user-message"
                                                    : "ai-message"
                                            }
                                        >

                                            {message.role === "ai" && (

                                                <span className="ai-message-label">
                                                    OFFERFORGE AI
                                                </span>

                                            )}

                                            <div>
                                                {message.text}
                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                            {loading && (

                                <div className="ai-message-row">

                                    <div className="ai-message-avatar">
                                        🤖
                                    </div>

                                    <div className="ai-message thinking-message">

                                        <span />
                                        <span />
                                        <span />

                                    </div>

                                </div>

                            )}

                            <div
                                ref={messagesEndRef}
                            />

                        </div>

                        <form
                            className="ai-input-area"
                            onSubmit={handleSubmit}
                        >

                            <input
                                value={input}
                                onChange={(e) =>
                                    setInput(e.target.value)
                                }
                                placeholder="Ask your career question..."
                                disabled={loading}
                            />

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !input.trim()
                                }
                            >
                                {loading
                                    ? "..."
                                    : "Send →"}
                            </button>

                        </form>

                    </main>

                    <aside className="ai-sidebar">

                        <div className="ai-sidebar-card">

                            <div className="ai-sidebar-title">

                                <div className="sidebar-title-icon">
                                    ✨
                                </div>

                                <div>

                                    <h2>
                                        Quick Start
                                    </h2>

                                    <p>
                                        Try one of these
                                    </p>

                                </div>

                            </div>

                            <div className="ai-suggestions">

                                {suggestions.map(
                                    (suggestion, index) => (

                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleSuggestion(
                                                    suggestion.text
                                                )
                                            }
                                            disabled={loading}
                                            className="ai-suggestion"
                                        >

                                            <span className="suggestion-icon">
                                                {suggestion.icon}
                                            </span>

                                            <span>

                                                <strong>
                                                    {suggestion.title}
                                                </strong>

                                                <small>
                                                    {suggestion.text}
                                                </small>

                                            </span>

                                            <span className="suggestion-arrow">
                                                →
                                            </span>

                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                        <div className="ai-sidebar-card">

                            <div className="ai-sidebar-title">

                                <div className="sidebar-title-icon">
                                    💡
                                </div>

                                <div>

                                    <h2>
                                        Career Tips
                                    </h2>

                                    <p>
                                        From your AI coach
                                    </p>

                                </div>

                            </div>

                            <div className="ai-tips">

                                {tips.length > 0 ? (

                                    tips.map(
                                        (tip, index) => (

                                            <div
                                                className="ai-tip"
                                                key={index}
                                            >

                                                <span>
                                                    {index + 1}
                                                </span>

                                                <p>
                                                    {tip}
                                                </p>

                                            </div>

                                        )
                                    )

                                ) : (

                                    <p className="ai-empty-tip">
                                        Loading personalized tips...
                                    </p>

                                )}

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </div>

    );
}