import time

from app.config import GEMINI_API_KEY

from langchain_google_genai import ChatGoogleGenerativeAI


# ============================================================
# GEMINI MODEL
# ============================================================

llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.3
)


# ============================================================
# STRUCTURED GEMINI MODEL
# ============================================================

def get_structured_llm(schema):

    return llm.with_structured_output(
        schema
    )


# ============================================================
# RETRY HELPER
# ============================================================

def invoke_with_retry(
    model,
    prompt,
    retries=3,
    delay=2
):

    last_error = None

    for attempt in range(retries):

        try:

            return model.invoke(
                prompt
            )

        except Exception as e:

            last_error = e

            print(
                f"Gemini request failed "
                f"(attempt {attempt + 1}/{retries}): "
                f"{e}"
            )

            if attempt < retries - 1:

                time.sleep(
                    delay * (attempt + 1)
                )

    raise last_error