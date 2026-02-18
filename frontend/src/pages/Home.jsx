/**
 * Home/Landing Page
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">StudentLink</span>
        </div>
        
        <nav className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link to="/login" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Built for Students, by Students
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Your Professional{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Link-in-Bio
            </span>
            {' '}Page
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Showcase your GitHub, LinkedIn, portfolio, and capstone project all in one beautiful page.
            Perfect for networking, job applications, and sharing your work with recruiters.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              Create Your Page
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/p/demo"
              className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
            >
              View Demo Profile
            </Link>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 transform -rotate-1"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Jane Student</h3>
              <p className="text-gray-500">@janestudent</p>
              <p className="mt-3 text-gray-600 text-sm">
                CS Senior at MIT | Full-Stack Developer | Open Source Enthusiast
              </p>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Github className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">GitHub</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">LinkedIn</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Portfolio</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-2">
                <Briefcase className="w-4 h-4" />
                CAPSTONE PROJECT
              </div>
              <p className="font-semibold text-gray-900">AI Study Assistant</p>
              <p className="text-gray-600 text-sm mt-1">
                An ML-powered app that helps students study smarter.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quick Setup
            </h3>
            <p className="text-gray-600">
              Create your professional link page in under 5 minutes. No coding required.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your data is protected with enterprise-grade security powered by Supabase.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Premium Themes
            </h3>
            <p className="text-gray-600">
              Stand out with beautiful themes including our stunning Dark Mode design.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-12 mt-20 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">StudentLink</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 StudentLink. Built with ❤️ for students.
          </p>
        </div>
      </footer>
    </div>
  );
}
