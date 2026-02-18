/**
 * Public Profile Page - The Link-in-Bio Page
 * Accessible at /p/[username]
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import {
  User,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  Briefcase,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Helper to ensure URL has protocol
const ensureProtocol = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('PublicProfile rendering, username:', username);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Fetching profile for:', username);
      try {
        const data = await api.getPublicProfile(username);
        console.log('Profile data received:', data);
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">
            The profile you're looking for doesn't exist or may have been removed.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Safety check - if profile is null after loading, show error
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Something went wrong loading the profile.</p>
          <Link to="/" className="mt-4 text-blue-600 hover:underline inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isMinimal = profile?.theme_id === 'minimal' || !profile?.theme_id;
  const isMidnight = profile?.theme_id === 'midnight';

  // Theme-based classes
  const themeClasses = isMidnight
    ? {
        bg: 'bg-gray-950 min-h-screen',
        card: 'bg-gray-900/80 backdrop-blur-sm border border-gray-800',
        text: 'text-white',
        textMuted: 'text-gray-400',
        link: 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white',
        accent: 'text-indigo-400',
        badge: 'bg-indigo-500/20 text-indigo-300',
      }
    : {
        bg: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen',
        card: 'bg-white shadow-xl',
        text: 'text-gray-900',
        textMuted: 'text-gray-600',
        link: 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-md hover:shadow-lg',
        accent: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700',
      };

  return (
    <div className={themeClasses.bg}>
      {/* Background decoration for midnight theme */}
      {isMidnight && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative max-w-lg mx-auto px-4 py-12">
        {/* Profile Card */}
        <div className={`${themeClasses.card} rounded-3xl p-8`}>
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isMidnight 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Name & Bio */}
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
              {profile.full_name || `@${profile.username}`}
            </h1>
            {profile.full_name && (
              <p className={`${themeClasses.textMuted} mt-1`}>@{profile.username}</p>
            )}
            {profile.bio && (
              <p className={`${themeClasses.textMuted} mt-4 leading-relaxed`}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-3 mb-8">
            {profile.links?.github && (
              <a
                href={ensureProtocol(profile.links.github)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${themeClasses.link}`}
              >
                <Github className="w-6 h-6" />
                <span className="flex-1 font-medium">GitHub</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            )}

            {profile.links?.linkedin && (
              <a
                href={ensureProtocol(profile.links.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${themeClasses.link}`}
              >
                <Linkedin className="w-6 h-6" />
                <span className="flex-1 font-medium">LinkedIn</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            )}

            {profile.links?.portfolio && (
              <a
                href={ensureProtocol(profile.links.portfolio)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${themeClasses.link}`}
              >
                <Globe className="w-6 h-6" />
                <span className="flex-1 font-medium">Portfolio</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            )}
          </div>

          {/* Capstone Project */}
          {profile.capstone_project?.title && (
            <div className={`rounded-xl p-5 ${isMidnight ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className={`w-5 h-5 ${themeClasses.accent}`} />
                <span className={`text-sm font-semibold uppercase tracking-wide ${themeClasses.accent}`}>
                  Capstone Project
                </span>
              </div>
              <h3 className={`font-bold text-lg ${themeClasses.text}`}>
                {profile.capstone_project.title}
              </h3>
              {profile.capstone_project.description && (
                <p className={`${themeClasses.textMuted} mt-2 text-sm leading-relaxed`}>
                  {profile.capstone_project.description}
                </p>
              )}
              {profile.capstone_project.url && (
                <a
                  href={ensureProtocol(profile.capstone_project.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 mt-4 text-sm font-medium ${themeClasses.accent} hover:underline`}
                >
                  View Project
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm ${themeClasses.textMuted} hover:${themeClasses.accent} transition-colors`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center ${
              isMidnight ? 'bg-indigo-600' : 'bg-blue-600'
            }`}>
              <User className="w-3 h-3 text-white" />
            </div>
            Made with StudentLink
          </Link>
        </div>
      </div>
    </div>
  );
}
