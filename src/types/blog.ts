export interface CodeExample {
    language: string;
    code: string;
    description?: string;
}

export interface Challenge {
    question: string;
    answer: string;
    hint?: string;
}

export interface InteractionStats {
    code_executions: number;
    challenge_attempts: number;
    challenge_successes: number;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    code_examples: CodeExample[];
    challenge?: Challenge;
    published_at: string;
    tags: string[];
    view_count: number;
    interaction_stats: InteractionStats;
    featured: boolean;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface BlogPostListItem {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    published_at: string;
    tags: string[];
}

export interface TimelineData {
    [year: string]: {
        [month: string]: BlogPostListItem[];
    };
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface BlogPostsResponse {
    posts: BlogPostListItem[];
    pagination: PaginationInfo;
}

export interface Tag {
    name: string;
    count: number;
}

export interface CodeExecutionResult {
    output: string;
    executionTime: number;
    success: boolean;
}

export interface ChallengeValidationResult {
    correct: boolean;
    hint?: string;
}