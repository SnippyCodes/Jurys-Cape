import os
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from PIL import Image
import mimetypes
from app.core.config import settings
from app.services.rag_pipeline import search_legal_precedents
import logging

logger = logging.getLogger("GeminiService")

class GeminiService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY is not set. Gemini services will fail.")
        else:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(
                model_name="gemini-flash-latest",
                tools=[search_legal_precedents]
            )
            self.vision_model = genai.GenerativeModel(model_name="gemini-flash-latest")

    async def analyze_media(self, file_path: str, prompt: str, mime_type: str = None):
        """
        Analyzes Video, Image, or PDF.
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

            # Upload file to Gemini
            logger.info(f"Uploading file {file_path} to Gemini...")
            if not mime_type:
                 mime_type, _ = mimetypes.guess_type(file_path)
            
            uploaded_file = genai.upload_file(path=file_path, mime_type=mime_type)
            
            # Wait for processing if it's a video
            if "video" in (mime_type or ""):
                while uploaded_file.state.name == "PROCESSING":
                    import time
                    time.sleep(2)
                    uploaded_file = genai.get_file(uploaded_file.name)
                
                if uploaded_file.state.name == "FAILED":
                    raise ValueError("Video processing failed.")

            logger.info(f"File uploaded: {uploaded_file.uri}")

            # Generate content
            response = self.vision_model.generate_content([uploaded_file, prompt])
            
            # Clean up cleanup
            # genai.delete_file(uploaded_file.name) # Optional: decide on retention policy
            
            return response.text
        except Exception as e:
            logger.error(f"Gemini Analysis Failed: {e}")
            raise e

    async def chat_with_rag(self, message: str, history: list = []):
        """
        Chat with RAG capabilities using Function Calling.
        """
        try:
           chat = self.model.start_chat(enable_automatic_function_calling=True, history=history)
           response = chat.send_message(message)
           return response.text
        except Exception as e:
            logger.error(f"Gemini Chat Failed: {e}")
            raise e

gemini_service = GeminiService()
