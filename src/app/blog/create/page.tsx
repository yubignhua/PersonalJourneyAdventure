'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/blog/BlogEditor';
import QuickNavigation from '@/components/layout/QuickNavigation';

export default function CreateBlogPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (postData: any) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/blog/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const result = await response.json();
            if (result.success) {
                router.push(`/blog/${result.data.slug}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-bold text-white">✍️ Create New Post</h2>
                        </div>

                        <QuickNavigation currentPage="blog" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <BlogEditor
                    onSave={handleSave}
                    isLoading={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}