"""
Supply Chain endpoint for Wayne Enterprises Dashboard
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from typing import List, Dict, Any
from datetime import datetime

from app.core.database import get_data_loader

router = APIRouter()

@router.get("/metrics", response_model=List[Dict[str, Any]])
async def get_supply_chain_metrics():
    """
    Get supply chain metrics by facility and product line
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_supply_chain.csv")
        
        # Calculate metrics by facility and product line
        metrics_df = df.groupby(['Facility', 'Product_Line']).agg({
            'Production_Volume': 'sum',
            'Cost_Per_Unit': 'mean',
            'Quality_Score': 'mean',
            'Sustainability_Rating': 'mean',
            'Disruption_Hours': 'sum'
        }).reset_index()
        
        # Convert to the required format
        result = []
        for _, row in metrics_df.iterrows():
            entry = {
                'facility': row['Facility'],
                'product_line': row['Product_Line'],
                'production_volume': int(row['Production_Volume']),
                'avg_cost_per_unit': round(float(row['Cost_Per_Unit']), 2),
                'avg_quality_score': round(float(row['Quality_Score']), 1),
                'avg_sustainability_rating': round(float(row['Sustainability_Rating']), 1),
                'total_disruption_hours': int(row['Disruption_Hours'])
            }
            result.append(entry)
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/disruptions", response_model=List[Dict[str, Any]])
async def get_supply_disruptions():
    """
    Get supply chain disruptions over time
    """
    try:
        data_loader = get_data_loader()
        df = data_loader.load_dataset("wayne_supply_chain.csv")
        
        # Convert date and extract year-month
        df['Date'] = pd.to_datetime(df['Date'])
        df['year_month'] = df['Date'].dt.strftime('%Y-%m')
        
        # Calculate disruptions by month and facility
        disruptions_df = df.groupby(['year_month', 'Facility'])['Disruption_Hours'].sum().reset_index()
        
        # Pivot the data for the response
        pivot_df = disruptions_df.pivot(
            index='year_month',
            columns='Facility',
            values='Disruption_Hours'
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
