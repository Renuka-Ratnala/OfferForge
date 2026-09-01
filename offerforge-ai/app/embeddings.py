import time

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from google.api_core.exceptions import ResourceExhausted

from app.config import GEMINI_API_KEY


# ============================================================
# GEMINI EMBEDDING MODEL
# ============================================================

embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=GEMINI_API_KEY,
    output_dimensionality=1536
)


# ============================================================
# CREATE EMBEDDING
# ============================================================

def create_embedding(
    text: str,
    max_retries: int = 3
) -> list[float]:

    if not text or not text.strip():
        return []

    for attempt in range(max_retries):

        try:

            return embeddings_model.embed_query(text)

        except ResourceExhausted as error:

            if attempt == max_retries - 1:
                raise error

            wait_time = 2 ** attempt

            print(
                f"Gemini embedding quota exceeded. "
                f"Retrying in {wait_time} seconds..."
            )

            time.sleep(wait_time)

    return []