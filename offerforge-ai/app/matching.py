def calculate_skill_overlap(
    candidate_skills: str,
    required_skills: str
) -> float:

    if not candidate_skills or not required_skills:
        return 0.0

    candidate = {
        skill.strip().lower()
        for skill in candidate_skills.split(",")
        if skill.strip()
    }

    required = {
        skill.strip().lower()
        for skill in required_skills.split(",")
        if skill.strip()
    }

    if not required:
        return 0.0

    matched = candidate.intersection(required)

    return len(matched) / len(required)


def calculate_match_score(
    similarity: float,
    skill_overlap: float
) -> int:

    similarity_score = max(
        0.0,
        min(similarity, 1.0)
    )

    skill_score = max(
        0.0,
        min(skill_overlap, 1.0)
    )

    score = (
        similarity_score * 70
        +
        skill_score * 30
    )

    return round(score)