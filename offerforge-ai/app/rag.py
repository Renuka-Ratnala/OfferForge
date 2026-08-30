from app.database import get_connection
from app.embeddings import create_embedding


# ============================================================
# RETRIEVE RELEVANT JOBS
# ============================================================

def retrieve_jobs(
    query: str,
    limit: int = 10
):

    if not query or not query.strip():

        return []

    # --------------------------------------------------------
    # Create embedding for the candidate's search query
    # --------------------------------------------------------

    query_embedding = create_embedding(
        query
    )

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    j.id,
                    j.job_title,
                    c.company_name,
                    j.location,
                    j.job_type,
                    j.salary,
                    j.description,
                    j.required_skills,

                    1 - (
                        je.embedding <=> %s::vector
                    ) AS similarity

                FROM job_embeddings je

                JOIN jobs j
                    ON j.id = je.job_id

                JOIN companies c
                    ON c.id = j.company_id

                ORDER BY
                    je.embedding <=> %s::vector

                LIMIT %s
                """,
                (
                    query_embedding,
                    query_embedding,
                    limit
                )
            )

            jobs = cursor.fetchall()

            return jobs

    finally:

        connection.close()