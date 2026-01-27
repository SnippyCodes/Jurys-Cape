from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.db_models import Case, Evidence
import json
import shutil
import os
from datetime import datetime
import hashlib

router = APIRouter()

# ... (Previous CRUD Endpoints serve as base, I will re-include them to be safe)

@router.post("/cases/", response_model=Case)
def create_case(case: Case, session: Session = Depends(get_session)):
    session.add(case)
    session.commit()
    session.refresh(case)
    return case

@router.get("/cases/", response_model=List[Case])
def read_cases(session: Session = Depends(get_session)):
    cases = session.exec(select(Case)).all()
    return cases

@router.get("/cases/{case_id}", response_model=Case)
def read_case(case_id: str, session: Session = Depends(get_session)):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.patch("/cases/{case_id}/intelligence", response_model=Case)
def save_case_intelligence(
    case_id: str, 
    summary: str = Body(...), 
    facts: List[str] = Body(...), 
    laws: List[str] = Body(...),
    metadata: dict = Body(...),
    session: Session = Depends(get_session)
):
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    case.summary = summary
    case.chronology = json.dumps(facts)
    case.bns_sections = json.dumps(laws)
    case.status = "Analyzed"
    
    if metadata:
        case.incident_date = metadata.get("incident_date")
        case.incident_time = metadata.get("incident_time")
        case.location = metadata.get("location")
        case.complainant = metadata.get("complainant")
        case.accused = metadata.get("accused")
    
    session.add(case)
    session.commit()
    session.refresh(case)
    return case

@router.post("/cases/{case_id}/evidence", response_model=Evidence)
def upload_case_evidence(case_id: str, file: UploadFile = File(...), session: Session = Depends(get_session)):
    # Verify case exists
    case = session.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Ensure upload directory
    upload_dir = f"uploads/{case_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = f"{upload_dir}/{file.filename}"
    
    # Save file and calculate hash
    sha256_hash = hashlib.sha256()
    with open(file_path, "wb") as buffer:
        for byte_block in iter(lambda: file.file.read(4096), b""):
             sha256_hash.update(byte_block)
             buffer.write(byte_block)
    
    file_hash = sha256_hash.hexdigest()
    
    # Create DB Record
    evidence = Evidence(
        case_id=case_id,
        file_name=file.filename,
        file_type=file.content_type or "unknown",
        file_hash=file_hash
    )
    
    session.add(evidence)
    session.commit()
    session.refresh(evidence)
    return evidence

@router.get("/cases/{case_id}/evidence", response_model=List[Evidence])
def get_case_evidence(case_id: str, session: Session = Depends(get_session)):
    statement = select(Evidence).where(Evidence.case_id == case_id)
    results = session.exec(statement).all()
    return results
