export default function ResumeCard({ analysis }) {

    if (!analysis) {

        return (
            <div
                style={{
                    background: "#16213E",
                    padding: "20px",
                    borderRadius: "15px",
                    color: "white"
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div
            style={{
                background: "#16213E",
                borderRadius: "15px",
                padding: "20px",
                color: "white"
            }}
        >
            <h2>Resume Analysis</h2>

            <br />

            <p>
                ATS Score :
                {" "}
                {analysis.matchScore}%
            </p>

            <br />

            <p>
                <b>Matched Skills</b>
            </p>

            <ul>
                {analysis.matchedSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>

            <br />

            <p>
                <b>Missing Skills</b>
            </p>

            <ul>
                {analysis.missingSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>

            <br />

            <p>
                <b>Suggestion</b>
            </p>

            <p>{analysis.suggestions[0]}</p>

        </div>
    );
}