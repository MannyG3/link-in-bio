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
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          api.setToken(session.access_token);
          
          // Try to fetch profile
          try {
            const profileData = await api.getMyProfile();
            setProfile(profileData);
          } catch (err) {
            // Profile doesn't exist yet
            console.log('No profile found');
          }
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          api.setToken(session.access_token);
          
          // Fetch profile on sign in
          if (event === 'SIGNED_IN') {
            try {
              const profileData = await api.getMyProfile();
              setProfile(profileData);
            } catch (err) {
              setProfile(null);
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

    return () => subscription?.unsubscribe();
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
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
