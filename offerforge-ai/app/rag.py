from app.database import get_connection
from app.embeddings import create_embedding


# ============================================================
# RETRIEVE RELEVANT EARLY-CAREER JOBS
# ============================================================

def retrieve_jobs(
    query: str,
    limit: int = 10
):

    if not query or not query.strip():
        return []

    # --------------------------------------------------------
    # Create embedding for candidate search query
    # --------------------------------------------------------

    query_embedding = create_embedding(query)

    if not query_embedding:
        return []

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            sql = """
                SELECT
                    j.id,
                    j.job_title,
                    c.company_name,
                    j.location,
                    j.job_type,
                    j.salary,
                    j.description,
                    j.required_skills,
                    j.external_url,
                    1 - (je.embedding <=> %s::vector) AS similarity

                FROM job_embeddings je

                JOIN jobs j
                    ON j.id = je.job_id

                JOIN companies c
                    ON c.id = j.company_id

                WHERE j.external_url IS NOT NULL

                AND (
                    LOWER(j.job_title) LIKE '%%intern%%'
                    OR LOWER(j.job_title) LIKE '%%graduate%%'
                    OR LOWER(j.job_title) LIKE '%%trainee%%'
                    OR LOWER(j.job_title) LIKE '%%entry%%'
                    OR LOWER(j.job_title) LIKE '%%junior%%'
                )

                ORDER BY
                    je.embedding <=> %s::vector

                LIMIT %s
            """

            cursor.execute(
                sql,
                (
                    query_embedding,
                    query_embedding,
                    limit
                )
            )

            rows = cursor.fetchall()

            jobs = []

            for row in rows:

                jobs.append({
                    "job_id": row[0],
                    "job_title": row[1],
                    "company_name": row[2],
                    "location": row[3],
                    "job_type": row[4],
                    "salary": row[5],
                    "description": row[6],
                    "required_skills": row[7],
                    "external_url": row[8],
                    "similarity": float(row[9])
                })

            return jobs

    finally:

        connection.close()