"""
Narrative endpoint for Wayne Enterprises Dashboard
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from typing import Dict, Any

from app.core.database import get_data_loader

router = APIRouter()

def generate_narrative() -> Dict[str, Any]:
    """
    Generate a data-driven narrative based on the latest data
    """
    try:
        data_loader = get_data_loader()
        
        # Load all necessary datasets
        financial_df = data_loader.load_dataset("wayne_financial_data.csv")
        hr_df = data_loader.load_dataset("wayne_hr_analytics.csv")
        security_df = data_loader.load_dataset("wayne_security_data.csv")
        supply_chain_df = data_loader.load_dataset("wayne_supply_chain.csv")
        
        # Calculate key metrics for the narrative
        
        # 1. Financial Performance
        total_revenue = financial_df["Revenue_M"].sum()
        revenue_growth = financial_df.groupby('Year')['Revenue_M'].sum().pct_change().iloc[-1] * 100
        
        # 2. HR Metrics
        avg_retention = hr_df["Retention_Rate"].mean()
        avg_satisfaction = hr_df["Satisfaction_Score"].mean()
        
        # 3. Security Metrics
        total_incidents = security_df["Incidents_Reported"].sum()
        avg_safety_score = security_df["Public_Safety_Score"].mean()
        
        # 4. Supply Chain Metrics
        total_disruptions = supply_chain_df["Disruption_Hours"].sum()
        avg_quality = supply_chain_df["Quality_Score"].mean()
        
        # Generate the narrative based on the data
        headline = ""
        insight = ""
        
        if revenue_growth > 15:
            headline = "Wayne Enterprises Reports Strong Revenue Growth"
            insight = f"Quarterly revenue has grown by {revenue_growth:.1f}%, driven by increased market share and operational efficiency."
        elif avg_retention < 0.8:
            headline = "Employee Retention Needs Attention"
            insight = f"With an average retention rate of {avg_retention:.1%}, HR initiatives may be needed to improve employee satisfaction and reduce turnover."
        elif total_incidents > 50:
            headline = "Security Incidents on the Rise"
            insight = f"{total_incidents} security incidents reported this quarter. Consider reviewing security protocols and WayneTech deployments in high-incident areas."
        else:
            headline = "Wayne Enterprises: Steady Performance Across All Divisions"
            insight = "All key performance indicators are within expected ranges, with particular strength in customer satisfaction and product quality."
        
        # Supporting data points
        metrics = {
            "total_revenue": f"${total_revenue:.1f}M",
            "revenue_growth": f"{revenue_growth:.1f}%",
            "avg_retention": f"{avg_retention:.1%}",
            "avg_satisfaction": f"{avg_satisfaction:.1f}/10",
            "total_incidents": total_incidents,
            "avg_safety_score": f"{avg_safety_score:.1f}/100",
            "total_disruptions": f"{total_disruptions} hours",
            "avg_quality_score": f"{avg_quality:.1f}/10"
        }
        
        return {
            "headline": headline,
            "insight": insight,
            "metrics": metrics,
            "timestamp": pd.Timestamp.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating narrative: {str(e)}")

@router.get("/insight", response_model=Dict[str, Any])
async def get_data_insight():
    """
    Get a data-driven narrative insight
    """
    try:
        return generate_narrative()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
