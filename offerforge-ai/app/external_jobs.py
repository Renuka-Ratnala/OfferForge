import httpx


REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


# ============================================================
# FETCH REMOTE JOBS
# ============================================================

def fetch_remote_jobs(
    search: str | None = None,
    limit: int = 100
):

    limit = max(1, min(limit, 100))

    # --------------------------------------------------------
    # If a specific search is provided, perform one search.
    # --------------------------------------------------------

    if search:

        params = {
            "search": search,
            "limit": limit
        }

        response = httpx.get(
            REMOTIVE_API_URL,
            params=params,
            timeout=30.0
        )

        response.raise_for_status()

        data = response.json()

        jobs = data.get("jobs", [])

        return jobs[:limit]

    # --------------------------------------------------------
    # No specific search:
    #
    # Build a larger technology-focused job pool by searching
    # several relevant terms.
    # --------------------------------------------------------

    search_terms = [
        "Java",
        "Python",
        "Backend Developer",
        "Software Engineer",
        "Full Stack Developer",
        "Frontend Developer",
        "Intern",
        "Junior Developer"
    ]

    all_jobs = []

    seen_jobs = set()

    for search_term in search_terms:

        try:

            params = {
                "search": search_term,
                "limit": 20
            }

            response = httpx.get(
                REMOTIVE_API_URL,
                params=params,
                timeout=30.0
            )

            response.raise_for_status()

            data = response.json()

            jobs = data.get("jobs", [])

            print(
                f"Remotive search '{search_term}' "
                f"returned {len(jobs)} jobs."
            )

            for job in jobs:

                # ------------------------------------------------
                # Prefer Remotive job ID for deduplication.
                # ------------------------------------------------

                job_id = job.get("id")

                if job_id is not None:

                    unique_key = f"id:{job_id}"

                else:

                    unique_key = (
                        f"{job.get('title', '')}|"
                        f"{job.get('company_name', '')}|"
                        f"{job.get('url', '')}"
                    )

                if unique_key in seen_jobs:
                    continue

                seen_jobs.add(unique_key)

                all_jobs.append(job)

                if len(all_jobs) >= limit:
                    break

            if len(all_jobs) >= limit:
                break

        except Exception as e:

            print(
                f"Remotive search failed for "
                f"'{search_term}': {str(e)}"
            )

            continue

    print(
        f"Combined Remotive job pool: "
        f"{len(all_jobs)} unique jobs."
    )

    return all_jobs[:limit]


# ============================================================
# FETCH JOBS FOR USER PROFILE
# ============================================================

def fetch_jobs_for_profile(
    skills: str | None = None,
    branch: str | None = None,
    limit: int = 100
):

    search_terms = []

    if skills:

        skill_list = [
            skill.strip()
            for skill in skills.split(",")
            if skill.strip()
        ]

        search_terms.extend(
            skill_list[:5]
        )

    if branch:

        search_terms.append(
            branch
        )

    search_query = " ".join(
        search_terms
    ).strip()

    return fetch_remote_jobs(
        search=search_query or None,
        limit=limit
    )