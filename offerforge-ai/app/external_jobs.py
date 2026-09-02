import httpx


# ============================================================
# API URLS
# ============================================================

HIMALAYAS_API_URL = "https://himalayas.app/jobs/api"
REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


# ============================================================
# FILTER CONFIGURATION
# ============================================================

TECH_TITLE_KEYWORDS = [
    "software",
    "developer",
    "engineer",
    "programmer",
    "backend",
    "back-end",
    "frontend",
    "front-end",
    "full stack",
    "full-stack",
    "java",
    "python",
    "javascript",
    "typescript",
    "react",
    "node",
    "data",
    "machine learning",
    "artificial intelligence",
    "ai",
    "ml",
    "cloud",
    "devops",
    "qa",
    "test engineer",
    "web developer",
]

ENTRY_LEVEL_KEYWORDS = [
    "intern",
    "internship",
    "junior",
    "entry level",
    "entry-level",
    "graduate",
    "new grad",
    "fresher",
    "trainee",
    "associate",
]

EXCLUDED_TITLE_KEYWORDS = [
    "senior",
    "sr.",
    "sr ",
    "lead",
    "principal",
    "staff",
    "manager",
    "director",
    "vice president",
    "vp ",
    "head of",
    "architect",
    "chief",
]

EXCLUDED_SENIORITY = {
    "senior",
    "manager",
    "director",
    "lead",
    "principal",
    "staff",
    "executive",
}

EXPERIENCE_PATTERNS = [
    "3+ years",
    "4+ years",
    "5+ years",
    "6+ years",
    "7+ years",
    "8+ years",
    "9+ years",
    "10+ years",
    "3 or more years",
    "4 or more years",
    "5 or more years",
    "6 or more years",
    "three years",
    "four years",
    "five years",
    "six years",
    "seven years",
    "eight years",
]


# ============================================================
# TEXT HELPERS
# ============================================================

def clean_text(value) -> str:
    """
    Safely convert API values into searchable text.
    """

    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(
            str(item)
            for item in value
        )

    return str(value)


def contains_any(
    text: str,
    keywords: list[str]
) -> bool:

    text_lower = text.lower()

    return any(
        keyword.lower() in text_lower
        for keyword in keywords
    )


# ============================================================
# JOB FILTERING
# ============================================================

def is_suitable_job(job: dict) -> bool:
    """
    Keep jobs that are reasonably suitable for
    early-career technical candidates.

    This is intentionally conservative because
    unsuitable jobs should never reach the AI
    recommendation layer.
    """

    title = clean_text(
        job.get("title")
        or job.get("job_title")
        or job.get("jobTitle")
    )

    description = clean_text(
        job.get("description")
    )

    excerpt = clean_text(
        job.get("excerpt")
    )

    combined_text = " ".join([
        title,
        description,
        excerpt
    ])

    title_lower = title.lower()

    # --------------------------------------------------------
    # Reject obvious senior/management titles.
    # --------------------------------------------------------

    if contains_any(
        title_lower,
        EXCLUDED_TITLE_KEYWORDS
    ):
        return False

    # --------------------------------------------------------
    # Check Himalayas seniority information.
    # --------------------------------------------------------

    seniority = job.get("seniority", [])

    if isinstance(seniority, str):
        seniority_values = [
            seniority.lower()
        ]

    elif isinstance(seniority, list):
        seniority_values = [
            str(value).lower()
            for value in seniority
        ]

    else:
        seniority_values = []

    for level in seniority_values:

        if level in EXCLUDED_SENIORITY:
            return False

    # --------------------------------------------------------
    # Reject explicit experience requirements.
    # --------------------------------------------------------

    combined_lower = combined_text.lower()

    if contains_any(
        combined_lower,
        EXPERIENCE_PATTERNS
    ):
        return False

    # --------------------------------------------------------
    # Require technical relevance.
    # --------------------------------------------------------

    if not contains_any(
        title_lower,
        TECH_TITLE_KEYWORDS
    ):
        return False

    return True


# ============================================================
# HIMALAYAS NORMALIZATION
# ============================================================

def normalize_himalayas_job(
    job: dict
) -> dict:

    title = (
        job.get("title")
        or "Unknown"
    )

    company_name = (
        job.get("companyName")
        or "Unknown"
    )

    description = (
        job.get("description")
        or job.get("excerpt")
        or ""
    )

    employment_type = (
        job.get("employmentType")
        or "Unknown"
    )

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    locations = job.get(
        "locationRestrictions"
    )

    if isinstance(locations, list):

        location = ", ".join(
            str(location)
            for location in locations
            if location
        )

    else:

        location = clean_text(
            locations
        )

    if not location:
        location = "Remote"

    # --------------------------------------------------------
    # Salary
    #
    # We intentionally leave salary empty here.
    #
    # Himalayas can provide different currencies
    # and salary periods. The current frontend
    # should not display those values as INR.
    # --------------------------------------------------------

    salary = None

    # --------------------------------------------------------
    # External link
    # --------------------------------------------------------

    external_url = (
        job.get("applicationLink")
        or job.get("guid")
        or ""
    )

    # --------------------------------------------------------
    # Stable external ID
    # --------------------------------------------------------

    external_id = (
        job.get("guid")
        or external_url
        or (
            f"{company_name}|"
            f"{title}"
        )
    )

    # --------------------------------------------------------
    # Required skills
    #
    # job_normalizer.py will extract the actual
    # known technical skills from description.
    # --------------------------------------------------------

    required_skills = ""

    return {
        "external_id": str(external_id),
        "source": "himalayas",
        "job_title": title,
        "company_name": company_name,
        "location": location,
        "job_type": employment_type,
        "salary": salary,
        "description": description,
        "required_skills": required_skills,
        "external_url": external_url,
    }


# ============================================================
# FETCH HIMALAYAS JOBS
# ============================================================

def fetch_himalayas_jobs(
    limit: int = 50
):

    limit = max(
        1,
        min(limit, 100)
    )

    all_jobs = []

    seen_jobs = set()

    cursor = None

    # --------------------------------------------------------
    # Fetch several pages.
    #
    # Himalayas currently returns up to 20 jobs
    # per request.
    # --------------------------------------------------------

    max_pages = 5

    for page_number in range(
        max_pages
    ):

        params = {
            "limit": 20
        }

        if cursor:
            params["cursor"] = cursor

        try:

            response = httpx.get(
                HIMALAYAS_API_URL,
                params=params,
                timeout=30.0
            )

            response.raise_for_status()

            data = response.json()

        except Exception as e:

            print(
                "Himalayas request failed: "
                f"{str(e)}"
            )

            break

        jobs = data.get(
            "jobs",
            []
        )

        print(
            f"Himalayas page "
            f"{page_number + 1}: "
            f"{len(jobs)} jobs received."
        )

        for job in jobs:

            # ------------------------------------------------
            # Filter before adding the job.
            # ------------------------------------------------

            if not is_suitable_job(job):
                continue

            # ------------------------------------------------
            # Deduplication.
            # ------------------------------------------------

            unique_key = (
                job.get("guid")
                or job.get("applicationLink")
                or (
                    f"{job.get('companyName', '')}|"
                    f"{job.get('title', '')}"
                )
            )

            if unique_key in seen_jobs:
                continue

            seen_jobs.add(
                unique_key
            )

            normalized_job = (
                normalize_himalayas_job(
                    job
                )
            )

            all_jobs.append(
                normalized_job
            )

            if len(all_jobs) >= limit:
                break

        if len(all_jobs) >= limit:
            break

        # ----------------------------------------------------
        # Cursor pagination.
        # ----------------------------------------------------

        cursor = data.get(
            "nextCursor"
        )

        if not cursor:
            break

    print(
        "Filtered Himalayas job pool: "
        f"{len(all_jobs)} suitable jobs."
    )

    return all_jobs[:limit]


# ============================================================
# REMOTIVE FALLBACK
# ============================================================

def fetch_remotive_jobs(
    limit: int = 20
):

    limit = max(
        1,
        min(limit, 100)
    )

    try:

        response = httpx.get(
            REMOTIVE_API_URL,
            params={
                "limit": limit
            },
            timeout=30.0
        )

        response.raise_for_status()

        data = response.json()

        jobs = data.get(
            "jobs",
            []
        )

        print(
            f"Remotive returned "
            f"{len(jobs)} jobs."
        )

        return jobs[:limit]

    except Exception as e:

        print(
            "Remotive request failed: "
            f"{str(e)}"
        )

        return []


# ============================================================
# MAIN FETCH FUNCTION
# ============================================================

def fetch_remote_jobs(
    search: str | None = None,
    limit: int = 50
):
    """
    Main job-fetching function used by the
    existing ingestion pipeline.

    Himalayas is the primary source.
    Remotive is retained as a fallback.
    """

    limit = max(
        1,
        min(limit, 100)
    )

    # --------------------------------------------------------
    # Himalayas
    # --------------------------------------------------------

    himalayas_jobs = (
        fetch_himalayas_jobs(
            limit=limit
        )
    )

    # --------------------------------------------------------
    # If Himalayas gives us enough jobs,
    # return them directly.
    # --------------------------------------------------------

    if himalayas_jobs:

        print(
            "Using Himalayas as primary "
            f"source: {len(himalayas_jobs)} jobs."
        )

        return himalayas_jobs[:limit]

    # --------------------------------------------------------
    # Fallback to Remotive.
    # --------------------------------------------------------

    print(
        "Himalayas returned no suitable jobs. "
        "Using Remotive fallback."
    )

    return fetch_remotive_jobs(
        limit=min(limit, 20)
    )


# ============================================================
# FETCH JOBS FOR USER PROFILE
# ============================================================

def fetch_jobs_for_profile(
    skills: str | None = None,
    branch: str | None = None,
    limit: int = 50
):
    """
    Fetch technical jobs suitable for an
    early-career candidate.

    The existing function signature is preserved
    so the rest of the application does not need
    to change.
    """

    return fetch_remote_jobs(
        search=None,
        limit=limit
    )