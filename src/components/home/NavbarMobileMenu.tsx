'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  isRoute?: boolean;
}

interface NavbarMobileMenuProps {
  navItems: NavItem[];
}

export default function NavbarMobileMenu({ navItems }: NavbarMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-1.5 sm:p-2 text-stone-600 hover:text-stone-900"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100 z-50 md:hidden px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) =>
                  item.isRoute ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-stone-600 hover:text-stone-900 font-medium py-2 px-2 transition-colors flex items-center gap-2 rounded-lg hover:bg-stone-50"
                    >
                      {item.name === 'Your Stats' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-stone-600 hover:text-stone-900 font-medium py-2 px-2 transition-colors rounded-lg hover:bg-stone-50"
                    >
                      {item.name}
                    </a>
                  )
                )}
                <Link
                  href="/departments"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-all text-center"
                >
                  Start Preparing
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
