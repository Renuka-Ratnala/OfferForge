export default function StatCard({
    icon,
    title,
    value,
    color
}) {

    return (

        <div
            style={{
                background: "#16213E",
                borderRadius: "18px",
                padding: "25px",
                boxShadow: "0 10px 20px rgba(0,0,0,.25)"
            }}
        >

            <div
                style={{
                    fontSize: "26px",
                    marginBottom: "12px"
                }}
            >
                {icon}
            </div>

            <p
                style={{
                    color: "#94A3B8",
                    margin: 0,
                    fontSize: "15px"
                }}
            >
                {title}
            </p>

            <h2
                style={{
                    color,
                    marginTop: "10px",
                    marginBottom: 0,
                    fontSize: "28px"
                }}
            >
                {value}
            </h2>

        </div>

    );

}