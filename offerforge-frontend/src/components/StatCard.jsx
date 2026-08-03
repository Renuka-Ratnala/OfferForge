export default function StatCard({ title, value }) {
    return (
        <div
            style={{
                background: "#16213E",
                borderRadius: "15px",
                padding: "20px",
                color: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}
        >
            <h3>{title}</h3>

            <h1
                style={{
                    fontSize: "32px",
                    color: "#4DA8FF",
                    marginTop: "10px"
                }}
            >
                {value}
            </h1>
        </div>
    );
}