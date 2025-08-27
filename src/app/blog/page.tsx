'use client';

import { Suspense } from 'react';
import BlogTimeline from '@/components/blog/BlogTimeline';
import LoadingSpinner from '@/components/3d/LoadingSpinner';
import QuickNavigation from '@/components/layout/QuickNavigation';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-white">📚 Tech Blog</h2>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/blog/manage'}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                📝 Manage
              </button>
              <button
                onClick={() => window.location.href = '/blog/create'}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                ✍️ New Post
              </button>
              <QuickNavigation currentPage="blog" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
    </div>
  );
}