'use client';

type QuestionStatus = 'current' | 'answered' | 'marked' | 'not-answered' | 'not-visited';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: (number | null)[];
  markedForReview: boolean[];
  visitedQuestions: Set<number>;
  onQuestionJump: (index: number) => void;
  showMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function QuestionPalette({
  totalQuestions,
  currentQuestionIndex,
  answers,
  markedForReview,
  visitedQuestions,
  onQuestionJump,
  showMobile = false,
  onCloseMobile
}: QuestionPaletteProps) {
  const getQuestionStatus = (index: number): QuestionStatus => {
    if (index === currentQuestionIndex) return 'current';
    if (answers[index] !== null) return 'answered';
    if (markedForReview[index]) return 'marked';
    if (visitedQuestions.has(index)) return 'not-answered';
    return 'not-visited';
  };

  const getStatusColor = (status: QuestionStatus): string => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-600';
      case 'answered':
        return 'bg-emerald-500 text-white';
      case 'marked':
        return 'bg-amber-500 text-white';
      case 'not-answered':
        return 'bg-rose-500 text-white';
      case 'not-visited':
        return 'bg-stone-200 text-stone-600';
      default:
        return 'bg-stone-200 text-stone-600';
    }
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const markedCount = markedForReview.filter(Boolean).length;
  const skippedCount = answers.filter(a => a === null).length;

  const content = (
    <>
      {/* Stats Summary */}
      <div className="p-5 bg-stone-50 border-b border-stone-100">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-sky-50 rounded-xl p-3 border-2 border-sky-400 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-sky-600">{answeredCount}</p>
            <p className="text-xs text-sky-700 uppercase tracking-wide">Answered</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 border-2 border-stone-400 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-stone-600">{skippedCount}</p>
            <p className="text-xs text-stone-700 uppercase tracking-wide">Skipped</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border-2 border-amber-500 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-amber-600">{markedCount}</p>
            <p className="text-xs text-amber-700 uppercase tracking-wide">Review</p>
          </div>
        </div>
      </div>

      {/* Question Overview */}
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-xs text-stone-500 uppercase tracking-wide mb-3 font-medium text-center">Question Overview</p>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const status = getQuestionStatus(index);
            const isAnswered = answers[index] !== null;
            const isMarked = markedForReview[index];
            const isVisited = visitedQuestions.has(index);
            const isCurrent = index === currentQuestionIndex;
            
            let buttonStyle = 'border-2 border-stone-300 text-stone-600 bg-white';
            if (isCurrent) {
              // Current question: just blue ring outline
              buttonStyle = 'border-2 border-blue-500 bg-white text-stone-800 ring-2 ring-blue-300';
            } else if (isAnswered) {
              // Answered: light sky blue
              buttonStyle = 'border-2 border-sky-400 bg-sky-400 text-white';
            } else if (isMarked) {
              // Marked for review: amber/yellow
              buttonStyle = 'border-2 border-amber-500 bg-amber-500 text-white';
            } else if (isVisited) {
              // Visited but not answered (skipped): gray
              buttonStyle = 'border-2 border-stone-400 bg-stone-400 text-white';
            }

            return (
              <button
                key={index}
                onClick={() => {
                  onQuestionJump(index);
                  if (showMobile && onCloseMobile) {
                    onCloseMobile();
                  }
                }}
                className={`h-11 w-11 rounded-full font-semibold transition-all text-sm mx-auto ${buttonStyle}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-400 border-2 border-sky-400"></div>
            <span className="text-stone-600">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-stone-400 border-2 border-stone-400"></div>
            <span className="text-stone-600">Skipped</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-500"></div>
            <span className="text-stone-600">Mark of Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-500 ring-2 ring-blue-300"></div>
            <span className="text-stone-600">Current</span>
          </div>
        </div>
      </div>
    </>
  );

  // Mobile version - Drawer from right
  if (showMobile) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onCloseMobile}
      >
        <div 
          className="absolute top-0 right-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl flex flex-col animate-slide-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100 bg-stone-50">
            <button
              onClick={onCloseMobile}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 transition-colors"
            >
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center flex-1">
              <h3 className="font-bold text-stone-800">Question Palette</h3>
              <p className="text-xs text-stone-500">Question : {totalQuestions} Answered : {answeredCount}</p>
            </div>
            <div className="w-8"></div>
          </div>
          {content}
        </div>
      </div>
    );
  }

  // Desktop version - only render on desktop screens
  // On mobile, return null when drawer is closed
  return null;
}
