export default function ResumeOverview({
    profile,
    file,
    setFile,
    uploadResume
}) {

    const resumeName = profile?.resumeUrl
        ? profile.resumeUrl.split(/[\\/]/).pop()
        : "No Resume Uploaded";

    return (

        <div className="resume-overview">

            <div className="resume-overview-content">

                <div className="resume-icon">
                    📄
                </div>

                <div>

                    <h2>Current Resume</h2>

                    <p className="resume-file-name">
                        {resumeName}
                    </p>

                    <p
                        className={
                            profile?.resumeUrl
                                ? "resume-status uploaded"
                                : "resume-status not-uploaded"
                        }
                    >
                        {profile?.resumeUrl
                            ? "✓ Uploaded Successfully"
                            : "✕ No Resume Uploaded"}
                    </p>

                </div>

            </div>


            <div>

                <input
                    id="resumeUpload"
                    type="file"
                    accept=".pdf"
                    className="resume-file-input"
                    onChange={(e) => {

                        const selectedFile = e.target.files[0];

                        if (!selectedFile) return;

                        setFile(selectedFile);

                        uploadResume(selectedFile);

                    }}
                />

                <label
                    htmlFor="resumeUpload"
                    className="replace-resume-button"
                >
                    📄 Replace Resume
                </label>

            </div>

        </div>

    );
}