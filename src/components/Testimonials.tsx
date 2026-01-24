'use client';

import { useState } from 'react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "RailJee helped me crack RRB JE in my first attempt. The practice tests were exactly like the actual exam pattern.",
      name: "Rahul Sharma",
      role: "RRB JE 2025 Qualifier",
      avatar: "RS"
    },
    {
      quote: "The bilingual support in Hindi and English made understanding complex technical concepts so much easier for me.",
      name: "Priya Patel",
      role: "NTPC Aspirant",
      avatar: "PP"
    },
    {
      quote: "I improved my score from 45% to 82% in just two months of practice. The instant feedback feature is game-changing.",
      name: "Amit Kumar",
      role: "Group D Selected",
      avatar: "AK"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image/Visual */}
          <div className="relative">
            <div className="relative bg-stone-200 rounded-3xl overflow-hidden aspect-[4/3]">
              {/* Railway themed visual */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <p className="text-stone-600 font-medium">Join 10,000+ Students</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-12 h-12 text-emerald-500">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <button className="px-4 py-2 bg-white text-stone-900 text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow">
                Learn more
              </button>
            </div>
          </div>

          {/* Right - Testimonials */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
                Hear From Our Alumni
              </h2>
              <a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Testimonial Cards */}
            <div className="space-y-6">
              {testimonials.slice(0, 2).map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-stone-600 mb-6 leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900">{testimonial.name}</div>
                      <div className="text-sm text-stone-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-stone-900 w-6' : 'bg-stone-300'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white hover:bg-stone-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
