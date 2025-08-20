import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (threshold = 0.3) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
};
