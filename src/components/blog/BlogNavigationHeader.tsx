'use client';

import QuickNavigation from '@/components/layout/QuickNavigation';
import { useAuth } from '@/lib/auth-context';

interface BlogNavigationHeaderProps {
  title?: string;
  currentPage?: 'home' | 'projects' | 'blog' | 'about';
}

export default function BlogNavigationHeader({ 
  title = "📚 Tech Blog", 
  currentPage = "blog" 
}: BlogNavigationHeaderProps) {
  const { isAuthenticated, user } = useAuth();
  // /Users/yubh/workspace/personalSite/journeyAdventure/src/components/blog/BlogNavigationHeader.tsx

  return (
    <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 BlogNavigationHeader">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user?.role === 'admin' && (
              <>
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
              </>
            )}
           
            <QuickNavigation currentPage={currentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}