import google.generativeai as genai
from app.core.config import settings
import json
import logging

logger = logging.getLogger("LLMEngine")

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-flash-latest')

async def analyze_case_text(text: str):
    """
    Analyzes case text and returns structured data including:
    - Summary
    - Chronological Facts
    - Potential BNS Sections
    - Extracted Metadata (Location, Date, Persons)
    """
    prompt = f"""
    You are an AI Legal Assistant for the Indian Police Force.
    Analyze the following case description/FIR text:
    
    "{text}"
    
    Return a strictly valid JSON object with the following fields:
    1. "summary": A professional executive summary (max 3 sentences).
    2. "chronological_facts": A list of strings, each representing a key event in order.
    3. "potential_bns_sections": A list of strings (e.g. "BNS 303: Theft").
    4. "metadata": {{
        "incident_date": "YYYY-MM-DD or Unknown",
        "incident_time": "HH:MM or Unknown",
        "location": "extracted location",
        "complainant": "extracted name or Unknown",
        "accused": "extracted names or Unknown"
    }}
    
    Ensure the response is pure JSON without markdown formatting.
    """
    
    try:
        response = model.generate_content(prompt)
        # Cleanup potential markdown ticks if Gemini adds them
        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_text)
        return result
    except Exception as e:
        logger.error(f"LLM Analysis Failed: {e}")
        # Fallback for error handling
        return {
            "summary": "Analysis failed. Please try again.",
            "chronological_facts": [],
            "potential_bns_sections": [],
            "metadata": {}
        }
