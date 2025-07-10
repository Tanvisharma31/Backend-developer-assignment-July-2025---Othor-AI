"""
Summary endpoint for Wayne Enterprises Dashboard
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from typing import Dict, Any

from app.core.database import get_data_loader
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
async def get_summary():
    """
    Get summary metrics for the dashboard
    """
    try:
        data_loader = get_data_loader()
        
        # Load financial data
        financial_df = data_loader.load_dataset("wayne_financial_data.csv")
        
        # Load HR data
        hr_df = data_loader.load_dataset("wayne_hr_analytics.csv")
        
        # Load security data
        security_df = data_loader.load_dataset("wayne_security_data.csv")
        
        # Calculate summary metrics
        total_revenue = financial_df["Revenue_M"].sum()
        avg_retention = hr_df["Retention_Rate"].mean()
        avg_safety_score = security_df["Public_Safety_Score"].mean()
        
        # Find best performing division (by revenue)
        best_division = financial_df.groupby("Division")["Revenue_M"].sum().idxmax()
        
        return {
            "total_revenue": f"${total_revenue:.1f}M",
            "avg_retention": f"{avg_retention:.1%}",
            "public_safety_score": f"{avg_safety_score:.1f}",
            "top_division": best_division,
            "message": "Summary metrics retrieved successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
