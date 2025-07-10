# Wayne Enterprises Dashboard

A comprehensive business intelligence dashboard for Wayne Enterprises, providing insights across various business metrics including revenue, HR, security, and supply chain.

## Features

- **Revenue Analytics**: Track revenue trends and performance by division
- **HR Metrics**: Monitor employee retention and satisfaction
- **Security Dashboard**: Track security incidents and safety scores
- **Supply Chain Insights**: Monitor production metrics and disruptions
- **Data Narratives**: AI-generated insights from your business data

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI
- **Database**: MongoDB
- **Deployment**: Render (or your preferred platform)

## Prerequisites

- Node.js (v16 or higher)
- Python (3.8 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wayne-enterprises-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   # Backend
   MONGODB_URI=your_mongodb_connection_string
   
   # Frontend (create .env.local in frontend directory)
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the frontend (on port 3000) and backend (on port 8000) concurrently.

### Building for Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:8000`

## Deployment

### Deploying to Render

1. **Create a new Web Service** on Render and connect your GitHub repository

2. **Configure the build command**:
   ```
   npm run install-all && npm run build
   ```

3. **Configure the start command**:
   ```
   npm start
   ```

4. **Set environment variables** in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 8000
   - `NODE_ENV`: production
   - `NEXT_PUBLIC_API_URL`: /api

5. **Deploy!**

## Project Structure

```
.
├── backend/               # FastAPI backend
│   ├── app/              # Application code
│   ├── requirements.txt  # Python dependencies
│   └── server.py         # FastAPI server entry point
├── frontend/             # Next.js frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   └── package.json      # Frontend dependencies
├── server.js            # Production server
└── package.json         # Root package.json
```

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## License

MIT
