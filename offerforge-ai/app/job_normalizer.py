import re


# ============================================================
# COMMON TECHNICAL SKILLS
# ============================================================

KNOWN_SKILLS = [
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "Go",
    "Rust",

    "Spring",
    "Spring Boot",
    "Django",
    "Flask",
    "FastAPI",
    "Node.js",
    "Express.js",
    "React",
    "Angular",
    "Vue.js",

    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",

    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "GCP",

    "Git",
    "GitHub",
    "Linux",

    "REST API",
    "GraphQL",

    "Machine Learning",
    "Deep Learning",
    "PyTorch",
    "TensorFlow",
    "LangChain",
    "LangGraph",
    "RAG",
    "Generative AI",
    "LLM",

    "HTML",
    "CSS",
    "Tailwind CSS",

    "Pandas",
    "NumPy",
    "Scikit-learn",
    "XGBoost"
]


# ============================================================
# SALARY NORMALIZATION
# ============================================================

def normalize_salary(value):

    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    value = str(value).strip()

    if not value:
        return None

    try:
        return float(value)

    except ValueError:
        pass

    numbers = re.findall(
        r"\d+(?:\.\d+)?",
        value.replace(",", "")
    )

    if not numbers:
        return None

    try:
        return float(numbers[0])

    except (ValueError, TypeError):
        return None


# ============================================================
# SKILL EXTRACTION
# ============================================================

def extract_skills(
    description: str,
    existing_skills: str = ""
) -> str:

    text = " ".join([
        description or "",
        existing_skills or ""
    ])

    text_lower = text.lower()

    found_skills = []

    for skill in KNOWN_SKILLS:

        skill_lower = skill.lower()

        pattern = (
            r"(?<![a-zA-Z0-9])"
            + re.escape(skill_lower)
            + r"(?![a-zA-Z0-9])"
        )

        if re.search(pattern, text_lower):

            found_skills.append(skill)

    unique_skills = list(
        dict.fromkeys(found_skills)
    )

    return ", ".join(unique_skills)


# ============================================================
# JOB NORMALIZATION
# ============================================================

def normalize_job(job: dict) -> dict:

    # --------------------------------------------------------
    # Description
    # --------------------------------------------------------

    description = (
        job.get("description")
        or ""
    )

    # --------------------------------------------------------
    # Existing skills / tags
    # --------------------------------------------------------

    existing_skills = (
        job.get("requiredSkills")
        or job.get("required_skills")
        or job.get("tags")
        or ""
    )

    # Remotive returns tags as a list.
    # Convert the list into a string before
    # passing it to extract_skills().

    if isinstance(existing_skills, list):

        existing_skills = ", ".join(
            str(skill)
            for skill in existing_skills
        )

    # --------------------------------------------------------
    # Extract skills
    # --------------------------------------------------------

    extracted_skills = extract_skills(
        description,
        existing_skills
    )

    # --------------------------------------------------------
    # Salary
    # --------------------------------------------------------

    salary = normalize_salary(
        job.get("salary")
    )

    # --------------------------------------------------------
    # External ID
    # --------------------------------------------------------

    external_id = (
        job.get("external_id")
        or job.get("externalId")
        or job.get("id")
        or ""
    )

    # --------------------------------------------------------
    # Source
    # --------------------------------------------------------

    source = (
        job.get("source")
        or "remotive"
    )

    # --------------------------------------------------------
    # Job title
    # --------------------------------------------------------

    job_title = (
        job.get("job_title")
        or job.get("jobTitle")
        or job.get("title")
        or "Unknown"
    )

    # --------------------------------------------------------
    # Company
    # --------------------------------------------------------

    company_name = (
        job.get("company_name")
        or job.get("companyName")
        or job.get("company")
        or "Unknown"
    )

    # --------------------------------------------------------
    # Location
    # --------------------------------------------------------

    location = (
        job.get("location")
        or job.get("candidate_required_location")
        or job.get("candidateRequiredLocation")
        or "Remote"
    )

    # --------------------------------------------------------
    # Job type
    # --------------------------------------------------------

    job_type = (
        job.get("job_type")
        or job.get("jobType")
        or "Unknown"
    )

    # --------------------------------------------------------
    # External URL
    # --------------------------------------------------------

    external_url = (
        job.get("external_url")
        or job.get("externalUrl")
        or job.get("url")
        or ""
    )

    # --------------------------------------------------------
    # Final normalized job
    # --------------------------------------------------------

    return {

        "external_id":
            str(external_id),

        "source":
            source,

        "job_title":
            job_title,

        "company_name":
            company_name,

        "location":
            location,

        "job_type":
            job_type,

        "salary":
            salary,

        "description":
            description,

        "required_skills":
            extracted_skills,

        "external_url":
            external_url
    }