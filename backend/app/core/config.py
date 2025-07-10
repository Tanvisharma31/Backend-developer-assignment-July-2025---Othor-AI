"""
Configuration settings for Wayne Enterprises Dashboard API
"""
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, validator


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Wayne Enterprises Dashboard API"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # Default Next.js dev server
        "http://localhost:8000",  # Default FastAPI dev server
    ]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Data Directory
    DATA_DIR: str = str(Path(__file__).parent.parent.parent / "datasets")
    
    # API Settings
    DEBUG: bool = True
    
    class Config:
        case_sensitive = True


settings = Settings()
