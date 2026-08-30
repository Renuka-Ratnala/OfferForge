from typing import Optional

from pydantic import BaseModel


class CareerProfile(BaseModel):
    full_name: Optional[str] = None
    branch: Optional[str] = None
    college: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[str] = None
    location: Optional[str] = None
    resume_text: Optional[str] = None