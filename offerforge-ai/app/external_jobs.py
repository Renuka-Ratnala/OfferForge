import httpx


REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


# ============================================================
# FETCH REMOTE JOBS
# ============================================================

def fetch_remote_jobs(
    search: str | None = None,
    limit: int = 100
):

    # Keep the requested limit within a sensible range.
    limit = max(1, min(limit, 100))

    params = {
        "limit": limit
    }

    if search:
        params["search"] = search

    response = httpx.get(
        REMOTIVE_API_URL,
        params=params,
        timeout=30.0
    )

    response.raise_for_status()

    data = response.json()

    jobs = data.get("jobs", [])

    return jobs[:limit]


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