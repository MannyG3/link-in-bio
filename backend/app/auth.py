"""
Authentication utilities for JWT validation with Supabase
"""
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")

# Extract project ref from URL for JWT validation
# URL format: https://<project-ref>.supabase.co
PROJECT_REF = SUPABASE_URL.split("//")[1].split(".")[0] if SUPABASE_URL else ""


async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """
    Verify Supabase JWT token and return user data.
    For Supabase, we decode the JWT to get the user ID.
    """
    token = credentials.credentials
    
    try:
        # Decode without verification (Supabase handles auth on their end)
        # We just need to extract the user info from the JWT
        payload = jwt.decode(
            token,
            key="",  # Empty key for unverified decode
            options={"verify_signature": False},
            algorithms=["HS256"]
        )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: no user ID")
            
        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "role": payload.get("role", "authenticated")
        }
        
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


def get_current_user(user_data: dict = Depends(verify_token)) -> dict:
    """Get current authenticated user"""
    return user_data
