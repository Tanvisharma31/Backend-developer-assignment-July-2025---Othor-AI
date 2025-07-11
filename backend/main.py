from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from pathlib import Path
from typing import Dict, Any, List
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(
    title="Wayne Enterprises BI Dashboard API",
    description="Backend API for Wayne Enterprises Business Intelligence Dashboard",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
DATA_DIR = Path(__file__).parent.parent / "datasets"

class DataLoader:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataLoader, cls).__new__(cls)
            cls._instance._load_data()
        return cls._instance
    
    def _load_data(self):
        """Load all required datasets"""
        try:
            self.financial_data = pd.read_csv(DATA_DIR / "wayne_financial_data.csv")
            self.hr_data = pd.read_csv(DATA_DIR / "wayne_hr_analytics.csv")
            self.rd_data = pd.read_csv(DATA_DIR / "wayne_rd_portfolio.csv")
            self.security_data = pd.read_csv(DATA_DIR / "wayne_security_data.csv")
            self.supply_chain_data = pd.read_csv(DATA_DIR / "wayne_supply_chain.csv")
        except Exception as e:
            raise Exception(f"Error loading data: {str(e)}")

# Initialize data loader
data_loader = DataLoader()

# Pydantic models for request/response
class SummaryResponse(BaseModel):
    total_revenue: float
    avg_retention: float
    avg_satisfaction: float
    avg_quality_score: float
    total_incidents: int

# API Endpoints
@app.get("/api/summary", response_model=SummaryResponse)
async def get_summary():
    """Return summary KPIs across all domains"""
    try:
        # Calculate summary metrics
        total_revenue = data_loader.financial_data['Revenue_M'].sum()
        avg_retention = data_loader.hr_data['Retention_Rate_Pct'].mean()
        avg_satisfaction = data_loader.hr_data['Employee_Satisfaction_Score'].mean()
        avg_quality = data_loader.supply_chain_data['Quality_Score_Pct'].mean()
        total_incidents = data_loader.security_data['Security_Incidents'].sum()
        
        return {
            "total_revenue": round(total_revenue, 2),
            "avg_retention": round(avg_retention, 2),
            "avg_satisfaction": round(avg_satisfaction, 2),
            "avg_quality_score": round(avg_quality, 2),
            "total_incidents": int(total_incidents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics/financial")
async def get_financial_metrics():
    """Return financial metrics by division and quarter"""
    try:
        return data_loader.financial_data.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics/hr")
async def get_hr_metrics():
    """Return HR metrics by division and date"""
    try:
        return data_loader.hr_data.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics/security")
async def get_security_metrics():
    """Return security metrics by district and month"""
    try:
        return data_loader.security_data.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/charts/{chart_id}")
async def get_chart_data(chart_id: int):
    """Return data for specific chart visualization"""
    try:
        if chart_id == 1:
            # Revenue vs R&D Investment by Division/Quarter
            return data_loader.financial_data[['Division', 'Quarter', 'Revenue_M', 'RD_Investment_M']].to_dict(orient='records')
        elif chart_id == 2:
            # Employee Performance vs Diversity Index
            # This is a simplified example - you'd need to calculate or join with appropriate data
            return {"message": "Chart 2 data processing not implemented yet"}
        elif chart_id == 3:
            # Security Incidents vs WayneTech Deployments
            return data_loader.security_data.to_dict(orient='records')
        elif chart_id == 4:
            # Product Quality vs Sustainability
            return data_loader.supply_chain_data[['Product_Line', 'Quality_Score_Pct', 'Sustainability_Rating']].to_dict(orient='records')
        elif chart_id == 5:
            # R&D Budget vs Commercial Potential
            return data_loader.rd_data[['Project_ID', 'Budget_Allocated_M', 'Commercialization_Potential']].to_dict(orient='records')
        else:
            raise HTTPException(status_code=404, detail="Chart ID not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/narrative")
async def get_data_narrative():
    """Return the featured data story content"""
    try:
        # Calculate some interesting insights
        financial_data = data_loader.financial_data
        max_revenue_division = financial_data.loc[financial_data['Revenue_M'].idxmax()]['Division']
        max_revenue = financial_data['Revenue_M'].max()
        
        return {
            "headline": f"{max_revenue_division} Division Drives Record Revenue in Q3",
            "subtitle": f"Strategic initiatives result in ${max_revenue/1e6:.1f}M in quarterly revenue",
            "insights": [
                f"{max_revenue_division} division achieved {max_revenue/1e6:.1f}M in revenue",
                "R&D investments show strong correlation with market share growth",
                "Employee satisfaction remains above industry average at 4.2/5.0"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
