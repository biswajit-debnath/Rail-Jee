import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import DepartmentShowcase from '@/components/home/DepartmentShowcase';
import ExamCards from '@/components/home/ExamCards';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/home/Footer';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { type TopPaper } from '@/lib/api';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch both datasets in parallel with a 5-minute server-side cache.
  // On a cache hit the server responds in ~1 ms; on miss it waits for the API.
  const [departments, papers] = await Promise.all([
    fetch(API_ENDPOINTS.DEPARTMENTS, { next: { revalidate: 300 } })
      .then(r => r.ok ? r.json() : { data: [] })
      .then((json: any) => (json.data ?? []) as any[])
      .catch(() => [] as any[]),
    fetch(API_ENDPOINTS.TOP_PAPERS, { next: { revalidate: 300 } })
      .then(r => r.ok ? r.json() : { data: [] })
      .then((json: any) => ((json.data ?? []) as TopPaper[]).slice(0, 6))
      .catch(() => [] as TopPaper[]),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar user={user} />
      <Hero />
      <DepartmentShowcase departments={departments} />
      <ExamCards papers={papers} departments={departments} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
}
