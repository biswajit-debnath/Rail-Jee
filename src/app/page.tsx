import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import DepartmentShowcase from '@/components/home/DepartmentShowcase';
import ExamCards from '@/components/home/ExamCards';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <DepartmentShowcase />
      <ExamCards />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
}
