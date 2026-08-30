import re


# Common technical skills we want to recognize
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

    # Remove duplicates while preserving order
    unique_skills = list(
        dict.fromkeys(found_skills)
    )

    return ", ".join(unique_skills)


def normalize_job(job: dict) -> dict:

    description = (
        job.get("description")
        or ""
    )

    existing_skills = (
        job.get("requiredSkills")
        or job.get("required_skills")
        or ""
    )

    extracted_skills = extract_skills(
        description,
        existing_skills
    )

    return {

        "external_id":
            str(
                job.get("external_id")
                or job.get("id")
                or ""
            ),

        "source":
            job.get("source")
            or "external",

        "job_title":
            job.get("job_title")
            or job.get("title")
            or "Unknown",

        "company_name":
            job.get("company_name")
            or job.get("company")
            or "Unknown",

        "location":
            job.get("location")
            or "Remote",

        "job_type":
            job.get("job_type")
            or job.get("jobType")
            or "Unknown",

        "salary":
            job.get("salary"),

        "description":
            description,

        "required_skills":
            extracted_skills,

        "external_url":
            job.get("external_url")
            or job.get("url")
            or ""
    }