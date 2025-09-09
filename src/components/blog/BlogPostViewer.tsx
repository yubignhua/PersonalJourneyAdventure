'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import MarkdownPreview from './MarkdownPreview';

interface BlogPostViewerProps {
  post: BlogPost;
}

export default function BlogPostViewer({ post }: BlogPostViewerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you'd save this to localStorage or user preferences
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Post Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-slate-700">
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/blog"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
          
          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getReadingTime(post.content)} min read</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.view_count} views</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-800 text-blue-400 text-sm rounded-full border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <motion.button
                onClick={handleBookmark}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${isBookmarked 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }
                `}
              >
                <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </motion.button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Content */}
          <MarkdownPreview content={post.content} />

          {/* Code Examples Section */}
          {post.code_examples && post.code_examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Interactive Code Examples
              </h2>
              
              <div className="space-y-6">
                {post.code_examples.map((example, index) => (
                  <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
                      <span className="text-sm font-medium text-gray-300">
                        {example.language}
                      </span>
                      <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Run Code
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm text-gray-300">
                        {example.code}
                      </code>
                    </pre>
                    {example.description && (
                      <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700">
                        <p className="text-sm text-gray-400">{example.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Challenge Section */}
          {post.challenge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Challenge Time!
                </h2>
                
                <p className="text-gray-300 mb-4">{post.challenge.question}</p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your answer..."
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Submit
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-400">
                  💡 Stuck? There&apos;s a hint available after your first attempt.
                </div>
              </div>
            </motion.div>
          )}

          {/* Interaction Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Post Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {post.interaction_stats.code_executions}
                </div>
                <div className="text-sm text-gray-400">Code Executions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {post.interaction_stats.challenge_attempts}
                </div>
                <div className="text-sm text-gray-400">Challenge Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {post.interaction_stats.challenge_successes}
                </div>
                <div className="text-sm text-gray-400">Challenge Successes</div>
              </div>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </div>
  );
}