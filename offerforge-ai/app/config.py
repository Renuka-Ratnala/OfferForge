import os

from dotenv import load_dotenv

load_dotenv()


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# ============================================================
# VALIDATION
# ============================================================

if not DATABASE_URL:

    raise RuntimeError(
        "DATABASE_URL environment variable is not set."
    )


if not GEMINI_API_KEY:

    raise RuntimeError(
        "GEMINI_API_KEY environment variable is not set."
    )