from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "Juris-Cape Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    SWARM_SECRET: str = "change-me-in-prod-secure-swarm-key"
    GEMINI_API_KEY: str # Read from env
    STORAGE_TYPE: str = "local" # or 'supabase'

settings = Settings(GEMINI_API_KEY=os.getenv("GEMINI_API_KEY"))