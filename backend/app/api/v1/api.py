"""
API v1 router for Wayne Enterprises Dashboard
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    summary,
    revenue,
    hr,
    security,
    supply_chain,
    narrative
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(summary.router, prefix="/summary", tags=["Summary"])
api_router.include_router(revenue.router, prefix="/revenue", tags=["Revenue"])
api_router.include_router(hr.router, prefix="/hr", tags=["Human Resources"])
api_router.include_router(security.router, prefix="/security", tags=["Security"])
api_router.include_router(supply_chain.router, prefix="/supply-chain", tags=["Supply Chain"])
api_router.include_router(narrative.router, prefix="/narrative", tags=["Narrative"])
