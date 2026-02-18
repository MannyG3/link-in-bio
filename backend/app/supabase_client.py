"""
Supabase Client Configuration
Handles connection to Supabase for auth and database operations
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Lazy initialization
_client = None

def get_supabase():
    """Get or create Supabase client"""
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise ValueError("Missing Supabase environment variables")
        _client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    return _client

# For backward compatibility 
supabase = None

def init_supabase():
    global supabase
    supabase = get_supabase()
    return supabase
