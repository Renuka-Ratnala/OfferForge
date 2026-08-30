from typing import List, Optional

from pydantic import BaseModel, Field


class JobRecommendation(BaseModel):

    job_id: int

    job_title: str

    company_name: str

    location: Optional[str] = None

    job_type: Optional[str] = None

    salary: Optional[float] = None

    description: Optional[str] = None

    required_skills: Optional[str] = None

    match_score: int = Field(
        ge=0,
        le=100
    )

    matched_skills: List[str] = []

    missing_skills: List[str] = []

    ai_recommendation: str

    interview_chance: str

    reason: Optional[str] = None


class JobRecommendationList(BaseModel):

    recommendations: List[JobRecommendation]