from app.career_profile import CareerProfile


def build_career_query(
    profile: CareerProfile,
    user_message: str = ""
) -> str:

    parts = []

    if profile.branch:
        parts.append(
            f"Academic background: {profile.branch}"
        )

    if profile.college:
        parts.append(
            f"College: {profile.college}"
        )

    if profile.graduation_year:
        parts.append(
            f"Graduation year: {profile.graduation_year}"
        )

    if profile.skills:
        parts.append(
            f"Technical skills: {profile.skills}"
        )

    if profile.location:
        parts.append(
            f"Preferred location: {profile.location}"
        )

    if profile.resume_text:
        parts.append(
            f"Resume information:\n{profile.resume_text}"
        )

    if user_message:
        parts.append(
            f"Career request: {user_message}"
        )

    return "\n".join(parts)