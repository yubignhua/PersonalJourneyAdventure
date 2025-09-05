'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import QuickNavigation from '@/components/layout/QuickNavigation';
import LoadingSpinner from '@/components/3d/LoadingSpinner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    published_at: string;
    created_at: string;
    updated_at: string;
    view_count: number;
    tags: string[];
}

export default function ManageBlogPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [drafts, setDrafts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

    useEffect(() => {
        fetchPosts();
        fetchDrafts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blog/posts?limit=50');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setPosts(result.data.posts);
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchDrafts = async () => {
        try {
            const response = await fetch('/api/blog/drafts?limit=50');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setDrafts(result.data.posts);
                }
            }
        } catch (error) {
            console.error('Error fetching drafts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (postId: number) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/blog/posts/${postId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Refresh the lists
                fetchPosts();
                fetchDrafts();
                alert('Post deleted successfully');
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    const PostCard = ({ post }: { post: BlogPost }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/30 transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                        {post.featured && (
                            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                                ⭐ Featured
                            </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published'
                            ? 'bg-green-600 text-white'
                            : post.status === 'draft'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-600 text-white'
                            }`}>
                            {post.status}
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags?.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded"
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded">
                                +{post.tags.length - 3} more
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                        <div>Created: {new Date(post.created_at).toLocaleDateString()}</div>
                        <div>Updated: {new Date(post.updated_at).toLocaleDateString()}</div>
                        {post.published_at && (
                            <div>Published: {new Date(post.published_at).toLocaleDateString()}</div>
                        )}
                        {post.status === 'published' && (
                            <div>Views: {post.view_count}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    {post.status === 'published' && (
                        <button
                            onClick={() => router.push(`/blog/${post.slug}`)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                            👁️ View
                        </button>
                    )}
                    <button
                        onClick={() => router.push(`/blog/edit/${post.slug}`)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                        ✏️ Edit
                    </button>
                </div>
                <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                    🗑️ Delete
                </button>
            </div>
        </motion.div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly={true}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-bold text-white">📝 Manage Blog Posts</h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/blog/create')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                                ✍️ New Post
                            </button>
                            <QuickNavigation currentPage="blog" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-1 w-fit">
                    <button
                        onClick={() => setActiveTab('published')}
                        className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'published'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Published ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('drafts')}
                        className={`px-6 py-2 rounded-md transition-colors ${activeTab === 'drafts'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Drafts ({drafts.length})
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === 'published' ? (
                        posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-white mb-2">No published posts yet</h3>
                                <p className="text-gray-400 mb-6">Create your first blog post to get started!</p>
                                <button
                                    onClick={() => router.push('/blog/create')}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    ✍️ Create First Post
                                </button>
                            </div>
                        )
                    ) : (
                        drafts.length > 0 ? (
                            drafts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📄</div>
                                <h3 className="text-xl font-semibold text-white mb-2">No drafts</h3>
                                <p className="text-gray-400 mb-6">All your posts are published or you haven&apos;t started any drafts yet.</p>
                                <button
                                    onClick={() => router.push('/blog/create')}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    ✍️ Create New Draft
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}