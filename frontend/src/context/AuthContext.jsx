/**
 * Authentication Context Provider
 * Handles user authentication state using Supabase
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getSession = async () => {
      try {
        // Check if Supabase is properly configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.warn('Supabase not configured - running in demo mode');
          if (isMounted) setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (session) {
          setUser(session.user);
          api.setToken(session.access_token);
          
          // Try to fetch profile
          try {
            const profileData = await api.getMyProfile();
            if (isMounted) setProfile(profileData);
          } catch (err) {
            // Profile doesn't exist yet
            console.log('No profile found');
          }
        }
      } catch (error) {
        if (isMounted) console.error('Session error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getSession();

    // Safety timeout - ensure loading finishes even if something hangs
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth loading timed out');
        setLoading(false);
      }
    }, 5000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session) {
          setUser(session.user);
          api.setToken(session.access_token);
          
          // Fetch profile on sign in
          if (event === 'SIGNED_IN') {
            try {
              const profileData = await api.getMyProfile();
              if (isMounted) setProfile(profileData);
            } catch (err) {
              if (isMounted) setProfile(null);
            }
          }
        } else {
          setUser(null);
          setProfile(null);
          api.removeToken();
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    api.removeToken();
  };

  const refreshProfile = async () => {
    try {
      const profileData = await api.getMyProfile();
      setProfile(profileData);
      return profileData;
    } catch (err) {
      setProfile(null);
      throw err;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGitHub,
    signOut,
    refreshProfile,
    setProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
