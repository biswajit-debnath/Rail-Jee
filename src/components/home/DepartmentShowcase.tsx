'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';

interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface DepartmentShowcaseProps {
  dataReady?: boolean;
}

// Icon mapping for departments
const iconMapping: { [key: string]: string } = {
  building: '🏗️',
  wrench: '⚙️',
  bolt: '⚡',
  currency: '💼',
  users: '👥',
  train: '🚂',
  signal: '📡',
  metro: '🚇'
};

export default function DepartmentShowcase({ dataReady = false }: DepartmentShowcaseProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(!dataReady);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Check cache (should be populated by home page)
        const cached = departmentCache.get();
        if (cached?.departments) {
          // Map cached data to display format
          const mappedDepts = cached.departments.map((dept: any) => ({
            id: dept.slug || dept.departmentId || dept.id,
            name: dept.name || dept.fullName,
            icon: iconMapping[dept.icon] || '📚',
            description: dept.description || 'Department'
          }));
          setDepartments(mappedDepts);
          setIsLoading(false);
          return;
        }

        // If dataReady is true but no cache, wait a bit (race condition)
        if (dataReady) {
          setTimeout(fetchDepartments, 100);
          return;
        }

        // Fetch from API if no cache
        const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const apiData = await response.json();
        const departmentsData = apiData.data || [];

        // Cache the data
        departmentCache.set({
          departments: departmentsData
        });

        // Map to display format
        const mappedDepts = departmentsData.map((dept: any) => ({
          id: dept.slug || dept.departmentId || dept.id,
          name: dept.name || dept.fullName,
          icon: iconMapping[dept.icon] || '📚',
          description: dept.description || 'Department'
        }));

        setDepartments(mappedDepts);
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [dataReady]);

  return (
    <section className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-3 sm:mb-4 lg:mb-6">
            All Departments, One Platform
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed px-4">
            Whether you&apos;re in technical, commercial, or administrative roles, find exam papers and resources specific to your department.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-stone-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-pulse"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-200 rounded mb-2 sm:mb-3"></div>
                <div className="h-4 bg-stone-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-stone-200 rounded w-full"></div>
              </div>
            ))
          ) : (
            departments.map((dept, index) => (
            <button
              key={dept.id}
              onClick={() => router.push(`/departments/${dept.id}`)}
              className="group relative bg-gradient-to-br from-stone-50 to-stone-100/50 hover:from-white hover:to-stone-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-left border border-stone-200/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">{dept.icon}</div>
              <h3 className="font-bold text-stone-900 mb-0.5 sm:mb-1 text-xs sm:text-sm lg:text-base leading-tight">
                {dept.name}
              </h3>
              <p className="text-xs text-stone-500 leading-snug">
                {dept.description}
              </p>
              
              {/* Arrow indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/departments')}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Browse All Departments
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
