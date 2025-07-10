"""
Security endpoint for Wayne Enterprises Dashboard
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime

from app.core.database import get_data_loader

router = APIRouter()

@router.get("/incidents", response_model=List[Dict[str, Any]])
async def get_security_incidents():
    """
    Get security incidents by district and month
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_security_data.csv")
        
        # Convert date and extract year-month
        df['Date'] = pd.to_datetime(df['Date'])
        df['year_month'] = df['Date'].dt.strftime('%Y-%m')
        
        # Calculate incidents by month and district
        incidents_df = df.groupby(['year_month', 'District'])['Incidents_Reported'].sum().reset_index()
        
        # Pivot the data for the response
        pivot_df = incidents_df.pivot(
            index='year_month',
            columns='District',
            values='Incidents_Reported'
        ).reset_index()
        
        # Convert to the required format
        result = []
        for _, row in pivot_df.iterrows():
            entry = {'month': row['year_month']}
            for col in pivot_df.columns[1:]:  # Skip the month column
                entry[col.lower().replace(' ', '_')] = int(row[col]) if pd.notnull(row[col]) else 0
            result.append(entry)
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/safety-scores", response_model=List[Dict[str, Any]])
async def get_safety_scores():
    """
    Get public safety scores by district and month
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_security_data.csv")
        
        # Convert date and extract year-month
        df['Date'] = pd.to_datetime(df['Date'])
        df['year_month'] = df['Date'].dt.strftime('%Y-%m')
        
        # Calculate average safety scores by month and district
        safety_df = df.groupby(['year_month', 'District'])['Public_Safety_Score'].mean().reset_index()
        
        # Pivot the data for the response
        pivot_df = safety_df.pivot(
            index='year_month',
            columns='District',
            values='Public_Safety_Score'
        ).reset_index()
        
        # Convert to the required format
        result = []
        for _, row in pivot_df.iterrows():
            entry = {'month': row['year_month']}
            for col in pivot_df.columns[1:]:  # Skip the month column
                entry[col.lower().replace(' ', '_')] = round(float(row[col]), 1) if pd.notnull(row[col]) else 0.0
            result.append(entry)
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
