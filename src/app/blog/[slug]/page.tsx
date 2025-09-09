'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogPostViewer from '@/components/blog/BlogPostViewer';
import LoadingSpinner from '@/components/3d/LoadingSpinner';
import NavigationBar from '@/components/layout/NavigationBar';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/auth/LoginModal';
import { BlogPost } from '@/types/blog';

export default function BlogPostPage() {
  const params = useParams();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => setShowLoginModal(true);
  const handleRegister = () => setShowLoginModal(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/posts/${params.slug}`);
        const data = await response.json();

        if (data.success) {
          setPost(data.data);
        } else {
          setError(data.error || 'Failed to load blog post');
        }
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Blog post fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-300 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
          <a
            href="/blog"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <NavigationBar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={logout}
      />
      <BlogPostViewer post={post} />
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}