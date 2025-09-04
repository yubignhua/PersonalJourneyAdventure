// API service for backend requests
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

class ApiService {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${backendUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth API
  async login(credentials: { username: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Blog API
  async getPosts(params?: { page?: number; limit?: number; tag?: string; year?: number; month?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/api/blog/posts${queryString}`);
  }

  async getPost(slug: string) {
    return this.request(`/api/blog/posts/${slug}`);
  }

  async createPost(postData: any) {
    return this.request('/api/blog/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, postData: any) {
    return this.request(`/api/blog/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id: string) {
    return this.request(`/api/blog/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getPostForEdit(id: string) {
    return this.request(`/api/blog/posts/${id}/edit`);
  }

  async getDrafts(params?: { page?: number; limit?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/api/blog/drafts${queryString}`);
  }

  async getTags() {
    return this.request('/api/blog/tags');
  }

  async getTimeline() {
    return this.request('/api/blog/timeline');
  }

  async validateChallenge(postId: string, answer: string) {
    return this.request('/api/blog/challenge/validate', {
      method: 'POST',
      body: JSON.stringify({ postId, answer }),
    });
  }

  async executeCode(postId: string, code: string, language: string) {
    return this.request('/api/blog/code-execution', {
      method: 'POST',
      body: JSON.stringify({ postId, code, language }),
    });
  }
}

export const apiService = new ApiService();