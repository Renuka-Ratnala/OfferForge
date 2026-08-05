import { useNavigate } from "react-router-dom";

export default function QuickActionCard({
    title,
    description,
    icon,
    path
}) {

    const navigate = useNavigate();

    return (

        <div
            onClick={() => navigate(path)}
            style={{
                background: "#16213E",
                borderRadius: "15px",
                padding: "25px",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >

            <div
                style={{
                    fontSize: "45px"
                }}
            >
                {icon}
            </div>

            <h2
                style={{
                    color: "white",
                    marginTop: "15px"
                }}
            >
                {title}
            </h2>

            <p
                style={{
                    color: "#94A3B8",
                    marginTop: "10px"
                }}
            >
                {description}
            </p>

        </div>

    );

}