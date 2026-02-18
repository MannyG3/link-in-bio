/**
 * API Service for profile operations using Supabase directly
 * Uses Supabase RLS for security
 */
import { supabase } from './supabaseClient';

class ApiService {
  /**
   * Get auth token from Supabase session
   */
  async getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }

  /**
   * Set auth token (handled by Supabase)
   */
  setToken(token) {
    localStorage.setItem('access_token', token);
  }

  /**
   * Remove auth token
   */
  removeToken() {
    localStorage.removeItem('access_token');
  }

  // Profile endpoints using Supabase directly
  async getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error('Profile not found');
    }
    
    return data;
  }

  async getPublicProfile(username) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error('Profile not found');
    }
    
    return data;
  }

  async createProfile(profileData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if username is taken - use maybeSingle to avoid error when not found
    const { data: existing, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', profileData.username)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(checkError.message);
    }

    if (existing) {
      throw new Error('Username already taken');
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: profileData.username,
        full_name: profileData.full_name || null,
        bio: profileData.bio || null,
        links: profileData.links || {},
        capstone_project: profileData.capstone_project || {},
        theme_id: profileData.theme_id || 'minimal',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateProfile(profileData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Build update object (only include provided fields)
    const updateData = {};
    if (profileData.username !== undefined) updateData.username = profileData.username;
    if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name;
    if (profileData.bio !== undefined) updateData.bio = profileData.bio;
    if (profileData.links !== undefined) updateData.links = profileData.links;
    if (profileData.capstone_project !== undefined) updateData.capstone_project = profileData.capstone_project;
    if (profileData.theme_id !== undefined) updateData.theme_id = profileData.theme_id;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Profile not found - please create one first');
    return data;
  }

  async deleteProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (error) throw new Error(error.message);
    return { message: 'Profile deleted successfully' };
  }
}

export const api = new ApiService();
export default api;
