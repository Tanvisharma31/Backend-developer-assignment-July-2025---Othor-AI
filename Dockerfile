# This is a multi-stage Dockerfile that will build both frontend and backend
# and use docker-compose to run them together

# Build the backend
FROM python:3.11-slim as backend-builder
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Build the frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Final stage - Use Node.js as base since we need both Node and Python
FROM node:18-slim

# Install Python and build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

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

# Python dependencies are already installed in the backend-builder stage

# Set working directory to backend for the CMD
WORKDIR /app/backend

# Expose ports
EXPOSE 8000 3000

# Command to run both services
CMD sh -c "cd /app/frontend && npm start & cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000"
