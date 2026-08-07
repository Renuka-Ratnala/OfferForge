export default function ResumeOverview({
    profile,
    file,
    setFile,
    uploadResume
}) {

    return (

        <div
            style={{
                background:"#16213E",
                borderRadius:"18px",
                padding:"30px",
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                marginBottom:"30px"
            }}
        >

            <div>

                <h2
                    style={{
                        color:"white"
                    }}
                >
                    Current Resume
                </h2>

                 <p
                     style={{
                         color: "#CBD5E1",
                         marginTop: "15px",
                         maxWidth: "250px",
                         overflow: "hidden",
                         textOverflow: "ellipsis",
                         whiteSpace: "nowrap"
                     }}
                 >
                     📄 {profile?.resumeUrl
                         ? profile.resumeUrl.split(/[\\/]/).pop()
                         : "No Resume Uploaded"}
                 </p>

                <p
                    style={{
                        color:
                            profile?.resumeUrl
                            ? "#22C55E"
                            : "#EF4444"
                    }}
                >
                    {
                        profile?.resumeUrl
                        ? "Uploaded Successfully"
                        : "Not Uploaded"
                    }
                </p>

            </div>

            <div>

                 <input
                     id="resumeUpload"
                     type="file"
                     accept=".pdf"
                     style={{ display: "none" }}
                     onChange={(e) => {

                         const selectedFile = e.target.files[0];

                         if (!selectedFile) return;

                         setFile(selectedFile);

                         uploadResume(selectedFile);

                     }}
                 />


                <label
                    htmlFor="resumeUpload"
                     style={{
                         background: "#2563EB",
                         color: "white",
                         padding: "14px 24px",
                         borderRadius: "12px",
                         cursor: "pointer",
                         display: "inline-block",
                         whiteSpace: "nowrap",
                         minWidth: "180px",
                         textAlign: "center"
                     }}
                >
                    📄 Replace Resume
                </label>

            </div>

        </div>

    );

}