import json
import os

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

genai.configure(
    api_key=GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.0-flash"
)


def classify_document(text):

    prompt = f"""
    Analyze this document and return ONLY valid JSON.

    {{
        "document_type": "",
        "topic": "",
        "sensitivity": "",
        "contains_tables": false,
        "contains_images": false,
        "summary": ""
    }}

    Document Content:
    {text[:5000]}
    """

    try:

        response = model.generate_content(
            prompt
        )

        result = response.text.strip()

        result = result.replace(
            "```json",
            ""
        )

        result = result.replace(
            "```",
            ""
        )

        result = result.strip()

        return json.loads(result)

    except Exception as e:

        return {
            "document_type": "Unknown",
            "topic": "Unknown",
            "sensitivity": "Unknown",
            "contains_tables": False,
            "contains_images": False,
            "summary": "Classification unavailable",
            "error": str(e)
        }