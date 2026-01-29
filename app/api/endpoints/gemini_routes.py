from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.gemini_service import gemini_service
import shutil
import os
from typing import Optional

router = APIRouter(prefix="/gemini", tags=["Gemini AI"])

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...), prompt: str = Form(...)):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = await gemini_service.analyze_media(file_path, prompt)
        return {"analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...), prompt: str = Form(...)):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = await gemini_service.analyze_media(file_path, prompt)
        return {"analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/doc")
async def analyze_doc(file: UploadFile = File(...), prompt: str = Form(...)):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = await gemini_service.analyze_media(file_path, prompt)
        return {"analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_rag(request: ChatRequest):
    try:
        # Restore real AI Service
        response = await gemini_service.chat_with_rag(request.message)
        return {"response": response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
