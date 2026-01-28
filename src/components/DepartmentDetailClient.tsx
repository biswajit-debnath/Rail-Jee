'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';

interface ExamPaper {
  id: string;
  name: string;
  description: string;
  year: string;
  shift: string;
  questions: number;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  rating: number;
  isFree: boolean;
  isNew?: boolean;
}

interface DepartmentInfo {
  name: string;
  fullName: string;
  color: string;
  bgColor: string;
  papers: ExamPaper[];
}

const departmentData: { [key: string]: DepartmentInfo } = {
  civil: {
    name: 'Civil Engg',
    fullName: 'Civil Engineering',
    color: 'from-red-600 to-red-800',
    bgColor: 'bg-red-50',
    papers: [
      { id: 'je-civil-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 12500, rating: 4.8, isFree: true, isNew: true },
      { id: 'je-civil-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Medium', attempts: 8900, rating: 4.7, isFree: true },
      { id: 'je-civil-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Hard', attempts: 25600, rating: 4.9, isFree: true },
      { id: 'je-civil-2023-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2023', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Medium', attempts: 18700, rating: 4.6, isFree: true },
      { id: 'je-civil-2022-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2022', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 34200, rating: 4.8, isFree: true },
      { id: 'sse-civil-2024', name: 'RRB SSE', description: 'Senior Section Engineer Technical', year: '2024', shift: 'Morning', questions: 150, duration: 120, difficulty: 'Hard', attempts: 5600, rating: 4.5, isFree: true, isNew: true },
      { id: 'sse-civil-2023', name: 'RRB SSE', description: 'Senior Section Engineer Technical', year: '2023', shift: 'Morning', questions: 150, duration: 120, difficulty: 'Hard', attempts: 12300, rating: 4.7, isFree: true },
    ]
  },
  mechanical: {
    name: 'Mechanical',
    fullName: 'Mechanical Engineering',
    color: 'from-orange-600 to-red-700',
    bgColor: 'bg-orange-50',
    papers: [
      { id: 'je-mech-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 15600, rating: 4.8, isFree: true, isNew: true },
      { id: 'je-mech-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Hard', attempts: 11200, rating: 4.7, isFree: true },
      { id: 'je-mech-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 28900, rating: 4.9, isFree: true },
      { id: 'alp-mech-2024', name: 'RRB ALP', description: 'Assistant Loco Pilot Technical', year: '2024', shift: 'All Shifts', questions: 75, duration: 60, difficulty: 'Medium', attempts: 45000, rating: 4.8, isFree: true, isNew: true },
      { id: 'alp-mech-2023', name: 'RRB ALP', description: 'Assistant Loco Pilot Technical', year: '2023', shift: 'All Shifts', questions: 75, duration: 60, difficulty: 'Medium', attempts: 67000, rating: 4.9, isFree: true },
    ]
  },
  electrical: {
    name: 'Electrical',
    fullName: 'Electrical Engineering',
    color: 'from-amber-600 to-orange-700',
    bgColor: 'bg-amber-50',
    papers: [
      { id: 'je-elec-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 18900, rating: 4.8, isFree: true, isNew: true },
      { id: 'je-elec-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Hard', attempts: 14500, rating: 4.7, isFree: true },
      { id: 'je-elec-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 32100, rating: 4.9, isFree: true },
      { id: 'technician-elec-2024', name: 'RRB Technician', description: 'Technician Grade III Electrical', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Easy', attempts: 22000, rating: 4.6, isFree: true, isNew: true },
    ]
  },
  commercial: {
    name: 'Commercial',
    fullName: 'Commercial Department',
    color: 'from-emerald-600 to-teal-700',
    bgColor: 'bg-emerald-50',
    papers: [
      { id: 'ntpc-2024-1', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 89000, rating: 4.9, isFree: true, isNew: true },
      { id: 'ntpc-2024-2', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Medium', attempts: 76000, rating: 4.8, isFree: true },
      { id: 'ntpc-2023-1', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 125000, rating: 4.9, isFree: true },
      { id: 'clerk-2024', name: 'Junior Clerk', description: 'Clerical Cadre Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Easy', attempts: 45000, rating: 4.7, isFree: true, isNew: true },
      { id: 'tc-2024', name: 'Ticket Collector', description: 'TC/CC Examination', year: '2024', shift: 'All Shifts', questions: 100, duration: 90, difficulty: 'Medium', attempts: 38000, rating: 4.6, isFree: true },
    ]
  },
  personnel: {
    name: 'Personnel',
    fullName: 'Personnel Department',
    color: 'from-blue-600 to-indigo-700',
    bgColor: 'bg-blue-50',
    papers: [
      { id: 'ntpc-personnel-2024', name: 'RRB NTPC CBT-1', description: 'Personnel & Administrative', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 34000, rating: 4.7, isFree: true, isNew: true },
      { id: 'clerk-personnel-2024', name: 'Junior Clerk', description: 'Personnel Clerk Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Easy', attempts: 28000, rating: 4.6, isFree: true },
      { id: 'ntpc-personnel-2023', name: 'RRB NTPC CBT-1', description: 'Personnel & Administrative', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 56000, rating: 4.8, isFree: true },
    ]
  },
  operating: {
    name: 'Operating',
    fullName: 'Operating Department',
    color: 'from-purple-600 to-violet-700',
    bgColor: 'bg-purple-50',
    papers: [
      { id: 'alp-2024-1', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2024', shift: 'Shift 1', questions: 75, duration: 60, difficulty: 'Medium', attempts: 78000, rating: 4.9, isFree: true, isNew: true },
      { id: 'alp-2024-2', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2024', shift: 'Shift 2', questions: 75, duration: 60, difficulty: 'Medium', attempts: 65000, rating: 4.8, isFree: true },
      { id: 'alp-2023-1', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2023', shift: 'Shift 1', questions: 75, duration: 60, difficulty: 'Hard', attempts: 112000, rating: 4.9, isFree: true },
      { id: 'guard-2024', name: 'Train Guard', description: 'Goods Guard Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Medium', attempts: 23000, rating: 4.5, isFree: true, isNew: true },
    ]
  },
  snt: {
    name: 'S&T',
    fullName: 'Signal & Telecommunication',
    color: 'from-cyan-600 to-blue-700',
    bgColor: 'bg-cyan-50',
    papers: [
      { id: 'je-snt-2024-1', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Hard', attempts: 8900, rating: 4.7, isFree: true, isNew: true },
      { id: 'je-snt-2024-2', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Hard', attempts: 7200, rating: 4.6, isFree: true },
      { id: 'je-snt-2023', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 15600, rating: 4.8, isFree: true },
      { id: 'tech-snt-2024', name: 'Technician S&T', description: 'Technician Grade III S&T', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Medium', attempts: 12000, rating: 4.5, isFree: true },
    ]
  },
  metro: {
    name: 'DFCCIL & Metro',
    fullName: 'DFCCIL & Metro Railways',
    color: 'from-rose-600 to-pink-700',
    bgColor: 'bg-rose-50',
    papers: [
      { id: 'dfccil-je-2024', name: 'DFCCIL JE', description: 'Junior Engineer DFCCIL', year: '2024', shift: 'CBT', questions: 100, duration: 90, difficulty: 'Hard', attempts: 6700, rating: 4.6, isFree: true, isNew: true },
      { id: 'metro-je-2024', name: 'Metro Rail JE', description: 'Junior Engineer Metro', year: '2024', shift: 'CBT', questions: 100, duration: 90, difficulty: 'Hard', attempts: 8900, rating: 4.7, isFree: true, isNew: true },
      { id: 'dfccil-exec-2024', name: 'DFCCIL Executive', description: 'Executive Civil/Electrical', year: '2024', shift: 'CBT', questions: 120, duration: 120, difficulty: 'Hard', attempts: 4500, rating: 4.5, isFree: true },
      { id: 'metro-tech-2024', name: 'Metro Technician', description: 'Maintainer/Technician Metro', year: '2024', shift: 'CBT', questions: 100, duration: 90, difficulty: 'Medium', attempts: 15000, rating: 4.6, isFree: true },
    ]
  }
};

interface Material {
  id: string;
  name: string;
  type: 'notes' | 'book' | 'video' | 'guide';
  description: string;
  downloads: number;
  rating: number;
  isFree: boolean;
  contentType: 'pdf' | 'video';
  contentUrl: string;
}

interface DepartmentDetailClientProps {
  deptId: string;
}

const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const;

const materialTypes = {
  notes: { label: 'Study Notes', icon: '📝', color: 'bg-blue-100 text-blue-700' },
  book: { label: 'Books', icon: '📚', color: 'bg-purple-100 text-purple-700' },
  video: { label: 'Video Lectures', icon: '🎥', color: 'bg-red-100 text-red-700' },
  guide: { label: 'Guides', icon: '📖', color: 'bg-green-100 text-green-700' },
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

const formatAttempts = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const sampleMaterials: { [key: string]: Material[] } = {
  civil: [
    { id: 'civil-notes-1', name: 'Structural Analysis Complete Notes', type: 'notes', description: 'Comprehensive notes covering all structural analysis concepts', downloads: 8900, rating: 4.8, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'civil-book-1', name: 'RCC Design Handbook', type: 'book', description: 'Complete guide to reinforced concrete design', downloads: 5600, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'civil-video-1', name: 'Surveying Fundamentals Series', type: 'video', description: '15-part video series on surveying basics', downloads: 12300, rating: 4.9, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'civil-guide-1', name: 'Exam Preparation Guide 2024', type: 'guide', description: 'Step-by-step guide for RRB JE preparation', downloads: 7800, rating: 4.6, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
  ],
  mechanical: [
    { id: 'mech-notes-1', name: 'Thermodynamics Complete Notes', type: 'notes', description: 'All thermodynamics concepts explained', downloads: 9200, rating: 4.8, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'mech-book-1', name: 'Mechanical Engineering Handbook', type: 'book', description: 'Reference handbook for all mechanical topics', downloads: 6100, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'mech-video-1', name: 'Machine Design Lectures', type: 'video', description: 'Complete machine design course', downloads: 11500, rating: 4.9, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw' },
  ],
  electrical: [
    { id: 'elec-notes-1', name: 'Power Systems Notes', type: 'notes', description: 'Detailed power systems study material', downloads: 8700, rating: 4.8, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'elec-book-1', name: 'Electrical Machines Guide', type: 'book', description: 'Complete guide to electrical machines', downloads: 5400, rating: 4.6, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'elec-video-1', name: 'Circuit Analysis Video Series', type: 'video', description: '20-part circuit analysis tutorial', downloads: 13200, rating: 4.9, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/9vQkLfD6nei' },
  ],
  commercial: [
    { id: 'comm-notes-1', name: 'General Awareness Notes', type: 'notes', description: 'Current affairs and GA preparation', downloads: 15600, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'comm-guide-1', name: 'NTPC Exam Strategy Guide', type: 'guide', description: 'Proven strategies for NTPC exam', downloads: 12300, rating: 4.8, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/ZZ5LpwO-An4' },
  ],
  personnel: [
    { id: 'pers-notes-1', name: 'Administrative Procedures Notes', type: 'notes', description: 'Railway administrative procedures', downloads: 6200, rating: 4.6, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'pers-guide-1', name: 'Personnel Exam Guide', type: 'guide', description: 'Complete exam preparation guide', downloads: 8900, rating: 4.7, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ' },
  ],
  operating: [
    { id: 'oper-notes-1', name: 'Railway Operations Notes', type: 'notes', description: 'Railway operations and safety', downloads: 7800, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'oper-video-1', name: 'ALP Training Videos', type: 'video', description: 'ALP role and responsibilities', downloads: 14500, rating: 4.8, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/2Xc3p-vHBJ4' },
  ],
  snt: [
    { id: 'snt-notes-1', name: 'Signal Systems Notes', type: 'notes', description: 'Signal and telecommunication systems', downloads: 5600, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'snt-book-1', name: 'S&T Technical Manual', type: 'book', description: 'Technical reference manual', downloads: 4200, rating: 4.6, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/tYzMGcUty6s' },
  ],
  metro: [
    { id: 'metro-notes-1', name: 'Metro Rail Systems Notes', type: 'notes', description: 'Metro rail operations and systems', downloads: 6800, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'metro-guide-1', name: 'DFCCIL Exam Guide', type: 'guide', description: 'DFCCIL exam preparation', downloads: 7200, rating: 4.6, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/kffacxfA7g4' },
  ],
};

export default function DepartmentDetailClient({ deptId }: DepartmentDetailClientProps) {
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'papers' | 'materials'>('papers');
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const department = departmentData[deptId];
  const materials = sampleMaterials[deptId] || [];

  // Get unique filter values
  const years = useMemo(() => {
    if (!department) return [];
    const uniqueYears = [...new Set(department.papers.map(p => p.year))].sort((a, b) => b.localeCompare(a));
    return ['All', ...uniqueYears];
  }, [department]);

  const examTypes = useMemo(() => {
    if (!department) return [];
    const uniqueTypes = [...new Set(department.papers.map(p => p.name))];
    return ['All', ...uniqueTypes];
  }, [department]);

  const filteredPapers = useMemo(() => {
    if (!department) return [];
    return department.papers.filter(paper => {
      const matchYear = selectedYear === 'All' || paper.year === selectedYear;
      const matchType = selectedExamType === 'All' || paper.name === selectedExamType;
      const matchDifficulty = selectedDifficulty === 'All' || paper.difficulty === selectedDifficulty;
      return matchYear && matchType && matchDifficulty;
    });
  }, [department, selectedYear, selectedExamType, selectedDifficulty]);

  const materialTypeOptions = useMemo(() => {
    const types = [...new Set(materials.map(m => m.type))];
    return ['All', ...types];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchType = selectedMaterialType === 'All' || material.type === selectedMaterialType;
      return matchType;
    });
  }, [materials, selectedMaterialType]);

  if (!department) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Department not found</h1>
          <Link href="/departments" className="text-emerald-600 hover:underline">
            Go back to departments
          </Link>
        </div>
      </div>
    );
  }

  const handlePaperSelect = (paperId: string) => {
    // Map department paper IDs to exam IDs in exams.json
    let examId = 'je'; // default

    if (paperId.includes('je-') || paperId.includes('sse-')) {
      examId = 'je';
    } else if (paperId.includes('ntpc-')) {
      examId = 'ntpc';
    } else if (paperId.includes('clerk-') || paperId.includes('tc-')) {
      examId = 'jr-clerk';
    } else if (paperId.includes('alp-') || paperId.includes('guard-')) {
      examId = 'je'; // Using JE for ALP/Guard for now
    } else if (paperId.includes('tech-')) {
      examId = 'je';
    } else if (paperId.includes('dfccil-') || paperId.includes('metro-')) {
      examId = 'je';
    }

    router.push(`/exam/${examId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900">
      {/* Header */}
      <header className="pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/departments" className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <Link href="/" className="transition-transform hover:scale-105">
                <img
                  src="/images/logo.png"
                  alt="RailJee Logo"
                  className="h-14 sm:h-14 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Greeting Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
                {department.fullName} 👋
              </h1>
              <p className="text-teal-200 text-base lg:text-xl">
                {activeTab === 'papers' ? 'Choose a paper to start practicing' : 'Access study materials and resources'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm lg:text-base font-medium">
                  {activeTab === 'papers' ? `${filteredPapers.length} Papers` : `${filteredMaterials.length} Materials`}
                </span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm lg:text-base font-medium">Free Access</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex gap-2 border-b border-white/20">
            <button
              onClick={() => {
                setActiveTab('papers');
                setSelectedYear('All');
                setSelectedExamType('All');
                setSelectedDifficulty('All');
              }}
              className={`px-4 lg:px-6 py-3 font-semibold text-base lg:text-lg transition-all duration-200 border-b-2 ${
                activeTab === 'papers'
                  ? 'text-white border-b-emerald-400'
                  : 'text-teal-200 border-b-transparent hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {filteredPapers.length} Papers
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('materials');
                setSelectedMaterialType('All');
              }}
              className={`px-4 lg:px-6 py-3 font-semibold text-base lg:text-lg transition-all duration-200 border-b-2 ${
                activeTab === 'materials'
                  ? 'text-white border-b-emerald-400'
                  : 'text-teal-200 border-b-transparent hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
                </svg>
                Materials
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-10">
        <div className="max-w-7xl mx-auto space-y-4">
          {activeTab === 'papers' ? (
            <>
              {/* Year Filter */}
              <div>
                <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Filter by Year</label>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                        selectedYear === year
                          ? 'bg-white text-teal-900 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {year === 'All' ? 'All Years' : year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Type & Difficulty Filters - Side by Side on Large Screens */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Exam Type Filter */}
                <div>
                  <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Exam Type</label>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {examTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedExamType(type)}
                        className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                          selectedExamType === type
                            ? 'bg-emerald-400 text-teal-900 shadow-lg'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        {type === 'All' ? 'All Exams' : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Difficulty</label>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {difficulties.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                          selectedDifficulty === diff
                            ? 'bg-amber-400 text-teal-900 shadow-lg'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        {diff === 'All' ? 'All Levels' : diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Material Type Filter */}
              <div>
                <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Filter by Type</label>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {materialTypeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedMaterialType(type)}
                      className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                        selectedMaterialType === type
                          ? 'bg-emerald-400 text-teal-900 shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {type === 'All' ? 'All Materials' : materialTypes[type as keyof typeof materialTypes]?.label || type}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Papers/Materials List */}
      <main className="px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'papers' ? (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <p className="text-teal-200 text-base lg:text-lg">
                  Showing <span className="font-semibold text-white text-lg lg:text-xl">{filteredPapers.length}</span> {filteredPapers.length === 1 ? 'paper' : 'papers'}
                </p>
                <div className="hidden lg:flex items-center gap-3 text-teal-200 text-sm">
                  <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Sort by
                  </button>
                </div>
              </div>

              {/* Papers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {filteredPapers.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center">
                <svg className="w-16 h-16 text-teal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No papers found</h3>
                <p className="text-teal-200">Try adjusting your filters</p>
              </div>
            ) : (
              filteredPapers.map((paper, index) => (
                <button
                  key={paper.id}
                  onClick={() => handlePaperSelect(paper.id)}
                  className="relative w-full bg-white rounded-2xl p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group border border-stone-100 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-emerald-600/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-2xl">
                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        Start Exam
                        <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      <p className="text-white text-xs mt-2 opacity-90">{paper.questions} Questions · {paper.duration} Minutes</p>
                    </div>
                  </div>

                  {/* Instructor Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">Instructor</span>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    {paper.isNew && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500 text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Title & Price Row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-stone-900 leading-tight group-hover:text-teal-700 transition-colors">
                      {paper.name}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-stone-400 line-through">₹299</div>
                      <div className="text-base font-bold text-emerald-600 border border-stone-200 bg-stone-50 px-2 py-0.5 rounded">
                        Free
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-stone-500 text-xs mb-3 line-clamp-2">
                    {paper.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{paper.year} · {paper.shift}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{paper.questions} questions · {paper.duration} min</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-stone-100 pt-3">
                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400">
                        {formatAttempts(paper.attempts)} people attempted
                      </span>
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-stone-700">{paper.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Badge - Bottom Right Corner */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium ${getDifficultyColor(paper.difficulty)}`}>
                    {paper.difficulty}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Bottom Stats */}
          <div className="mt-10 lg:mt-14 grid grid-cols-3 gap-3 lg:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
              <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{department.papers.length}</div>
              <div className="text-xs lg:text-sm text-teal-200">Total Papers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
              <div className="text-2xl lg:text-4xl font-bold text-white mb-1">
                {department.papers.filter(p => p.isNew).length}
              </div>
              <div className="text-xs lg:text-sm text-teal-200">New Papers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
              <div className="text-2xl lg:text-4xl font-bold text-emerald-400 mb-1">100%</div>
              <div className="text-xs lg:text-sm text-teal-200">Free Access</div>
            </div>
          </div>
            </>
          ) : (
            <>
              {/* Materials Results Count */}
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <p className="text-teal-200 text-base lg:text-lg">
                  Showing <span className="font-semibold text-white text-lg lg:text-xl">{filteredMaterials.length}</span> {filteredMaterials.length === 1 ? 'material' : 'materials'}
                </p>
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {filteredMaterials.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center">
                    <svg className="w-16 h-16 text-teal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">No materials found</h3>
                    <p className="text-teal-200">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredMaterials.map((material, index) => (
                    <div
                      key={material.id}
                      onClick={() => setSelectedMaterial(material)}
                      className="relative w-full bg-white rounded-2xl p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group border border-stone-100 overflow-hidden cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-emerald-600/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-2xl">
                        <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <button className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                            {material.contentType === 'pdf' ? 'View PDF' : 'Watch Video'}
                            <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={material.contentType === 'pdf' ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Material Type Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${materialTypes[material.type].color}`}>
                          {materialTypes[material.type].icon} {materialTypes[material.type].label}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-stone-900 leading-tight group-hover:text-teal-700 transition-colors mb-2">
                        {material.name}
                      </h3>

                      {/* Description */}
                      <p className="text-stone-500 text-xs mb-4 line-clamp-2">
                        {material.description}
                      </p>

                      {/* Divider */}
                      <div className="border-t border-stone-100 pt-3">
                        {/* Bottom Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-stone-600">
                            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>{formatAttempts(material.downloads)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-xs font-semibold text-stone-700">{material.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Free Badge */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500 text-white">
                        FREE
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Materials Stats */}
              <div className="mt-10 lg:mt-14 grid grid-cols-3 gap-3 lg:gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{materials.length}</div>
                  <div className="text-xs lg:text-sm text-teal-200">Total Materials</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-2xl lg:text-4xl font-bold text-white mb-1">
                    {materials.filter(m => m.type === 'notes').length}
                  </div>
                  <div className="text-xs lg:text-sm text-teal-200">Study Notes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-2xl lg:text-4xl font-bold text-emerald-400 mb-1">100%</div>
                  <div className="text-xs lg:text-sm text-teal-200">Free Access</div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Material Viewer Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-stone-900 truncate">{selectedMaterial.name}</h2>
                <p className="text-stone-500 text-sm mt-1 line-clamp-2">{selectedMaterial.description}</p>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0 ml-4"
              >
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden bg-stone-50 flex items-center justify-center">
              {selectedMaterial.contentType === 'pdf' ? (
                <iframe
                  src={selectedMaterial.contentUrl}
                  className="w-full h-full"
                  title={selectedMaterial.name}
                />
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedMaterial.contentUrl}
                  title={selectedMaterial.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-stone-200 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-stone-700">{selectedMaterial.rating}</span>
                </div>
                <span className="text-xs text-stone-500">{formatAttempts(selectedMaterial.downloads)} downloads</span>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

