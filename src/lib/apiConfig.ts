/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://railji-business.onrender.com';

export const API_ENDPOINTS = {
  DEPARTMENTS: `${API_BASE_URL}/business/v1/departments`,
  PAPERS: (deptId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}`,
  PAPER_QUESTIONS: (deptId: string, paperId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}/${paperId}`,
} as const;

export default API_ENDPOINTS;
