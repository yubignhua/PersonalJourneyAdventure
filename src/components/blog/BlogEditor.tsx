'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarkdownPreview from './MarkdownPreview';

interface BlogPost {
    id?: number;
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    code_examples: Array<{
        language: string;
        code: string;
        description?: string;
    }>;
    challenge?: {
        question: string;
        answer: string;
        hint: string;
    } | null;
    status: 'draft' | 'published';
    featured: boolean;
}

interface BlogEditorProps {
    initialData?: BlogPost;
    onSave: (data: BlogPost) => void;
    isLoading: boolean;
    mode: 'create' | 'edit';
}

export default function BlogEditor({ initialData, onSave, isLoading, mode }: BlogEditorProps) {
    const [formData, setFormData] = useState<BlogPost>({
        title: '',
        content: '',
        excerpt: '',
        tags: [],
        code_examples: [],
        challenge: null,
        status: 'draft',
        featured: false,
        ...initialData
    });

    const [tagInput, setTagInput] = useState('');
    const [showChallenge, setShowChallenge] = useState(false);
    const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
    const [codeExample, setCodeExample] = useState({
        language: 'javascript',
        code: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setShowChallenge(!!initialData.challenge);
        }
    }, [initialData]);

    const handleInputChange = (field: keyof BlogPost, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            handleInputChange('tags', [...formData.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    const handleAddCodeExample = () => {
        if (codeExample.code.trim()) {
            handleInputChange('code_examples', [
                ...formData.code_examples,
                { ...codeExample }
            ]);
            setCodeExample({ language: 'javascript', code: '', description: '' });
        }
    };

    const handleRemoveCodeExample = (index: number) => {
        handleInputChange('code_examples',
            formData.code_examples.filter((_, i) => i !== index)
        );
    };

    const handleChallengeChange = (field: string, value: string) => {
        if (!showChallenge) return;

        handleInputChange('challenge', {
            ...formData.challenge,
            [field]: value
        } as any);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('Title and content are required');
            return;
        }

        // Auto-generate excerpt if not provided
        const finalData = {
            ...formData,
            excerpt: formData.excerpt || formData.content.substring(0, 200) + '...',
            challenge: showChallenge ? formData.challenge : null
        };

        onSave(finalData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <label className="block text-white text-sm font-medium mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter post title..."
                        required
                    />
                </div>

                {/* Content */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-white text-sm font-medium">
                            Content *
                        </label>
                        <div className="flex space-x-1 bg-black/20 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setEditorMode('write')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${editorMode === 'write' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                            >
                                Write
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditorMode('preview')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${editorMode === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}
                            >
                                Preview
                            </button>
                        </div>
                    </div>

                    {editorMode === 'write' ? (
                        <textarea
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            rows={15}
                            className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                            placeholder="Write your blog post content here... (Markdown supported)"
                            required
                        />
                    ) : (
                        <div className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white min-h-[300px]">
                            <MarkdownPreview content={formData.content} />
                        </div>
                    )}
                </div>

                {/* Excerpt */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <label className="block text-white text-sm font-medium mb-2">
                        Excerpt
                    </label>
                    <textarea
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description of the post (auto-generated if empty)"
                    />
                </div>

                {/* Tags */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <label className="block text-white text-sm font-medium mb-2">
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="text-white hover:text-red-300"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            className="flex-1 px-4 py-2 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add a tag..."
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Code Examples */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <label className="block text-white text-sm font-medium mb-4">
                        Code Examples
                    </label>

                    {/* Existing code examples */}
                    {formData.code_examples.map((example, index) => (
                        <div key={index} className="mb-4 p-4 bg-black/20 rounded-lg border border-white/20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-300">
                                    {example.language} - {example.description || 'No description'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCodeExample(index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            </div>
                            <pre className="text-sm text-gray-300 bg-black/40 p-2 rounded overflow-x-auto">
                                {example.code}
                            </pre>
                        </div>
                    ))}

                    {/* Add new code example */}
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <select
                                value={codeExample.language}
                                onChange={(e) => setCodeExample(prev => ({ ...prev, language: e.target.value }))}
                                className="px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                            </select>
                            <input
                                type="text"
                                value={codeExample.description}
                                onChange={(e) => setCodeExample(prev => ({ ...prev, description: e.target.value }))}
                                className="flex-1 px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Description (optional)"
                            />
                        </div>
                        <textarea
                            value={codeExample.code}
                            onChange={(e) => setCodeExample(prev => ({ ...prev, code: e.target.value }))}
                            rows={6}
                            className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="Enter your code here..."
                        />
                        <button
                            type="button"
                            onClick={handleAddCodeExample}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            Add Code Example
                        </button>
                    </div>
                </div>

                {/* Challenge Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-white text-sm font-medium">
                            Interactive Challenge
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowChallenge(!showChallenge)}
                            className={`px-4 py-2 rounded-lg transition-colors ${showChallenge
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                        >
                            {showChallenge ? 'Remove Challenge' : 'Add Challenge'}
                        </button>
                    </div>

                    {showChallenge && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Question
                                </label>
                                <textarea
                                    value={formData.challenge?.question || ''}
                                    onChange={(e) => handleChallengeChange('question', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="What question do you want to ask readers?"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Answer
                                </label>
                                <input
                                    type="text"
                                    value={formData.challenge?.answer || ''}
                                    onChange={(e) => handleChallengeChange('answer', e.target.value)}
                                    className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Correct answer"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Hint
                                </label>
                                <input
                                    type="text"
                                    value={formData.challenge?.hint || ''}
                                    onChange={(e) => handleChallengeChange('hint', e.target.value)}
                                    className="w-full px-4 py-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Hint for wrong answers"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <label className="block text-white text-sm font-medium mb-4">
                        Post Settings
                    </label>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={formData.status === 'draft'}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="text-blue-600"
                                />
                                <span className="text-white">Save as Draft</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="published"
                                    checked={formData.status === 'published'}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="text-blue-600"
                                />
                                <span className="text-white">Publish Now</span>
                            </label>
                        </div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => handleInputChange('featured', e.target.checked)}
                                className="text-blue-600"
                            />
                            <span className="text-white">Featured Post</span>
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                    >
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}