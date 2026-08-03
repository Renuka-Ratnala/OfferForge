export default function ChatbotButton() {
    return (
        <button
            style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                background: "#2563EB",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "70px",
                height: "70px",
                fontSize: "28px",
                cursor: "pointer",
                boxShadow: "0 5px 20px rgba(0,0,0,.4)"
            }}
        >
            🤖
        </button>
    );
}