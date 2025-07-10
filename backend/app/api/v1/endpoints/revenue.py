"""
Revenue endpoint for Wayne Enterprises Dashboard
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime

from app.core.database import get_data_loader

router = APIRouter()

@router.get("/trends", response_model=List[Dict[str, Any]])
async def get_revenue_trends():
    """
    Get revenue trends by division and quarter
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_financial_data.csv")
        
        # Process data for the response
        df['quarter_year'] = df['Quarter'] + ' ' + df['Year'].astype(str)
        
        # Pivot the data for the response
        pivot_df = df.pivot_table(
            index='quarter_year',
            columns='Division',
            values='Revenue_M',
            aggfunc='sum'
        ).reset_index()
        
        # Convert to the required format
        result = []
        for _, row in pivot_df.iterrows():
            entry = {'quarter': row['quarter_year']}
            for col in pivot_df.columns[1:]:  # Skip the quarter_year column
                entry[col.lower().replace(' ', '_')] = row[col]
            result.append(entry)
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/by-division", response_model=Dict[str, Any])
async def get_revenue_by_division():
    """
    Get total revenue by division
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_financial_data.csv")
        
        # Calculate total revenue by division
        revenue_by_division = df.groupby('Division')['Revenue_M'].sum().to_dict()
        
        return {
            "data": revenue_by_division,
            "message": "Revenue by division retrieved successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
