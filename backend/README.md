# Wayne Enterprises BI Dashboard - Backend

This is the FastAPI backend for the Wayne Enterprises Business Intelligence Dashboard.

## Setup

1. **Prerequisites**
   - Python 3.11 or higher
   - pip (Python package manager)

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Directory Structure**
   ```
   backend/
   ├── app/
   │   ├── __init__.py
   │   ├── main.py          # FastAPI application
   │   ├── api/             # API routes
   │   ├── models/          # Pydantic models
   │   ├── services/        # Business logic
   │   └── utils/           # Utility functions
   ├── requirements.txt     # Python dependencies
   └── README.md           # This file
   ```

4. **Running the Server**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

5. **API Documentation**
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## API Endpoints

- `GET /api/summary` - Get summary KPIs across all domains
- `GET /api/metrics/financial` - Get financial metrics
- `GET /api/metrics/hr` - Get HR metrics
- `GET /api/metrics/security` - Get security metrics
- `GET /api/charts/{chart_id}` - Get data for specific charts
- `GET /api/narrative` - Get the featured data story
