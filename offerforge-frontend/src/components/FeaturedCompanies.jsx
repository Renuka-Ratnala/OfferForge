const companies = [
    { name: "Google", logo: "🟡", jobs: 24 },
    { name: "Microsoft", logo: "🟦", jobs: 18 },
    { name: "Amazon", logo: "🟠", jobs: 15 },
    { name: "Adobe", logo: "🔴", jobs: 12 },
    { name: "Oracle", logo: "🔵", jobs: 10 }
];

export default function FeaturedCompanies() {

    return (

        <div
            style={{
                marginTop: "35px"
            }}
        >

            <h2
                style={{
                    color: "white",
                    marginBottom: "20px"
                }}
            >
                🔥 Featured Companies
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5,1fr)",
                    gap: "20px"
                }}
            >

                {companies.map((company) => (

                    <div
                        key={company.name}
                        style={{
                            background: "#16213E",
                            borderRadius: "18px",
                            padding: "25px",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "0.3s"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "40px"
                            }}
                        >
                            {company.logo}
                        </div>

                        <h3
                            style={{
                                color: "white",
                                marginTop: "15px"
                            }}
                        >
                            {company.name}
                        </h3>

                        <p
                            style={{
                                color: "#94A3B8"
                            }}
                        >
                            {company.jobs} Open Jobs
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}