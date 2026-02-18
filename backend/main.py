"""
StudentLink API - FastAPI Backend
A Link-in-Bio platform for students using Supabase
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import profile_router, auth_router

# Create FastAPI app
app = FastAPI(
    title="StudentLink API",
    description="Backend API for StudentLink - A Link-in-Bio platform for students",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


def get_cors_origins() -> list[str]:
    """Build allowed CORS origins from defaults and environment variables."""
    default_origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://10.0.2.68:5173",  # Dev container network
    ]

    env_origins = []

    cors_origins = os.getenv("CORS_ORIGINS", "")
    if cors_origins:
        env_origins.extend(origin.strip() for origin in cors_origins.split(",") if origin.strip())

    frontend_url = os.getenv("FRONTEND_URL", "").strip()
    if frontend_url:
        env_origins.append(frontend_url.rstrip("/"))

    vercel_url = os.getenv("VERCEL_URL", "").strip()
    if vercel_url:
        env_origins.append(f"https://{vercel_url}")

    # Preserve order and remove duplicates
    return list(dict.fromkeys(default_origins + env_origins))

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(profile_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Welcome to StudentLink API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
