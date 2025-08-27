'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogEditor from '@/components/blog/BlogEditor';
import QuickNavigation from '@/components/layout/QuickNavigation';
import LoadingSpinner from '@/components/3d/LoadingSpinner';

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPost, setIsLoadingPost] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // First get the post by slug to get the full data
                const response = await fetch(`/api/blog/posts/${params.slug}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }
                const result = await response.json();
                if (result.success) {
                    setPost(result.data);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                alert('Failed to load post. Redirecting to blog...');
                router.push('/blog');
            } finally {
                setIsLoadingPost(false);
            }
        };

        if (params.slug) {
            fetchPost();
        }
    }, [params.slug, router]);

    const handleSave = async (postData: any) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/blog/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const result = await response.json();
            if (result.success) {
                router.push(`/blog/${result.data.slug}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/blog/posts/${post.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            const result = await response.json();
            if (result.success) {
                alert('Post deleted successfully');
                router.push('/blog');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    if (isLoadingPost) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Post not found</h2>
                    <button
                        onClick={() => router.push('/blog')}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-bold text-white">✏️ Edit Post</h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                            >
                                🗑️ Delete
                            </button>
                            <QuickNavigation currentPage="blog" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <BlogEditor
                    initialData={post}
                    onSave={handleSave}
                    isLoading={isLoading}
                    mode="edit"
                />
            </div>
        </div>
    );
}