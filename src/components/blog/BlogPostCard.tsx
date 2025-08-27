'use client';

import { motion } from 'framer-motion';
import { BlogPostListItem } from '@/types/blog';
import Link from 'next/link';

interface BlogPostCardProps {
  post: BlogPostListItem;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
              <span>•</span>
              <span>{getReadingTime(post.excerpt || '')} min read</span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-700 text-xs text-gray-300 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-700 text-xs text-gray-400 rounded-md">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Interactive Content
            </div>
            
            <motion.div
              className="text-blue-400 group-hover:text-blue-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}