# This is a multi-stage Dockerfile that will build both frontend and backend
# and use docker-compose to run them together

# Build the backend
FROM python:3.11-slim as backend-builder

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Build the frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Final stage - Use Python as base since it's heavier than Node
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend /app/backend
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy frontend
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=frontend-builder /app/frontend/package*.json /app/frontend/
COPY --from=frontend-builder /app/frontend/next.config.* /app/frontend/

# Copy datasets
COPY datasets/ /app/backend/data/

# Install frontend production dependencies
WORKDIR /app/frontend
RUN npm install --only=production

# Set working directory to backend for the CMD
WORKDIR /app/backend

# Expose ports
EXPOSE 8000 3000

# Install Python dependencies again in final stage to ensure they're available
RUN pip install --no-cache-dir -r requirements.txt

# Command to run both services
CMD sh -c "cd /app/frontend && npm start & cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000"
