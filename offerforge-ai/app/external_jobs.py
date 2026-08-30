import httpx


REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


def fetch_remote_jobs(
    search: str | None = None,
    limit: int = 20
):
    params = {
        "limit": limit
    }

    if search:
        params["search"] = search

    response = httpx.get(
        REMOTIVE_API_URL,
        params=params,
        timeout=30.0
    )

    response.raise_for_status()

    data = response.json()

    return data.get("jobs", [])