export default function JobCard({ jobs }) {

    if (!jobs.length) {

        return (
            <div
                style={{
                    background:"#16213E",
                    borderRadius:"15px",
                    padding:"20px",
                    color:"white"
                }}
            >
                Loading Jobs...
            </div>
        );
    }

    return (

        <div
            style={{
                background:"#16213E",
                borderRadius:"15px",
                padding:"20px",
                color:"white"
            }}
        >

            <h2>Recommended Jobs</h2>

            <br/>

            {jobs.map((job,index)=>(

                <div
                    key={index}
                    style={{
                        marginBottom:"15px",
                        borderBottom:"1px solid gray",
                        paddingBottom:"10px"
                    }}
                >

                    <h3>{job.jobTitle}</h3>

                    <p>{job.companyName}</p>



                    <p>
                        Match Score :

                        {job.matchScore}%
                    </p>

                </div>

            ))}

        </div>

    );

}