/**
 * Dashboard Page - Profile Builder
 * Where students edit their link-in-bio profile
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
  User,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  Save,
  LogOut,
  Eye,
  Palette,
  Loader2,
  Check,
  Lock,
  ExternalLink,
} from 'lucide-react';

const THEMES = [
  { id: 'minimal', name: 'Light/Minimal', premium: false, preview: 'bg-white' },
  { id: 'midnight', name: 'Midnight/Dark', premium: true, preview: 'bg-gray-900' },
];

export default function Dashboard() {
  const { user, profile, signOut, refreshProfile, setProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    links: {
      github: '',
      linkedin: '',
      portfolio: '',
    },
    capstone_project: {
      title: '',
      description: '',
      url: '',
    },
    theme_id: 'minimal',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        links: {
          github: profile.links?.github || '',
          linkedin: profile.links?.linkedin || '',
          portfolio: profile.links?.portfolio || '',
        },
        capstone_project: {
          title: profile.capstone_project?.title || '',
          description: profile.capstone_project?.description || '',
          url: profile.capstone_project?.url || '',
        },
        theme_id: profile.theme_id || 'minimal',
      });
      setIsNewProfile(false);
    } else {
      setIsNewProfile(true);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('links.')) {
      const linkKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        links: { ...prev.links, [linkKey]: value },
      }));
    } else if (name.startsWith('capstone.')) {
      const capstoneKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        capstone_project: { ...prev.capstone_project, [capstoneKey]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleThemeSelect = (themeId) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (theme?.premium && !profile?.is_premium) {
      setError('This theme requires a premium account');
      return;
    }
    setFormData(prev => ({ ...prev, theme_id: themeId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Validation
    if (!formData.username || formData.username.trim() === '') {
      setError('Username is required');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        username: formData.username.trim(),
        full_name: formData.full_name?.trim() || null,
        bio: formData.bio?.trim() || null,
        links: {
          github: formData.links.github?.trim() || '',
          linkedin: formData.links.linkedin?.trim() || '',
          portfolio: formData.links.portfolio?.trim() || '',
        },
        capstone_project: {
          title: formData.capstone_project.title?.trim() || '',
          description: formData.capstone_project.description?.trim() || '',
          url: formData.capstone_project.url?.trim() || '',
        },
        theme_id: formData.theme_id || 'minimal',
      };

      console.log('Saving profile:', { isNewProfile, payload });

      let result;
      if (isNewProfile) {
        result = await api.createProfile(payload);
      } else {
        result = await api.updateProfile(payload);
      }

      console.log('Profile saved:', result);

      setProfile(result);
      setIsNewProfile(false);
      setSuccess('Profile saved successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">StudentLink</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {formData.username && (
              <Link
                to={`/p/${formData.username}`}
                target="_blank"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isNewProfile ? 'Create Your Profile' : 'Edit Your Profile'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.email && `Signed in as ${user.email}`}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="johndoe"
                  required
                  pattern="[a-zA-Z0-9_]+"
                  title="Only letters, numbers, and underscores"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your profile URL: /p/{formData.username || 'username'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="CS student passionate about web development..."
                  maxLength={300}
                />
                <p className="mt-1 text-xs text-gray-500 text-right">
                  {formData.bio.length}/300
                </p>
              </div>
            </div>
          </section>

          {/* Links Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Social Links
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </label>
                <input
                  type="url"
                  name="links.github"
                  value={formData.links.github}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="links.linkedin"
                  value={formData.links.linkedin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="links.portfolio"
                  value={formData.links.portfolio}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </section>

          {/* Capstone Project Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Capstone Project
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  name="capstone.title"
                  value={formData.capstone_project.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="AI-Powered Study Assistant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="capstone.description"
                  value={formData.capstone_project.description}
                  onChange={handleChange}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="A brief description of your capstone project..."
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project URL
                </label>
                <input
                  type="url"
                  name="capstone.url"
                  value={formData.capstone_project.url}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          </section>

          {/* Theme Selection */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Profile Theme
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    formData.theme_id === theme.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-20 rounded-lg ${theme.preview} border border-gray-200 mb-3`}>
                    {theme.id === 'midnight' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-xs">Dark Mode</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{theme.name}</span>
                    {theme.premium && (
                      <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                  {formData.theme_id === theme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {!profile?.is_premium && (
              <p className="mt-4 text-sm text-gray-500">
                🔒 Upgrade to Premium to unlock dark mode and additional themes.
              </p>
            )}
          </section>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 min-w-[150px] justify-center"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
