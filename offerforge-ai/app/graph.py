from typing import TypedDict

from langgraph.graph import StateGraph, START, END

from app.career_profile import CareerProfile
from app.query_builder import build_career_query
from app.matching import calculate_match_score
from app.recommendation import JobRecommendationList
from app.rag import retrieve_jobs

from app.llm_utils import (
    get_structured_llm,
    invoke_with_retry
)


# ============================================================
# STRUCTURED GEMINI MODEL
# ============================================================

structured_llm = get_structured_llm(
    JobRecommendationList
)


# ============================================================
# LANGGRAPH STATE
# ============================================================

class CareerState(TypedDict):

    message: str

    intent: str

    profile: dict

    search_query: str

    context: str

    jobs: list

    recommendations: list

    response: str


# ============================================================
# NODE 1
# ANALYZE USER QUERY
# ============================================================

def analyze_query(state: CareerState):

    message = state["message"]

    if not message:
        intent = "job_recommendation"
    else:
        intent = "job_recommendation"

    return {
        "intent": intent
    }


# ============================================================
# NODE 2
# BUILD PERSONALIZED SEARCH QUERY
# ============================================================

def build_search_query(state: CareerState):

    profile = CareerProfile(
        **state["profile"]
    )

    query = build_career_query(
        profile=profile,
        user_message=state["message"]
    )

    return {
        "search_query": query
    }


# ============================================================
# NODE 3
# RETRIEVE RELEVANT JOBS USING RAG
# ============================================================

def retrieve_relevant_jobs(state: CareerState):

    query = state["search_query"]

    jobs = retrieve_jobs(
        query=query,
        limit=10
    )

    return {
        "jobs": jobs
    }


# ============================================================
# NODE 4
# BUILD RAG CONTEXT
# ============================================================

def build_rag_context(state: CareerState):

    jobs = state["jobs"]

    if not jobs:

        return {
            "context": ""
        }

    context_parts = []

    for job in jobs:

        job_context = f"""
Job ID: {job["job_id"]}

Job Title: {job["job_title"]}

Company: {job["company_name"]}

Location: {job["location"]}

Job Type: {job["job_type"]}

Salary: {job["salary"]}

Description:
{job["description"]}

Required Skills:
{job["required_skills"]}

External URL:
{job["external_url"]}

Semantic Similarity:
{job["similarity"]}
"""

        context_parts.append(
            job_context
        )

    return {
        "context": "\n".join(
            context_parts
        )
    }


# ============================================================
# SAFE SKILL OVERLAP
# ============================================================

def calculate_skill_overlap_safe(
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

    matched = candidate.intersection(
        required
    )

    return len(matched) / len(required)


# ============================================================
# FALLBACK RECOMMENDATIONS
# ============================================================

def build_fallback_recommendations(
    prepared_jobs
):

    recommendations = []

    for job in prepared_jobs:

        recommendations.append({

            "job_id":
                job["job_id"],

            "job_title":
                job["job_title"],

            "company_name":
                job["company_name"],

            "location":
                job["location"],

            "job_type":
                job["job_type"],

            "salary":
                job["salary"],

            "description":
                job["description"],

            "required_skills":
                job["required_skills"],

            "external_url":
                job["external_url"],

            "match_score":
                job["match_score"],

            "matched_skills":
                [],

            "missing_skills":
                [],

            "ai_recommendation":
                "AI analysis is temporarily unavailable. "
                "This job was retrieved based on your "
                "profile and semantic similarity.",

            "interview_chance":
                "Medium",

            "reason":
                "This job was retrieved as a relevant "
                "match for your profile."
        })

    return recommendations


# ============================================================
# NODE 5
# GENERATE AI RECOMMENDATIONS
# ============================================================

def generate_ai_response(state: CareerState):

    jobs = state["jobs"]

    if not jobs:

        return {

            "recommendations": [],

            "response":
                "No relevant jobs were found for your profile."
        }

    candidate_skills = (
        state["profile"].get("skills")
        or ""
    )

    prepared_jobs = []

    # ========================================================
    # PREPARE TOP 5 JOBS
    # ========================================================

    for job in jobs[:5]:

        similarity = job["similarity"]

        skill_overlap = calculate_skill_overlap_safe(
            candidate_skills,
            job["required_skills"] or ""
        )

        calculated_match_score = calculate_match_score(
            similarity,
            skill_overlap
        )

        prepared_jobs.append({

            "job_id":
                job["job_id"],

            "job_title":
                job["job_title"],

            "company_name":
                job["company_name"],

            "location":
                job["location"],

            "job_type":
                job["job_type"],

            "salary":
                job["salary"],

            "description":
                job["description"],

            "required_skills":
                job["required_skills"],

            "external_url":
                job["external_url"],

            "similarity":
                similarity,

            "skill_overlap":
                skill_overlap,

            "match_score":
                calculated_match_score
        })


    # ========================================================
    # BUILD JOB CONTEXT FOR GEMINI
    # ========================================================

    jobs_text = ""

    for index, job in enumerate(
        prepared_jobs,
        start=1
    ):

        jobs_text += f"""

================ JOB {index} ================

Job ID:
{job["job_id"]}

Job Title:
{job["job_title"]}

Company:
{job["company_name"]}

Location:
{job["location"]}

Job Type:
{job["job_type"]}

Salary:
{job["salary"]}

Description:
{job["description"]}

Required Skills:
{job["required_skills"]}

External URL:
{job["external_url"]}

Semantic Similarity:
{job["similarity"]:.4f}

Skill Overlap:
{job["skill_overlap"]:.2%}

Calculated Match Score:
{job["match_score"]}/100

"""


    # ========================================================
    # ONE GEMINI REQUEST
    # ========================================================

    prompt = f"""
You are the OfferForge AI Career Recommendation Engine.

You are evaluating multiple jobs for ONE candidate.

CANDIDATE PROFILE
=================

{state["search_query"]}


RETRIEVED JOBS
==============

{jobs_text}


YOUR TASK
=========

Evaluate every retrieved job and return one structured
recommendation for each job.


IMPORTANT RULES
===============

1. Return exactly one recommendation for every job provided.

2. Preserve every original job's:

   - job ID
   - job title
   - company name
   - location
   - job type
   - salary
   - description
   - required skills
   - external URL

3. Use the calculated match score provided for each job.

4. DO NOT create or modify the match score.

5. Identify the candidate skills that genuinely match
   each job.

6. Identify important skills that are missing.

7. Explain why each job is relevant to the candidate.

8. Give concise and practical AI career advice.

9. Interview chance must be exactly one of:

   High
   Medium
   Low

10. Do not invent candidate skills.

11. Do not invent job information.

12. Use only the candidate and job information provided.

13. Keep recommendations ordered by relevance.

14. Preserve the exact external URL provided.
    Do not invent, modify, or replace it.
"""


    # ========================================================
    # GEMINI WITH RETRY
    # ========================================================

    try:

        result = invoke_with_retry(

            model=structured_llm,

            prompt=prompt,

            retries=3,

            delay=2
        )

    except Exception as e:

        print(
            "Gemini recommendation failed:",
            e
        )

        fallback = (
            build_fallback_recommendations(
                prepared_jobs
            )
        )

        return {

            "recommendations":
                fallback,

            "response":
                "AI analysis is temporarily unavailable. "
                "Showing jobs based on profile and semantic matching."
        }


    # ========================================================
    # EXTRACT GEMINI RESULTS
    # ========================================================

    recommendations = (
        result.recommendations
    )


    # ========================================================
    # LOOKUP ORIGINAL JOB DATA
    # ========================================================

    job_lookup = {

        job["job_id"]: job

        for job in prepared_jobs
    }


    final_recommendations = []


    # ========================================================
    # RESTORE GROUNDED JOB DATA
    # ========================================================

    for recommendation in recommendations:

        original_job = job_lookup.get(
            recommendation.job_id
        )

        if original_job is None:

            continue

        recommendation.job_id = (
            original_job["job_id"]
        )

        recommendation.job_title = (
            original_job["job_title"]
        )

        recommendation.company_name = (
            original_job["company_name"]
        )

        recommendation.location = (
            original_job["location"]
        )

        recommendation.job_type = (
            original_job["job_type"]
        )

        recommendation.salary = (
            original_job["salary"]
        )

        recommendation.description = (
            original_job["description"]
        )

        recommendation.required_skills = (
            original_job["required_skills"]
        )

        recommendation.external_url = (
            original_job["external_url"]
        )

        recommendation.match_score = (
            original_job["match_score"]
        )

        final_recommendations.append(
            recommendation.model_dump()
        )


    # ========================================================
    # SORT BY MATCH SCORE
    # ========================================================

    final_recommendations.sort(

        key=lambda job:
            job["match_score"],

        reverse=True
    )


    # ========================================================
    # RETURN FINAL RESULT
    # ========================================================

    return {

        "recommendations":
            final_recommendations,

        "response":
            "Job recommendations generated successfully."
    }


# ============================================================
# LANGGRAPH
# ============================================================

builder = StateGraph(
    CareerState
)


# ============================================================
# ADD NODES
# ============================================================

builder.add_node(
    "analyze_query",
    analyze_query
)

builder.add_node(
    "build_search_query",
    build_search_query
)

builder.add_node(
    "retrieve_relevant_jobs",
    retrieve_relevant_jobs
)

builder.add_node(
    "build_rag_context",
    build_rag_context
)

builder.add_node(
    "generate_ai_response",
    generate_ai_response
)


# ============================================================
# ADD EDGES
# ============================================================

builder.add_edge(
    START,
    "analyze_query"
)

builder.add_edge(
    "analyze_query",
    "build_search_query"
)

builder.add_edge(
    "build_search_query",
    "retrieve_relevant_jobs"
)

builder.add_edge(
    "retrieve_relevant_jobs",
    "build_rag_context"
)

builder.add_edge(
    "build_rag_context",
    "generate_ai_response"
)

builder.add_edge(
    "generate_ai_response",
    END
)


# ============================================================
# COMPILE GRAPH
# ============================================================

career_graph = builder.compile()