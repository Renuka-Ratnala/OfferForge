from app.job_ingestion import (
    embed_existing_jobs,
    ingest_remote_jobs
)


def initialize_job_data():

    try:

        processed = embed_existing_jobs()

        print(
            f"Existing job embedding completed. "
            f"{processed} jobs processed."
        )

    except Exception as e:

        print(
            "Existing job embedding failed:",
            str(e)
        )

    try:

        processed = ingest_remote_jobs()

        print(
            f"Job ingestion completed. "
            f"{processed} external jobs processed."
        )

    except Exception as e:

        print(
            "Job ingestion failed:",
            str(e)
        )