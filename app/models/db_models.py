from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class Case(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    title: str
    description: str
    case_type: str = "General"
    status: str = "Draft"
    priority: str = "Medium"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    officer_id: str = "Officer-Krushna"

    # New Structured Fields
    incident_date: Optional[str] = None
    incident_time: Optional[str] = None
    location: Optional[str] = None
    complainant: Optional[str] = None
    accused: Optional[str] = None
    
    # AI Analysis Results
    summary: Optional[str] = None
    chronology: Optional[str] = None
    bns_sections: Optional[str] = None

class Evidence(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: str = Field(foreign_key="case.id")
    file_name: str
    file_type: str
    file_hash: str
    analysis_result: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
