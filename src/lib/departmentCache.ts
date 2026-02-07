// Department cache management using sessionStorage

interface CachedDepartmentData {
  departments: any[];
  generalDeptId?: string;
  timestamp: number;
}

const CACHE_KEY = 'railji_departments_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const departmentCache = {
  /**
   * Store departments data in sessionStorage
   */
  set(data: { departments: any[]; generalDeptId?: string }): void {
    try {
      const cached = this.get();
      const cacheData: CachedDepartmentData = {
        departments: data.departments,
        generalDeptId: data.generalDeptId || cached?.generalDeptId,
        timestamp: Date.now()
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache departments:', error);
    }
  },

  /**
   * Get departments data from sessionStorage
   * Returns null if cache is empty or expired
   */
  get(): CachedDepartmentData | null {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data: CachedDepartmentData = JSON.parse(cached);
      
      // Check if cache is expired
      const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
      if (isExpired) {
        this.clear();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to read departments cache:', error);
      return null;
    }
  },

  /**
   * Find a specific department by slug from cache
   */
  findDepartment(slug: string): any | null {
    const cached = this.get();
    if (!cached) return null;

    return cached.departments.find((dept: any) => 
      dept.slug === slug || 
      dept.id === slug ||
      dept.departmentId === slug
    );
  },

  /**
   * Get general department ID from cache
   */
  getGeneralDeptId(): string | null {
    const cached = this.get();
    return cached?.generalDeptId || null;
  },

  /**
   * Set general department ID in cache
   */
  setGeneralDeptId(generalDeptId: string): void {
    try {
      const cached = this.get();
      if (cached) {
        const cacheData: CachedDepartmentData = {
          ...cached,
          generalDeptId,
          timestamp: Date.now()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }
    } catch (error) {
      console.error('Failed to set generalDeptId:', error);
    }
  },

  /**
   * Clear the cache
   */
  clear(): void {
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear departments cache:', error);
    }
  }
};
