'use client';

import { Suspense } from 'react';
import BlogTimeline from '@/components/blog/BlogTimeline';
import LoadingSpinner from '@/components/3d/LoadingSpinner';
import NavigationBar from '@/components/layout/NavigationBar';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/auth/LoginModal';
import { useState } from 'react';

export default function BlogPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = () => setShowLoginModal(true);
  const handleRegister = () => setShowLoginModal(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <NavigationBar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={logout}
      />

      <div className="container mx-auto px-4 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tech Time Machine
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Journey through my technical adventures, discoveries, and insights.
            Each post is an interactive experience with code sandboxes and challenges.
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <BlogTimeline />
        </Suspense>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}