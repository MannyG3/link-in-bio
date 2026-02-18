"""
Authentication routes using Supabase Auth
"""
from fastapi import APIRouter, HTTPException
from app.supabase_client import get_supabase
from app.schemas import UserAuth, TokenResponse, MessageResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserAuth):
    """
    Register a new user with Supabase Auth.
    """
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if response.user is None:
            raise HTTPException(status_code=400, detail="Signup failed")
            
        return TokenResponse(
            access_token=response.session.access_token if response.session else "",
            user_id=response.user.id,
            email=response.user.email or user_data.email
        )
        
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=400, detail=error_msg)


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserAuth):
    """
    Login user with Supabase Auth.
    """
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if response.user is None or response.session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        return TokenResponse(
            access_token=response.session.access_token,
            user_id=response.user.id,
            email=response.user.email or user_data.email
        )
        
    except Exception as e:
        error_msg = str(e)
        if "invalid" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid email or password")
        raise HTTPException(status_code=401, detail=error_msg)


@router.post("/logout", response_model=MessageResponse)
async def logout():
    """
    Logout user (client should discard token).
    """
    try:
        supabase = get_supabase()
        supabase.auth.sign_out()
        return MessageResponse(message="Logged out successfully")
    except Exception as e:
        return MessageResponse(message="Logged out", success=True)


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(email: str):
    """
    Send password reset email.
    """
    try:
        supabase = get_supabase()
        supabase.auth.reset_password_email(email)
        return MessageResponse(message="Password reset email sent")
    except Exception as e:
        # Don't reveal if email exists
        return MessageResponse(message="If the email exists, a reset link has been sent")
