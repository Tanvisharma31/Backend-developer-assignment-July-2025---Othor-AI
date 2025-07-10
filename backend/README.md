# Wayne Enterprises Dashboard API

This is the backend API for the Wayne Enterprises Business Intelligence Dashboard. It provides endpoints for accessing and analyzing business data.

## Features

- RESTful API built with FastAPI
- Data processing with Pandas
- Automatic API documentation with Swagger UI and ReDoc
- CORS support
- Structured project layout

## Prerequisites

- Python 3.8+
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the development server:
   ```bash
   python server.py
   ```

2. The API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: Visit `http://localhost:8000/api/docs`
- **ReDoc**: Visit `http://localhost:8000/api/redoc`

## Available Endpoints

### Summary
- `GET /api/v1/summary` - Get summary metrics

### Revenue
- `GET /api/v1/revenue/trends` - Get revenue trends
- `GET /api/v1/revenue/by-division` - Get revenue by division

### Human Resources
- `GET /api/v1/hr/retention` - Get retention rates
- `GET /api/v1/hr/metrics` - Get HR metrics

### Security
- `GET /api/v1/security/incidents` - Get security incidents
- `GET /api/v1/security/safety-scores` - Get safety scores

### Supply Chain
- `GET /api/v1/supply-chain/metrics` - Get supply chain metrics
- `GET /api/v1/supply-chain/disruptions` - Get supply chain disruptions

### Narrative
- `GET /api/v1/narrative/insight` - Get data-driven narrative insight

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── __init__.py
│   │       │   ├── summary.py
│   │       │   ├── revenue.py
│   │       │   ├── hr.py
│   │       │   ├── security.py
│   │       │   ├── supply_chain.py
│   │       │   └── narrative.py
│   │       └── api.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── database.py
│   ├── models/
│   │   └── __init__.py
│   ├── schemas/
│   │   └── __init__.py
│   ├── services/
│   │   └── __init__.py
│   ├── __init__.py
│   └── main.py
├── datasets/
│   ├── wayne_financial_data.csv
│   ├── wayne_hr_analytics.csv
│   ├── wayne_rd_portfolio.csv
│   ├── wayne_security_data.csv
│   └── wayne_supply_chain.csv
├── .env.example
├── README.md
├── requirements.txt
└── server.py
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Settings
DEBUG=True
API_V1_STR=/api/v1
PROJECT_NAME="Wayne Enterprises Dashboard API"

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:8000"]
```

## Development

### Code Style

This project uses:
- Black for code formatting
- isort for import sorting
- mypy for type checking
- pylint for code quality

Run the following commands before committing:

```bash
black .
isort .
mypy .
pylint app/
```

### Testing

To run tests:

```bash
pytest
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
