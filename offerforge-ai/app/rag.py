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


                -- =================================================
                -- EXCLUDE SENIOR / LEADERSHIP POSITIONS
                -- =================================================

                AND NOT (
                    LOWER(j.job_title) LIKE '%%senior%%'
                    OR LOWER(j.job_title) LIKE '%%lead%%'
                    OR LOWER(j.job_title) LIKE '%%principal%%'
                    OR LOWER(j.job_title) LIKE '%%staff%%'
                    OR LOWER(j.job_title) LIKE '%%architect%%'
                    OR LOWER(j.job_title) LIKE '%%director%%'
                    OR LOWER(j.job_title) LIKE '%%vice president%%'
                    OR LOWER(j.job_title) LIKE '%%head of%%'
                    OR LOWER(j.job_title) LIKE '%%manager%%'
                )


                -- =================================================
                -- EXCLUDE TIERED IT SUPPORT / SERVICE DESK ROLES
                -- =================================================

                AND NOT (
                    LOWER(j.job_title) LIKE '%%service desk%%'
                    OR LOWER(j.job_title) LIKE '%%helpdesk%%'
                    OR LOWER(j.job_title) LIKE '%%help desk%%'
                    OR LOWER(j.job_title) LIKE '%%tier i%%'
                    OR LOWER(j.job_title) LIKE '%%tier ii%%'
                    OR LOWER(j.job_title) LIKE '%%tier iii%%'
                    OR LOWER(j.job_title) LIKE '%%tier 1%%'
                    OR LOWER(j.job_title) LIKE '%%tier 2%%'
                    OR LOWER(j.job_title) LIKE '%%tier 3%%'
                )


                -- =================================================
                -- EXCLUDE OBVIOUSLY EXPERIENCE-HEAVY ROLES
                -- =================================================

                AND NOT (
                    LOWER(COALESCE(j.description, '')) LIKE '%%6+ years%%'
                    OR LOWER(COALESCE(j.description, '')) LIKE '%%5+ years%%'
                    OR LOWER(COALESCE(j.description, '')) LIKE '%%4+ years%%'
                    OR LOWER(COALESCE(j.description, '')) LIKE '%%3+ years%%'

                    OR LOWER(COALESCE(j.description, '')) LIKE '%%6 years of experience%%'
                    OR LOWER(COALESCE(j.description, '')) LIKE '%%5 years of experience%%'
                    OR LOWER(COALESCE(j.description, '')) LIKE '%%4 years of experience%%'
                    OR LOWER(COALESCE(j.description, '')) LIKE '%%3 years of experience%%'
                )


                -- =================================================
                -- KEEP SOFTWARE / TECHNOLOGY-RELATED POSITIONS
                -- =================================================

                AND (
                    LOWER(j.job_title) LIKE '%%software%%'
                    OR LOWER(j.job_title) LIKE '%%developer%%'
                    OR LOWER(j.job_title) LIKE '%%engineer%%'
                    OR LOWER(j.job_title) LIKE '%%programmer%%'
                    OR LOWER(j.job_title) LIKE '%%backend%%'
                    OR LOWER(j.job_title) LIKE '%%frontend%%'
                    OR LOWER(j.job_title) LIKE '%%full stack%%'
                    OR LOWER(j.job_title) LIKE '%%full-stack%%'
                    OR LOWER(j.job_title) LIKE '%%java%%'
                    OR LOWER(j.job_title) LIKE '%%python%%'
                    OR LOWER(j.job_title) LIKE '%%data%%'
                    OR LOWER(j.job_title) LIKE '%%cloud%%'
                    OR LOWER(j.job_title) LIKE '%%machine learning%%'
                    OR LOWER(j.job_title) LIKE '%%devops%%'
                    OR LOWER(j.job_title) LIKE '%%qa%%'
                    OR LOWER(j.job_title) LIKE '%%technology%%'
                    OR LOWER(j.job_title) LIKE '%%technical%%'
                )


                -- =================================================
                -- RANK BY SEMANTIC SIMILARITY
                -- =================================================

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