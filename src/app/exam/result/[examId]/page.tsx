import { Suspense } from 'react';
import ExamResultClient from '@/components/ExamResultClient';
import LoadingState from '@/components/common/LoadingState';

interface ExamResultPageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamResultPage({ params }: ExamResultPageProps) {
  const { examId } = await params;
  
  return (
    <Suspense fallback={<LoadingState message="Loading exam results..." />}>
      <ExamResultClient examId={examId} />
    </Suspense>
  );
}
