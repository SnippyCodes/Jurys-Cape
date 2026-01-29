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
            # Initialization without tools to prevent startup or runtime crashes
            # Using 'gemini-flash-latest' as it is confirmed available in the user's model list (2026 era)
            self.model = genai.GenerativeModel(model_name="gemini-flash-latest")
            self.vision_model = genai.GenerativeModel(model_name="gemini-flash-latest")

    async def analyze_media(self, file_path: str, prompt: str, mime_type: str = None):
        """
        Analyzes Video, Image, or PDF.
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")

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

            response = self.vision_model.generate_content([uploaded_file, prompt])
            
            return response.text
        except Exception as e:
            logger.error(f"Gemini Analysis Failed: {e}")
            raise e

    async def chat_with_rag(self, message: str, history: list = []):
        """
        Chat with RAG capabilities using Manual Context Injection.
        """
        try:
           print(f"DEBUG: chat_with_rag called with: {message}")
           print(f"DEBUG: API Key present: {bool(settings.GEMINI_API_KEY)}")
           
           # 1. Retrieve Context safely
           context_text = ""
           try:
               results = search_legal_precedents(message)
               if results:
                   context_text = "\n\nRelevant Legal Context:\n" + "\n".join(results)
           except Exception as rag_error:
               logger.warning(f"RAG Search failed, proceeding without context: {rag_error}")
           
           # 2. Construct Prompt
           print(f"DEBUG: Processing Chat Message: {message}")
           system_instruction = "You are an expert Indian Legal Advisor backed by the BNS 2023 code. Use the provided context to answer if relevant. If no context is provided, rely on your general knowledge but mention it."
           full_prompt = f"{system_instruction}\n{context_text}\n\nUser Query: {message}"

           # 3. Generate (One-shot for now to be safe, or ChatSession)
           print("DEBUG: Starting chat session...")
           chat = self.model.start_chat(history=history)
           print("DEBUG: Sending message to Gemini...")
           response = chat.send_message(full_prompt)
           print("DEBUG: Response received!")
           return response.text

        except Exception as e:
            logger.error(f"Gemini Chat Failed: {e}")
            # FALBACK RESPONSE: Keep the UI alive!
            return f"System Notice: Remote Intelligence Offline. (Error: {str(e)})"

gemini_service = GeminiService()
