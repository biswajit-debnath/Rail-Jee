// Exam attempt storage utilities for localStorage

export interface ExamAttempt {
  attemptNumber: number;
  examId: string;
  examName: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
  passed: boolean;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  answers: (number | null)[];
}

export interface UserExamData {
  [examId: string]: ExamAttempt[];
}

const STORAGE_KEY = 'rail_jee_exam_attempts';

/**
 * Get all exam attempts from localStorage
 */
export const getAllExamAttempts = (): UserExamData => {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading exam attempts from localStorage:', error);
    return {};
  }
};

/**
 * Get attempts for a specific exam
 */
export const getExamAttempts = (examId: string): ExamAttempt[] => {
  const allAttempts = getAllExamAttempts();
  return allAttempts[examId] || [];
};

/**
 * Get the total number of attempts for a specific exam
 */
export const getExamAttemptCount = (examId: string): number => {
  const attempts = getExamAttempts(examId);
  return attempts.length;
};

/**
 * Get the best score for a specific exam
 */
export const getBestScore = (examId: string): ExamAttempt | null => {
  const attempts = getExamAttempts(examId);
  if (attempts.length === 0) return null;
  
  return attempts.reduce((best, current) => 
    current.percentage > best.percentage ? current : best
  );
};

/**
 * Get the latest attempt for a specific exam
 */
export const getLatestAttempt = (examId: string): ExamAttempt | null => {
  const attempts = getExamAttempts(examId);
  if (attempts.length === 0) return null;
  
  return attempts[attempts.length - 1];
};

/**
 * Save a new exam attempt
 */
export const saveExamAttempt = (attempt: Omit<ExamAttempt, 'attemptNumber'>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const allAttempts = getAllExamAttempts();
    const examAttempts = allAttempts[attempt.examId] || [];
    
    const newAttempt: ExamAttempt = {
      ...attempt,
      attemptNumber: examAttempts.length + 1,
      date: new Date().toISOString(),
    };
    
    examAttempts.push(newAttempt);
    allAttempts[attempt.examId] = examAttempts;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allAttempts));
  } catch (error) {
    console.error('Error saving exam attempt to localStorage:', error);
  }
};

/**
 * Get user statistics across all exams
 */
export const getUserStats = () => {
  const allAttempts = getAllExamAttempts();
  
  let totalAttempts = 0;
  let totalPassed = 0;
  let totalQuestions = 0;
  let totalCorrect = 0;
  const examStats: { [examId: string]: { attempts: number; bestScore: number; passed: number } } = {};
  
  Object.entries(allAttempts).forEach(([examId, attempts]) => {
    totalAttempts += attempts.length;
    
    const passed = attempts.filter(a => a.passed).length;
    totalPassed += passed;
    
    attempts.forEach(attempt => {
      totalQuestions += attempt.totalQuestions;
      totalCorrect += attempt.correctAnswers;
    });
    
    const bestScore = attempts.reduce((max, a) => Math.max(max, a.percentage), 0);
    
    examStats[examId] = {
      attempts: attempts.length,
      bestScore,
      passed,
    };
  });
  
  return {
    totalAttempts,
    totalPassed,
    totalExams: Object.keys(allAttempts).length,
    overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
    examStats,
  };
};

/**
 * Clear all exam attempts (useful for testing or reset)
 */
export const clearAllAttempts = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing exam attempts from localStorage:', error);
  }
};

/**
 * Get leaderboard data (top attempts sorted by score)
 */
export const getLeaderboardData = (examId?: string, limit = 10): ExamAttempt[] => {
  let allAttempts: ExamAttempt[] = [];
  
  if (examId) {
    allAttempts = getExamAttempts(examId);
  } else {
    const allData = getAllExamAttempts();
    allAttempts = Object.values(allData).flat();
  }
  
  return allAttempts
    .sort((a, b) => {
      // Sort by percentage (descending), then by time taken (ascending)
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return a.timeTaken - b.timeTaken;
    })
    .slice(0, limit);
};
