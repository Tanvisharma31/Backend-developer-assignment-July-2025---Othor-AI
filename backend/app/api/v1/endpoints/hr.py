"""
HR Analytics endpoint for Wayne Enterprises Dashboard
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime

from app.core.database import get_data_loader

router = APIRouter()

@router.get("/retention", response_model=List[Dict[str, Any]])
async def get_retention_rates():
    """
    Get monthly retention rates by division
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_hr_analytics.csv")
        
        # Convert date and extract year-month
        df['Date'] = pd.to_datetime(df['Date'])
        df['year_month'] = df['Date'].dt.strftime('%Y-%m')
        
        # Calculate average retention by month and division
        retention_df = df.groupby(['year_month', 'Division'])['Retention_Rate'].mean().reset_index()
        
        # Pivot the data for the response
        pivot_df = retention_df.pivot(
            index='year_month',
            columns='Division',
            values='Retention_Rate'
        ).reset_index()
        
        # Convert to the required format
        result = []
        for _, row in pivot_df.iterrows():
            entry = {'month': row['year_month']}
            for col in pivot_df.columns[1:]:  # Skip the month column
                entry[col.lower().replace(' ', '_')] = row[col]
            result.append(entry)
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics", response_model=Dict[str, Any])
async def get_hr_metrics():
    """
    Get key HR metrics
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_hr_analytics.csv")
        
        # Calculate metrics
        avg_training_hours = df['Training_Hours'].mean()
        avg_performance = df['Performance_Rating'].mean()
        avg_satisfaction = df['Satisfaction_Score'].mean()
        
        return {
            "avg_training_hours": round(avg_training_hours, 1),
            "avg_performance_rating": round(avg_performance, 1),
            "avg_satisfaction_score": round(avg_satisfaction, 1),
            "message": "HR metrics retrieved successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
