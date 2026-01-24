'use client';

import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#faf9f7]">
      {/* Decorative Elements - Railway themed */}
      <div className="absolute top-20 right-10 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 text-emerald-500 opacity-80">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </div>
      <div className="absolute top-40 right-32 sm:right-48 w-8 sm:w-12 h-8 sm:h-12 text-emerald-400 opacity-60">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
        </svg>
      </div>
      <div className="absolute bottom-20 left-10 w-20 h-20 rounded-full border-4 border-stone-200 opacity-40"></div>
      <div className="absolute top-10 left-1/4 w-3 h-3 bg-emerald-500 rounded-full opacity-60"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
              Your Journey to{' '}
              <span className="text-emerald-600">Railway</span>{' '}
              Success Starts Here
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-xl leading-relaxed">
              Prepare for RRB JE, NTPC, and Group D exams with expert-curated content, practice tests, and comprehensive study materials trusted by thousands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/departments')}
                className="px-8 py-4 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get started
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <div className="flex flex-wrap gap-8 sm:gap-12">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-stone-900">10K+</div>
                  <div className="text-stone-500 text-sm mt-1">Active Students</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-stone-900">5000+</div>
                  <div className="text-stone-500 text-sm mt-1">Practice Questions</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-stone-900">95%</div>
                  <div className="text-stone-500 text-sm mt-1">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Illustration */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                {/* Railway themed illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    {/* Train Icon */}
                    <div className="w-56 h-56 mx-auto mb-1 text-stone-400">
                      <img
                        src="/images/hero.svg"
                        alt="Train"
                        className="h-48 sm:h-52 lg:h-56 w-auto mx-auto"

                      />

                    </div>
                    <p className="text-stone-500 text-lg font-medium">Prepare. Practice. Succeed.</p>
                  </div>
                </div>

                {/* Decorative track lines */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-stone-300">
                  <div className="flex justify-around items-center h-full">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-6 h-2 bg-stone-400 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                <div className="text-center text-white">
                  <div className="text-2xl sm:text-3xl font-bold">5000+</div>
                  <div className="text-xs sm:text-sm">Questions</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-xl p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 text-sm sm:text-base">RRB Approved</div>
                    <div className="text-xs sm:text-sm text-stone-500">Exam Pattern</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
