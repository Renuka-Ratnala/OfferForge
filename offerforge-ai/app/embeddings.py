from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config import GEMINI_API_KEY


embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=GEMINI_API_KEY,
    output_dimensionality=1536
)


def create_embedding(text: str) -> list[float]:
    return embeddings_model.embed_query(text)