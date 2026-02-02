'use client';

import { useEffect, useRef } from 'react';

interface FilterSectionProps {
  activeTab: 'papers' | 'materials';
  // Papers filters
  selectedExamType?: string;
  selectedSubject?: string;
  mainExamTypes?: string[];
  allExamTypes?: string[];
  otherExamTypes?: string[];
  allSubjects?: string[];
  showOthersDropdown?: boolean;
  showSubjectsDropdown?: boolean;
  loadingPapers?: boolean;
  onExamTypeChange?: (type: string) => void;
  onSubjectChange?: (subject: string) => void;
  onToggleOthersDropdown?: () => void;
  onToggleSubjectsDropdown?: () => void;
  // Materials filters
  selectedMaterialType?: string;
  materialTypeOptions?: string[];
  onMaterialTypeChange?: (type: string) => void;
}

const materialTypes = {
  notes: { label: 'Study Notes' },
  book: { label: 'Books' },
  video: { label: 'Video Lectures' },
  guide: { label: 'Guides' },
};

export default function FilterSection({
  activeTab,
  selectedExamType,
  selectedSubject,
  mainExamTypes = [],
  allExamTypes = [],
  otherExamTypes = [],
  allSubjects = [],
  showOthersDropdown = false,
  showSubjectsDropdown = false,
  loadingPapers = false,
  onExamTypeChange,
  onSubjectChange,
  onToggleOthersDropdown,
  onToggleSubjectsDropdown,
  selectedMaterialType,
  materialTypeOptions = [],
  onMaterialTypeChange
}: FilterSectionProps) {
  const othersDropdownRef = useRef<HTMLDivElement>(null);
  const subjectsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (othersDropdownRef.current && !othersDropdownRef.current.contains(event.target as Node)) {
        if (showOthersDropdown && onToggleOthersDropdown) {
          onToggleOthersDropdown();
        }
      }
      if (subjectsDropdownRef.current && !subjectsDropdownRef.current.contains(event.target as Node)) {
        if (showSubjectsDropdown && onToggleSubjectsDropdown) {
          onToggleSubjectsDropdown();
        }
      }
    }

    if (showOthersDropdown || showSubjectsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOthersDropdown, showSubjectsDropdown, onToggleOthersDropdown, onToggleSubjectsDropdown]);

  if (activeTab === 'papers') {
    return (
      <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          {loadingPapers && (
            <div className="flex items-center justify-center py-2 mb-3">
              <div className="flex items-center gap-2 text-orange-600">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Loading papers...</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Full Paper Button */}
            <button
              onClick={() => {
                onExamTypeChange?.('All');
                if (showOthersDropdown && onToggleOthersDropdown) {
                  onToggleOthersDropdown();
                }
              }}
              className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedExamType === 'All' && selectedSubject === 'All'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              Previous Year
            </button>

            {/* Main Exam Type Buttons - Show first 4 */}
            {mainExamTypes.slice(0, 4).map((type) => {
              const isAvailable = allExamTypes.includes(type);
              if (!isAvailable) return null;
              return (
                <button
                  key={type}
                  onClick={() => {
                    onExamTypeChange?.(type);
                    if (showOthersDropdown && onToggleOthersDropdown) {
                      onToggleOthersDropdown();
                    }
                  }}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedExamType === type && selectedSubject === 'All'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {type}
                </button>
              );
            })}

            {/* Others Dropdown - Contains remaining exam types */}
            {otherExamTypes.length > 0 && (
              <div className="relative" ref={othersDropdownRef}>
                <button
                  onClick={() => {
                    onToggleOthersDropdown?.();
                    if (showSubjectsDropdown && onToggleSubjectsDropdown) {
                      onToggleSubjectsDropdown();
                    }
                  }}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 sm:gap-1.5 ${
                    otherExamTypes.includes(selectedExamType || '') && selectedSubject === 'All'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Others
                  <svg
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${
                      showOthersDropdown ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showOthersDropdown && (
                  <div className="absolute top-full mt-1.5 left-0 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-stone-200 py-1 sm:py-2 w-[140px] sm:w-[160px] lg:w-[180px] z-50 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                    {otherExamTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          onExamTypeChange?.(type);
                          onToggleOthersDropdown?.();
                        }}
                        className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 text-xxs sm:text-xs hover:bg-orange-50 transition-colors ${
                          selectedExamType === type
                            ? 'bg-orange-50 text-orange-700 font-medium'
                            : 'text-stone-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* General Subjects Dropdown - Pushed to the right */}
            {allSubjects.length > 0 && (
              <div className="relative ml-auto" ref={subjectsDropdownRef}>
                <button
                  onClick={() => {
                    onToggleSubjectsDropdown?.();
                    if (showOthersDropdown && onToggleOthersDropdown) {
                      onToggleOthersDropdown();
                    }
                  }}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 sm:gap-1.5 ${
                    selectedSubject !== 'All'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {selectedSubject === 'All' ? 'General' : selectedSubject}
                  <svg
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${
                      showSubjectsDropdown ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Subjects Dropdown Menu */}
                {showSubjectsDropdown && (
                  <div className="absolute top-full mt-1.5 right-0 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-stone-200 py-1 sm:py-2 w-[140px] sm:w-[160px] lg:w-[180px] z-50 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                    {allSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          onSubjectChange?.(subject);
                          onToggleSubjectsDropdown?.();
                        }}
                        className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 text-xxs sm:text-xs hover:bg-amber-50 transition-colors ${
                          selectedSubject === subject
                            ? 'bg-amber-50 text-amber-700 font-medium'
                            : 'text-stone-700'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Materials filter
  return (
    <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {materialTypeOptions.map((type) => (
            <button
              key={type}
              onClick={() => onMaterialTypeChange?.(type)}
              className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedMaterialType === type
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {type === 'All' ? 'All Materials' : materialTypes[type as keyof typeof materialTypes]?.label || type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
