'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/blog/BlogEditor';
import NavigationBar from '@/components/layout/NavigationBar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiService } from '@/lib/api-service';
import { useAuth } from '@/lib/auth-context';

export default function CreateBlogPage() {
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => console.log('Login handled by NavigationBar');
    const handleRegister = () => console.log('Register handled by NavigationBar');

    const handleSave = async (postData: any) => {
        setIsLoading(true);
        try {
            const result = await apiService.createPost(postData);
            
            if (result.success) {
                router.push(`/blog/${result.data.slug}`);
            } else {
                throw new Error(result.error || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute adminOnly={true}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <NavigationBar
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onLogout={logout}
                />

                <div className="container mx-auto px-4 pt-24">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">✍️ Create New Post</h1>
                        <p className="text-gray-300">Share your knowledge and insights with the world</p>
                    </div>
                    
                    <BlogEditor
                        onSave={handleSave}
                        isLoading={isLoading}
                        mode="create"
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}