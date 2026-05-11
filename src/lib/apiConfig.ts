/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://railji-business.onrender.com';

export const API_ENDPOINTS = {
  DEPARTMENTS: `${API_BASE_URL}/business/v1/departments`,
  DEPARTMENT: (deptId: string) => `${API_BASE_URL}/business/v1/departments/${deptId}`,
  MATERIALS: (deptId: string) => `${API_BASE_URL}/business/v1/departments/${deptId}/materials`,
  TOP_PAPERS: `${API_BASE_URL}/business/v1/papers/top`,
  PAPERS: (deptId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}`,
  PAPER_QUESTIONS: (deptId: string, paperId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}/${paperId}`,
  PAPER_ANSWERS: (deptId: string, paperId: string) => `${API_BASE_URL}/business/v1/papers/${deptId}/${paperId}/answers`,
  START_EXAM: `${API_BASE_URL}/business/v1/exams/start`,
  SUBMIT_EXAM: `${API_BASE_URL}/business/v1/exams/submit`,
  EXAM_RESULT: (examId: string) => `${API_BASE_URL}/business/v1/exams/result/${examId}`,
  USERS: `${API_BASE_URL}/business/v1/users`,
  USERS_ME: `${API_BASE_URL}/business/v1/users/me`,

  // Stats / History API endpoints
  USER_EXAM_STATS: (userId: string) => `${API_BASE_URL}/business/v1/exams/stats/${userId}`,
  USER_EXAM_HISTORY: (userId: string, qs: string = '') => `${API_BASE_URL}/business/v1/exams/history/${userId}${qs}`,

  // Payment Plans API
  PAYMENT_PLANS: `${API_BASE_URL}/business/v1/payments/plans`,
  PAYMENT_ORDER: `${API_BASE_URL}/business/v1/payments/order`,
  PAYMENT_VERIFY: `${API_BASE_URL}/business/v1/payments/verify`,
  
  // Subscriptions API
  USER_SUBSCRIPTIONS: `${API_BASE_URL}/business/v1/payments/subscriptions`
} as const;

export default API_ENDPOINTS;
