from app.database import get_connection
from app.embeddings import create_embedding
from app.external_jobs import fetch_remote_jobs
from app.job_normalizer import normalize_job


# ============================================================
# CREATE JOB TEXT FOR EMBEDDINGS
# ============================================================

def create_job_text(
    job_title,
    company_name,
    location,
    job_type,
    salary,
    description,
    required_skills,
    source=None,
    url=None
):

    return f"""
Job Title: {job_title}

Company: {company_name}

Location: {location}

Job Type: {job_type}

Salary: {salary}

Description:
{description or ""}

Required Skills:
{required_skills or ""}

Source:
{source or ""}

Job URL:
{url or ""}
""".strip()


# ============================================================
# INDEX EXISTING DATABASE JOBS
# ============================================================

def embed_existing_jobs():

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
                    j.required_skills
                FROM jobs j
                JOIN companies c
                    ON c.id = j.company_id
                """
            )

            jobs = cursor.fetchall()

            processed = 0

            for job in jobs:

                (
                    job_id,
                    job_title,
                    company_name,
                    location,
                    job_type,
                    salary,
                    description,
                    required_skills
                ) = job

                # --------------------------------------------
                # Normalize existing job
                # --------------------------------------------

                normalized = normalize_job({

                    "job_title": job_title,

                    "company_name": company_name,

                    "location": location,

                    "job_type": job_type,

                    "salary": salary,

                    "description": description,

                    "required_skills": required_skills
                })

                cleaned_skills = normalized[
                    "required_skills"
                ]

                # --------------------------------------------
                # Update skills in database if necessary
                # --------------------------------------------

                if cleaned_skills:

                    cursor.execute(
                        """
                        UPDATE jobs
                        SET required_skills = %s
                        WHERE id = %s
                        """,
                        (
                            cleaned_skills,
                            job_id
                        )
                    )

                # --------------------------------------------
                # Build embedding text
                # --------------------------------------------

                job_text = create_job_text(

                    job_title=job_title,

                    company_name=company_name,

                    location=location,

                    job_type=job_type,

                    salary=salary,

                    description=description,

                    required_skills=cleaned_skills
                )

                # --------------------------------------------
                # Generate embedding
                # --------------------------------------------

                embedding = create_embedding(
                    job_text
                )

                # --------------------------------------------
                # Store embedding
                # --------------------------------------------

                cursor.execute(
                    """
                    INSERT INTO job_embeddings
                    (
                        job_id,
                        job_text,
                        embedding
                    )
                    VALUES
                    (
                        %s,
                        %s,
                        %s::vector
                    )

                    ON CONFLICT (job_id)
                    DO UPDATE SET
                        job_text =
                            EXCLUDED.job_text,

                        embedding =
                            EXCLUDED.embedding
                    """,
                    (
                        job_id,
                        job_text,
                        embedding
                    )
                )

                processed += 1

        connection.commit()

        return processed

    finally:

        connection.close()


# ============================================================
# INGEST EXTERNAL JOBS
# ============================================================

def ingest_remote_jobs():

    remote_jobs = fetch_remote_jobs(
        limit=20
    )

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            processed = 0

            for raw_job in remote_jobs:

                # --------------------------------------------
                # Normalize external job
                # --------------------------------------------

                normalized = normalize_job(
                    raw_job
                )

                external_id = normalized[
                    "external_id"
                ]

                source = normalized[
                    "source"
                ]

                # --------------------------------------------
                # Check if job already exists
                # --------------------------------------------

                cursor.execute(
                    """
                    SELECT id
                    FROM jobs
                    WHERE external_id = %s
                    AND source = %s
                    """,
                    (
                        external_id,
                        source
                    )
                )

                existing_job = cursor.fetchone()

                # ============================================
                # UPDATE EXISTING JOB
                # ============================================

                if existing_job:

                    job_id = existing_job[0]

                    cursor.execute(
                        """
                        UPDATE jobs
                        SET
                            job_title = %s,
                            location = %s,
                            job_type = %s,
                            description = %s,
                            required_skills = %s,
                            external_url = %s
                        WHERE id = %s
                        """,
                        (
                            normalized["job_title"],

                            normalized["location"],

                            normalized["job_type"],

                            normalized["description"],

                            normalized["required_skills"],

                            normalized["external_url"],

                            job_id
                        )
                    )

                # ============================================
                # CREATE NEW JOB
                # ============================================

                else:

                    # ----------------------------------------
                    # Find company
                    # ----------------------------------------

                    cursor.execute(
                        """
                        SELECT id
                        FROM companies
                        WHERE company_name = %s
                        """,
                        (
                            normalized["company_name"],
                        )
                    )

                    company = cursor.fetchone()

                    if company:

                        company_id = company[0]

                    else:

                        cursor.execute(
                            """
                            INSERT INTO companies
                            (
                                company_name
                            )
                            VALUES (%s)
                            RETURNING id
                            """,
                            (
                                normalized[
                                    "company_name"
                                ],
                            )
                        )

                        company_id = (
                            cursor.fetchone()[0]
                        )

                    # ----------------------------------------
                    # Insert job
                    # ----------------------------------------

                    cursor.execute(
                        """
                        INSERT INTO jobs
                        (
                            job_title,
                            location,
                            job_type,
                            salary,
                            description,
                            required_skills,
                            external_id,
                            source,
                            external_url,
                            company_id
                        )
                        VALUES
                        (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s
                        )
                        RETURNING id
                        """,
                        (
                            normalized["job_title"],

                            normalized["location"],

                            normalized["job_type"],

                            normalized["salary"],

                            normalized["description"],

                            normalized["required_skills"],

                            normalized["external_id"],

                            normalized["source"],

                            normalized["external_url"],

                            company_id
                        )
                    )

                    job_id = (
                        cursor.fetchone()[0]
                    )

                # --------------------------------------------
                # Build embedding text
                # --------------------------------------------

                job_text = create_job_text(

                    job_title=
                        normalized["job_title"],

                    company_name=
                        normalized["company_name"],

                    location=
                        normalized["location"],

                    job_type=
                        normalized["job_type"],

                    salary=
                        normalized["salary"],

                    description=
                        normalized["description"],

                    required_skills=
                        normalized["required_skills"],

                    source=
                        normalized["source"],

                    url=
                        normalized["external_url"]
                )

                # --------------------------------------------
                # Create embedding
                # --------------------------------------------

                embedding = create_embedding(
                    job_text
                )

                # --------------------------------------------
                # Store/update embedding
                # --------------------------------------------

                cursor.execute(
                    """
                    INSERT INTO job_embeddings
                    (
                        job_id,
                        job_text,
                        embedding
                    )
                    VALUES
                    (
                        %s,
                        %s,
                        %s::vector
                    )

                    ON CONFLICT (job_id)
                    DO UPDATE SET
                        job_text =
                            EXCLUDED.job_text,

                        embedding =
                            EXCLUDED.embedding
                    """,
                    (
                        job_id,

                        job_text,

                        embedding
                    )
                )

                processed += 1

        connection.commit()

        return processed

    finally:

        connection.close()