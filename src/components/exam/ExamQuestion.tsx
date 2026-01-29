'use client';

import { useState } from 'react';

interface Question {
  id: number;
  question: {
    en: string;
    hi: string;
  };
  options: {
    en: string[];
    hi: string[];
  };
  extras?: Array<{
    en: string;
    hi: string;
  }>;
  correctAnswer: number;
}

interface ExamQuestionProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (optionIndex: number) => void;
  markedForReview?: boolean;
  onToggleMarkForReview?: () => void;
}

export default function ExamQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  markedForReview = false,
  onToggleMarkForReview
}: ExamQuestionProps) {
  // const [showExtras, setShowExtras] = useState(true);

  return (
    <div className="w-full">
      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Question Header with Flag Button */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-lg">
                {questionIndex + 1}
              </span>
              <div>
                <p className="text-sm opacity-90">Question {questionIndex + 1} of {totalQuestions}</p>
                <p className="text-xs opacity-75">+1 for correct, -0.33 for wrong</p>
              </div>
            </div>
            {onToggleMarkForReview && (
              <button
                onClick={onToggleMarkForReview}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  markedForReview
                    ? 'bg-amber-400 text-amber-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <svg className="w-4 h-4" fill={markedForReview ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="hidden sm:inline">{markedForReview ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="p-5 sm:p-6 border-b border-stone-100">
          <p className="text-base sm:text-lg font-semibold text-stone-800 leading-relaxed mb-3">
            {question.question.en}
          </p>
          {
            question.question.hi && (
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed rounded-lg font-hindi">
                {question.question.hi}
              </p>
            )
          }
          
        </div>

        {/* Extras Section - Collapsible & Compact */}
        {question.extras && question.extras.length > 0 && (
          <div className="border-b border-blue-100">
            {/* Collapsible Header */}
            {/* <button
              onClick={() => setShowExtras(!showExtras)}
              className="w-full px-4 py-2 bg-blue-50/50 flex items-center justify-between hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg 
                  className={`w-4 h-4 text-blue-600 transition-transform ${showExtras ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Additional Info ({question.extras.length})
                </span>
              </div>
              <span className="text-xs text-blue-500">
                {showExtras ? 'Hide' : 'Show'}
              </span>
            </button> */}
            
            {/* Extras Content - Compact Grid */}
            {(
              <div className="px-4 py-3 bg-gradient-to-b from-blue-50/30 to-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.extras.map((extra, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-lg px-3 py-2 border border-blue-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-stone-700 leading-relaxed line-clamp-3">
                            {extra.en}
                          </p>
                          {
                            extra.hi && (
                              <p className="text-md text-stone-700 leading-relaxed mt-4 line-clamp-3 font-hindi">
                                {extra.hi}
                              </p>
                            )
                          }
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Options */}
        <div className="p-4 sm:p-5 space-y-3">
          {question.options.en.map((option, optIndex) => {
            const optionLetter = String.fromCharCode(65 + optIndex);
            const isSelected = selectedAnswer === optIndex;

            return (
              <button
                key={optIndex}
                onClick={() => onSelectAnswer(optIndex)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all ${
                    isSelected
                      ? 'bg-teal-500 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {optionLetter}
                  </span>
                  <div className="flex-1 pt-1">
                    <p className={`text-sm sm:text-base font-medium mb-1 ${
                      isSelected ? 'text-teal-800' : 'text-stone-700'
                    }`}>
                      {option}
                    </p>
                    {
                      (question.options.hi && question.options.hi[optIndex]) && (
                        <p className="text-md sm:text-sm text-stone-600 font-hindi">
                          {question.options.hi[optIndex]}
                        </p>
                      )
                    }
                    
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
