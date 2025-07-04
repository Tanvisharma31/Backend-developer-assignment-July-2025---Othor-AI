from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from datetime import datetime
import os
from typing import List, Dict, Any
import json
from pydantic import BaseModel

app = FastAPI(
    title="Wayne Enterprises Dashboard API",
    description="API for Wayne Enterprises Business Intelligence Dashboard",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load datasets
# Datasets are in the 'datasets' folder next to this file
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "datasets"))
print(f"Looking for datasets in: {DATA_DIR}")  # Debug print

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Wayne Enterprises API is running"}

@app.get("/api/financial/quarterly")
async def get_financial_quarterly():
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, 'wayne_financial_data.csv'))
        df['Date'] = df['Quarter'] + ' ' + df['Year'].astype(str)
        df['Date'] = pd.to_datetime(df['Date'].str.replace('Q', ''))
        
        # Convert to JSON-serializable format
        result = []
        for _, row in df.iterrows():
            result.append({
                'division': row['Division'],
                'quarter': row['Quarter'],
                'year': int(row['Year']),
                'revenue': float(row['Revenue_M']),
                'profit': float(row['Net_Profit_M']),
                'rnd_investment': float(row['R&D_Investment_M']),
                'market_share': float(row['Market_Share']),
                'customer_satisfaction': float(row['Customer_Satisfaction'])
            })
        return {"data": result, "message": "Financial data retrieved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/security/metrics")
async def get_security_metrics():
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, 'wayne_security_data.csv'))
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Process and aggregate data
        df['year_month'] = df['Date'].dt.to_period('M')
        monthly_metrics = df.groupby(['year_month', 'District']).agg({
            'Incidents_Reported': 'sum',
            'Response_Time_Minutes': 'mean',
            'Wayne_Tech_Deployed': 'sum',
            'Public_Safety_Score': 'mean'
        }).reset_index()
        
        return {
            "data": monthly_metrics.to_dict(orient='records'),
            "message": "Security metrics retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rd/projects")
async def get_rd_projects():
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, 'wayne_rd_portfolio.csv'))
        df['Start_Date'] = pd.to_datetime(df['Start_Date'])
        
        # Calculate project status based on current date
        current_date = pd.Timestamp.now()
        df['status'] = df.apply(
            lambda x: 'On Track' if pd.isna(x['Completion_Date']) and x['Timeline_Adherence_%'] >= 90 
                      else 'Delayed' if pd.isna(x['Completion_Date']) and x['Timeline_Adherence_%'] < 90 
                      else 'Completed', 
            axis=1
        )
        
        return {
            "data": df.to_dict(orient='records'),
            "message": "R&D projects data retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/supply-chain/metrics")
async def get_supply_chain_metrics():
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, 'wayne_supply_chain.csv'))
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Process metrics
        df['year_month'] = df['Date'].dt.to_period('M')
        metrics = df.groupby(['Facility', 'Product_Line']).agg({
            'Production_Volume': 'sum',
            'Cost_Per_Unit': 'mean',
            'Quality_Score': 'mean',
            'Sustainability_Rating': 'mean',
            'Disruption_Hours': 'sum'
        }).reset_index()
        
        return {
            "data": metrics.to_dict(orient='records'),
            "message": "Supply chain metrics retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/hr/analytics")
async def get_hr_analytics():
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, 'wayne_hr_analytics.csv'))
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Process HR metrics
        df['year_month'] = df['Date'].dt.to_period('M')
        metrics = df.groupby(['Division', 'Hierarchy_Level']).agg({
            'Retention_Rate': 'mean',
            'Training_Hours': 'sum',
            'Performance_Rating': 'mean',
            'Diversity_Index': 'mean',
            'Satisfaction_Score': 'mean'
        }).reset_index()
        
        return {
            "data": metrics.to_dict(orient='records'),
            "message": "HR analytics data retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
