import { useState } from "react";
import api from "../api/api";

export default function ChatWindow({ onClose }) {

    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim()) return;

        setLoading(true);

        try {

            const response = await api.post("/ai/chat", {
                message
            });

            setReply(response.data.response);

        }  catch (err) {

               console.error("AI chat error:", err);

               setReply(
                   err.response?.data?.message ||
                   err.response?.data ||
                   "Unable to connect to the AI Career Coach."
               );

           }

        setLoading(false);
    };

    return (

        <div
            style={{
                position: "fixed",
                bottom: "90px",
                right: "30px",
                width: "380px",
                background: "#16213E",
                borderRadius: "15px",
                padding: "20px",
                color: "white",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                zIndex: 999
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <h3>🤖 AI Career Coach</h3>

                <button
                    onClick={onClose}
                    style={{
                        background: "transparent",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "20px"
                    }}
                >
                    ✖
                </button>
            </div>

            <textarea
                rows="4"
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                placeholder="Ask anything..."
                style={{
                    width: "100%",
                    marginTop: "15px",
                    borderRadius: "10px",
                    padding: "10px"
                }}
            />

            <button
                onClick={sendMessage}
                style={{
                    width: "100%",
                    marginTop: "15px",
                    padding: "10px",
                    background: "#0F6FFF",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer"
                }}
            >
                {loading ? "Thinking..." : "Send"}
            </button>

            {reply &&

                <div
                    style={{
                        marginTop: "20px",
                        background: "#0B132B",
                        padding: "15px",
                        borderRadius: "10px",
                        whiteSpace: "pre-wrap",
                        maxHeight: "250px",
                        overflowY: "auto"
                    }}
                >
                    {reply}
                </div>

            }

        </div>

    );

}