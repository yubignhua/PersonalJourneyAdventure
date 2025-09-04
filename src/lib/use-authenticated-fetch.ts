import { useAuth } from '@/lib/auth-context';

export const useAuthenticatedFetch = () => {
  const { token } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid, redirect to login
      window.location.href = '/';
      return null;
    }

    return response;
  };

  return { fetchWithAuth };
};