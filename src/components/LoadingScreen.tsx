'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingScreen({ isLoading, message = 'Loading...' }: LoadingScreenProps) {
  const [animationData, setAnimationData] = useState(null);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [minDisplayTimeReached, setMinDisplayTimeReached] = useState(false);

  useEffect(() => {
    // Prioritize loading the animation file first
    const loadAnimation = async () => {
      try {
        const response = await fetch('/animation/Train Animation.lottie/a/Main Scene.json');
        const data = await response.json();
        setAnimationData(data);
        setAnimationLoaded(true);
      } catch (error) {
        console.error('Failed to load animation:', error);
        setAnimationLoaded(true); // Still mark as loaded even if failed
      }
    };

    if (isLoading) {
      setMinDisplayTimeReached(false);
      loadAnimation();
      
      // Set a 5 second minimum display time for the animation
      const timer = setTimeout(() => {
        setMinDisplayTimeReached(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading && minDisplayTimeReached) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="w-80 h-80 sm:w-96 sm:h-96">
        {animationLoaded && animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
