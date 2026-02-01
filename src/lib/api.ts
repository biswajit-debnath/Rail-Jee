// API utilities for Rail-Jee

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred' };
  }
}

// Types
export interface TopPaper {
  _id: string;
  name: string;
  department: string;
  departmentId: string;
  totalQuestions: number;
  duration: number;
  attempts: number;
  avgScore: number;
}

// API Functions
export async function getTopPapers(limit: number = 6): Promise<TopPaper[]> {
  const response = await fetchApi<{ success: boolean; data: TopPaper[] }>(`/api/papers/top?limit=${limit}`);
  return response.data?.data || [];
}
