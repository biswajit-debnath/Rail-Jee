import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExamCards from '@/components/ExamCards';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <ExamCards />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
