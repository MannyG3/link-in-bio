"""
Routes package
"""
from app.routes.profile import router as profile_router
from app.routes.auth import router as auth_router

__all__ = ["profile_router", "auth_router"]
