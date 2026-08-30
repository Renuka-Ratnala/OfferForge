from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager

from app.startup import initialize_job_data

from app.graph import career_graph
from app.job_ingestion import (
    embed_existing_jobs,
    ingest_remote_jobs
)

@asynccontextmanager
async def lifespan(app: FastAPI):

    initialize_job_data()

    yield

app = FastAPI(
    title="OfferForge AI Service",
    description="AI and RAG service for OfferForge",
    version="1.0.0",
    lifespan=lifespan
)


# ============================================================
# REQUEST MODELS
# ============================================================

class CareerRequest(BaseModel):

    message: str

    full_name: Optional[str] = None
    branch: Optional[str] = None
    college: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[str] = None
    location: Optional[str] = None
    resume_text: Optional[str] = None


# ============================================================
# BASIC SERVICE ENDPOINTS
# ============================================================

@app.get("/")
def root():

    return {
        "service": "OfferForge AI Service",
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# AI CAREER CHAT
# ============================================================

@app.post("/ai/chat")
def chat(request: CareerRequest):

    result = career_graph.invoke({

        "message": request.message,

        "intent": "",

        "profile": {

            "full_name": request.full_name,

            "branch": request.branch,

            "college": request.college,

            "graduation_year": request.graduation_year,

            "skills": request.skills,

            "location": request.location,

            "resume_text": request.resume_text
        },

        "search_query": "",

        "context": "",

        "jobs": [],

        "recommendations": [],

        "response": ""
    })

    return {
    "response": result["response"],
    "recommendations": result["recommendations"]
    }


# ============================================================
# INDEX EXISTING DATABASE JOBS
# ============================================================

@app.post("/ai/jobs/index")
def index_jobs():

    processed = embed_existing_jobs()

    return {
        "status": "success",
        "jobs_indexed": processed
    }


# ============================================================
# INGEST EXTERNAL JOBS
# ============================================================

@app.post("/ai/jobs/ingest")
def ingest_jobs():

    processed = ingest_remote_jobs()

    return {
        "status": "success",
        "jobs_processed": processed
    }