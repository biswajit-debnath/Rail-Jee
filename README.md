# Rail-Jee Application Documentation

> A comprehensive railway departmental exam preparation platform built with Next.js 14

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Application Flow](#application-flow)
5. [Data Architecture](#data-architecture)
6. [Components Guide](#components-guide)
7. [API Integration](#api-integration)
8. [State Management](#state-management)
9. [Key Features](#key-features)

---

## Overview

Rail-Jee is a web application designed for Indian Railway employees to prepare for departmental promotion exams. The platform provides:

- **8 Railway Departments**: Civil, Mechanical, Electrical, Commercial, Personnel, Operating, S&T, and DFCCIL/Metro
- **Bilingual Support**: All content available in Hindi and English
- **Practice Exams**: Full-length exam papers with realistic timing
- **Instant Results**: Detailed scoring with correct answers
- **Progress Tracking**: Local storage-based exam history

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **External API** | Data source (railji-business.onrender.com) |
| **LocalStorage** | Exam attempt persistence |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── departments/
│   │   ├── page.tsx              # Departments list
│   │   └── [deptId]/
│   │       └── page.tsx          # Department detail page
│   ├── exam/
│   │   └── [examId]/
│   │       └── page.tsx          # Exam taking page
│   ├── stats/
│   │   └── page.tsx              # User statistics
│   └── api/                      # Local API routes
│       ├── departments/[deptId]/materials/
│       └── papers/top/
│
├── components/
│   ├── home/                     # Homepage components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── DepartmentShowcase.tsx
│   │   ├── ExamCards.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   │
│   ├── common/                   # Shared components
│   │   ├── ErrorScreen.tsx
│   │   └── LoadingState.tsx
│   │
│   ├── department/               # Department page components
│   │   ├── DepartmentBanner.tsx
│   │   ├── DepartmentHeader.tsx
│   │   ├── FilterSection.tsx
│   │   ├── MaterialCard.tsx
│   │   ├── MaterialViewer.tsx
│   │   ├── PaperCard.tsx
│   │   └── TabNavigation.tsx
│   │
│   ├── exam/                     # Exam page components
│   │   ├── ExamInstructions.tsx
│   │   ├── ExamQuestion.tsx
│   │   ├── ExamResult.tsx
│   │   ├── QuestionPalette.tsx
│   │   └── SubmitConfirmation.tsx
│   │
│   ├── DepartmentDetailClient.tsx  # Department detail logic
│   └── ExamPageClient.tsx          # Exam taking logic
│
├── lib/                          # Utilities
│   ├── api.ts                    # API functions
│   ├── apiConfig.ts              # External API configuration
│   ├── examStorage.ts            # LocalStorage helpers
│   └── types.ts                  # Shared TypeScript types
│
└── data/
    └── exams.json                # Static exam metadata
```

---

## Application Flow

### 1. Homepage Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        HOMEPAGE (/)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Navbar  │  │  Hero   │  │Department│  │ExamCards│        │
│  └─────────┘  └─────────┘  │Showcase  │  │(Top 6)  │        │
│                            └─────────┘  └─────────┘        │
│                                  │            │             │
│                                  ▼            ▼             │
│                          /departments   /exam/[examId]      │
└─────────────────────────────────────────────────────────────┘
```

**Components loaded:**
- `Navbar` - Navigation with links
- `Hero` - Main banner with CTA
- `DepartmentShowcase` - 8 department cards
- `ExamCards` - Top 6 popular papers (fetched from `/api/papers/top`)
- `Features`, `HowItWorks`, `Testimonials`, `Footer`

---

### 2. Department Detail Flow

```
┌─────────────────────────────────────────────────────────────┐
│              DEPARTMENT PAGE (/departments/[deptId])         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              DepartmentDetailClient                   │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ 1. Fetch department info from External API     │  │   │
│  │  │    GET /departments                            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                         │                             │   │
│  │                         ▼                             │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ 2. Fetch papers for department                 │  │   │
│  │  │    GET /papers?deptId={deptId}                 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                         │                             │   │
│  │                         ▼                             │   │
│  │  ┌─────────┐  ┌─────────────┐  ┌───────────────┐    │   │
│  │  │ Papers  │  │  Materials  │  │ Filter/Search │    │   │
│  │  │  Tab    │  │    Tab      │  │   Controls    │    │   │
│  │  └────┬────┘  └──────┬──────┘  └───────────────┘    │   │
│  │       │              │                               │   │
│  │       ▼              ▼                               │   │
│  │  PaperCard      MaterialCard                         │   │
│  │  (click →       (view PDF)                          │   │
│  │  /exam/[id])                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Data fetching:**
1. External API: `GET https://railji-business.onrender.com/departments`
2. External API: `GET https://railji-business.onrender.com/papers?deptId={deptId}`
3. Local API: `GET /api/departments/{deptId}/materials` (for PDF materials)

---

### 3. Exam Taking Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 EXAM PAGE (/exam/[examId])                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  ExamPageClient                       │   │
│  │                                                       │   │
│  │  Phase 1: INSTRUCTIONS                                │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ ExamInstructions                                │ │   │
│  │  │ - Fetch paper details from External API         │ │   │
│  │  │   GET /papers/{deptId}/{paperId}/questions      │ │   │
│  │  │ - Show exam rules & duration                    │ │   │
│  │  │ - "Start Exam" button                           │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                         │                             │   │
│  │                         ▼                             │   │
│  │  Phase 2: EXAM IN PROGRESS                            │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ ┌───────────────┐  ┌─────────────────────────┐ │ │   │
│  │  │ │QuestionPalette│  │    ExamQuestion         │ │ │   │
│  │  │ │ - Q numbers   │  │ - Current question      │ │ │   │
│  │  │ │ - Status      │  │ - Options (A/B/C/D)     │ │ │   │
│  │  │ │ - Timer       │  │ - Language toggle       │ │ │   │
│  │  │ └───────────────┘  │ - Mark for review       │ │ │   │
│  │  │                    └─────────────────────────┘ │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                         │                             │   │
│  │                         ▼                             │   │
│  │  Phase 3: SUBMIT CONFIRMATION                         │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ SubmitConfirmation                              │ │   │
│  │  │ - Summary: answered, unanswered, marked         │ │   │
│  │  │ - Confirm/Cancel buttons                        │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                         │                             │   │
│  │                         ▼                             │   │
│  │  Phase 4: RESULTS                                     │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ ExamResult                                      │ │   │
│  │  │ - Score calculated CLIENT-SIDE                  │ │   │
│  │  │ - Correct/Wrong/Unanswered counts               │ │   │
│  │  │ - Review all questions option                   │ │   │
│  │  │ - Save to LocalStorage (examStorage)            │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Exam States:**
```typescript
type ExamPhase = 'instructions' | 'exam' | 'confirm' | 'result' | 'review';
```

**Answer Tracking:**
```typescript
interface Answer {
  questionId: string;
  selectedOption: number | null;  // 0-3 for A-D
  isMarked: boolean;              // Marked for review
}
```

---

### 4. Statistics Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    STATS PAGE (/stats)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Data Source: LocalStorage (examStorage.ts)                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Overall Statistics                                   │    │
│  │ - Total exams attempted                              │    │
│  │ - Average score                                      │    │
│  │ - Best score                                         │    │
│  │ - Time spent                                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Exam History (per exam)                              │    │
│  │ - Date, Score, Time taken                            │    │
│  │ - Department, Paper name                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Architecture

### External API (Primary Data Source)

Base URL: `https://railji-business.onrender.com`

| Endpoint | Purpose | Used By |
|----------|---------|---------|
| `GET /departments` | List all departments | DepartmentDetailClient |
| `GET /papers?deptId={id}` | Papers for a department | DepartmentDetailClient |
| `GET /papers/{deptId}/{paperId}/questions` | Questions for exam | ExamPageClient |

### Local API (Supplementary)

| Endpoint | Purpose | Used By |
|----------|---------|---------|
| `GET /api/papers/top` | Top 6 popular papers | ExamCards (homepage) |
| `GET /api/departments/{deptId}/materials` | Study materials (PDFs) | DepartmentDetailClient |

### Shared Types (`src/lib/types.ts`)

```typescript
// Bilingual text support
interface BilingualText {
  en: string;
  hi: string;
}

// Question structure
interface Question {
  _id: string;
  question: BilingualText;
  options: BilingualText[];
  correctAnswer: number;  // 0-3
  explanation?: BilingualText;
}

// Exam paper
interface ExamPaper {
  _id: string;
  name: BilingualText;
  department: string;
  departmentId: string;
  year: string;
  totalQuestions: number;
  duration: number;  // minutes
  questions: Question[];
}

// Department info
interface DepartmentInfo {
  _id: string;
  name: string;
  fullName: string;
  description: string;
  color: { gradient: string; bg: string };
}
```

---

## Components Guide

### Common Components

| Component | Props | Purpose |
|-----------|-------|---------|
| `LoadingState` | `message?: string` | Full-screen loading spinner |
| `ErrorScreen` | `title, message, onRetry?, onBack?` | Error display with actions |

### Exam Components

| Component | Purpose |
|-----------|---------|
| `ExamInstructions` | Pre-exam rules and start button |
| `ExamQuestion` | Current question with options |
| `QuestionPalette` | Question navigation sidebar |
| `SubmitConfirmation` | Pre-submit summary modal |
| `ExamResult` | Post-exam score display |

### Department Components

| Component | Purpose |
|-----------|---------|
| `DepartmentBanner` | Header with department info |
| `TabNavigation` | Papers/Materials tabs |
| `PaperCard` | Individual exam paper card |
| `MaterialCard` | Study material (PDF) card |
| `FilterSection` | Year/type filters |

---

## State Management

### ExamPageClient State

```typescript
// Core exam state
const [examPhase, setExamPhase] = useState<ExamPhase>('instructions');
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState<Answer[]>([]);
const [timeRemaining, setTimeRemaining] = useState(0);

// Data state
const [exam, setExam] = useState<ExamPaper | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// UI state
const [language, setLanguage] = useState<'en' | 'hi'>('en');
const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

// Prevent duplicate API calls
const hasFetchedExam = useRef(false);
```

### DepartmentDetailClient State

```typescript
// Data state
const [department, setDepartment] = useState<DepartmentInfo | null>(null);
const [papers, setPapers] = useState<ExamPaper[]>([]);
const [materials, setMaterials] = useState<Material[]>([]);

// UI state
const [activeTab, setActiveTab] = useState<'papers' | 'materials'>('papers');
const [filters, setFilters] = useState({ year: '', type: '' });
const [searchQuery, setSearchQuery] = useState('');
```

### LocalStorage (examStorage.ts)

```typescript
// Exam attempt record
interface ExamAttempt {
  examId: string;
  examName: string;
  department: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  timeTaken: number;
  date: string;
}

// Functions
saveExamAttempt(attempt: ExamAttempt): void
getAllExamAttempts(): ExamAttempt[]
getExamAttempts(examId: string): ExamAttempt[]
getExamAttemptCount(examId: string): number
getBestScore(examId: string): number
getUserStats(): { total, avgScore, bestScore, totalTime }
```

---

## Key Features

### 1. Bilingual Support
- Every question, option, and explanation has both English and Hindi versions
- Users can toggle language anytime during exam
- Language preference persists throughout the session

### 2. Question Status Tracking
```typescript
type QuestionStatus = 'unanswered' | 'answered' | 'marked' | 'answered-marked';
```
- **Unanswered**: Not attempted (gray)
- **Answered**: Option selected (green)
- **Marked**: Flagged for review (orange)
- **Answered + Marked**: Both answered and flagged (blue)

### 3. Timer with Auto-Submit
- Countdown timer visible throughout exam
- Automatic submission when time expires
- Time remaining shown in MM:SS format

### 4. Client-Side Scoring
- No server round-trip for results
- Instant score calculation after submit
- Correct answer comparison done locally

### 5. Review Mode
- After submission, users can review all questions
- Shows correct answer vs selected answer
- Explanations displayed (when available)

---

## API Configuration

```typescript
// src/lib/apiConfig.ts
const API_BASE_URL = 'https://railji-business.onrender.com';

export const API_ENDPOINTS = {
  DEPARTMENTS: `${API_BASE_URL}/departments`,
  PAPERS: (deptId: string) => `${API_BASE_URL}/papers?deptId=${deptId}`,
  PAPER_QUESTIONS: (deptId: string, paperId: string) => 
    `${API_BASE_URL}/papers/${deptId}/${paperId}/questions`,
};
```

---

## Development Notes

### Running Locally
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Environment
- Node.js 18+
- Next.js 14 with App Router
- No environment variables required (external API is public)

---

## File Size Reference

| File | Lines | Purpose |
|------|-------|---------|
| ExamPageClient.tsx | ~880 | Main exam logic |
| DepartmentDetailClient.tsx | ~350 | Department page logic |
| examStorage.ts | ~100 | LocalStorage utilities |
| types.ts | ~80 | Shared interfaces |
| api.ts | ~50 | API helper functions |
| apiConfig.ts | ~15 | API endpoint config |

---

*Last updated: February 2026*
