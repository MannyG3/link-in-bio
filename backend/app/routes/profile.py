"""
Profile API routes
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional

from app.supabase_client import get_supabase
from app.schemas import (
    ProfileUpdate, 
    ProfileResponse, 
    ProfilePublic,
    ProfileCreate,
    MessageResponse
)
from app.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/{username}", response_model=ProfilePublic)
async def get_public_profile(username: str):
    """
    Get public profile by username.
    This is a public route - no authentication required.
    """
    try:
        supabase = get_supabase()
        response = supabase.table("profiles").select("*").eq("username", username).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        return ProfilePublic(**response.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        if "Cannot coerce" in str(e) or "0 rows" in str(e):
            raise HTTPException(status_code=404, detail="Profile not found")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me/current", response_model=ProfileResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.
    """
    user_id = current_user["user_id"]
    
    try:
        supabase = get_supabase()
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Profile not found. Please create one first.")
            
        return ProfileResponse(**response.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        if "Cannot coerce" in str(e) or "0 rows" in str(e):
            raise HTTPException(status_code=404, detail="Profile not found. Please create one first.")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=ProfileResponse)
async def create_profile(
    profile_data: ProfileCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new profile for the authenticated user.
    """
    user_id = current_user["user_id"]
    supabase = get_supabase()
    
    # Check if username is already taken
    existing = supabase.table("profiles").select("id").eq("username", profile_data.username).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Check if user already has a profile
    user_profile = supabase.table("profiles").select("id").eq("id", user_id).execute()
    if user_profile.data:
        raise HTTPException(status_code=400, detail="Profile already exists. Use PUT to update.")
    
    try:
        data = {
            "id": user_id,
            "username": profile_data.username,
            "full_name": profile_data.full_name,
            "bio": profile_data.bio,
            "links": profile_data.links.model_dump() if profile_data.links else {},
            "capstone_project": profile_data.capstone_project.model_dump() if profile_data.capstone_project else {},
            "theme_id": profile_data.theme_id or "minimal",
            "is_premium": False
        }
        
        response = supabase.table("profiles").insert(data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create profile")
            
        return ProfileResponse(**response.data[0])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update the current user's profile.
    Protected route - requires authentication.
    """
    user_id = current_user["user_id"]
    supabase = get_supabase()
    
    # Build update data (only include non-None values)
    update_data = {}
    
    if profile_data.username is not None:
        # Check if new username is already taken by another user
        existing = supabase.table("profiles").select("id").eq("username", profile_data.username).neq("id", user_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Username already taken")
        update_data["username"] = profile_data.username
        
    if profile_data.full_name is not None:
        update_data["full_name"] = profile_data.full_name
        
    if profile_data.bio is not None:
        update_data["bio"] = profile_data.bio
        
    if profile_data.links is not None:
        update_data["links"] = profile_data.links.model_dump()
        
    if profile_data.capstone_project is not None:
        update_data["capstone_project"] = profile_data.capstone_project.model_dump()
        
    if profile_data.theme_id is not None:
        update_data["theme_id"] = profile_data.theme_id
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    try:
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        return ProfileResponse(**response.data[0])
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/", response_model=MessageResponse)
async def delete_profile(current_user: dict = Depends(get_current_user)):
    """
    Delete the current user's profile.
    """
    user_id = current_user["user_id"]
    
    try:
        supabase = get_supabase()
        response = supabase.table("profiles").delete().eq("id", user_id).execute()
        
        return MessageResponse(message="Profile deleted successfully")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
