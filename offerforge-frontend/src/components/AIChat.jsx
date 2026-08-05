import { useState } from "react";
import api from "../api/api";

export default function AIChat() {

    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim()) return;

        setLoading(true);

        try {

            const response = await api.post("/ai/chat", {
                message: message
            });

            setReply(response.data.response);

        } catch (err) {

            console.log(err);
            setReply("Something went wrong.");

        }

        setLoading(false);
    };

    return (

        <div
            style={{
                background:"#16213E",
                padding:"20px",
                borderRadius:"15px",
                color:"white",
                marginTop:"30px"
            }}
        >

            <h2>AI Career Coach</h2>

            <textarea
                rows="5"
                placeholder="Ask anything..."
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                style={{
                    width:"100%",
                    marginTop:"15px",
                    padding:"10px",
                    borderRadius:"10px"
                }}
            />

            <button
                onClick={sendMessage}
                style={{
                    marginTop:"15px",
                    padding:"10px 20px",
                    border:"none",
                    borderRadius:"10px",
                    background:"#0F6FFF",
                    color:"white",
                    cursor:"pointer"
                }}
            >
                {loading ? "Thinking..." : "Ask AI"}
            </button>

            {reply && (

                <div
                    style={{
                        marginTop:"20px",
                        background:"#0B132B",
                        padding:"15px",
                        borderRadius:"10px",
                        whiteSpace:"pre-wrap"
                    }}
                >
                    {reply}
                </div>

            )}

        </div>

    );

}