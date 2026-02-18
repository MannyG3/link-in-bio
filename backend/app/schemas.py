"""
Pydantic schemas for request/response validation
"""
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class Links(BaseModel):
    """Social links schema"""
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None


class CapstoneProject(BaseModel):
    """Capstone project details"""
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None


class ProfileBase(BaseModel):
    """Base profile schema"""
    username: Optional[str] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    links: Optional[Links] = None
    capstone_project: Optional[CapstoneProject] = None
    theme_id: Optional[str] = Field(default="minimal")


class ProfileCreate(ProfileBase):
    """Schema for creating a new profile"""
    username: str


class ProfileUpdate(ProfileBase):
    """Schema for updating profile"""
    pass


class ProfileResponse(ProfileBase):
    """Schema for profile response"""
    id: str
    username: str
    is_premium: bool = False
    
    class Config:
        from_attributes = True


class ProfilePublic(BaseModel):
    """Public profile schema (for public pages)"""
    username: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    links: Optional[Dict[str, Any]] = None
    capstone_project: Optional[Dict[str, Any]] = None
    theme_id: str = "minimal"
    is_premium: bool = False


class UserAuth(BaseModel):
    """User authentication schema"""
    email: str
    password: str


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str


class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
    success: bool = True
