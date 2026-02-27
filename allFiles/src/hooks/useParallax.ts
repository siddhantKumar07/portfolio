import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef } from 'react';

/**
 * Returns a spring-smoothed parallax `y` MotionValue for a section element.
 * @param speed  How fast the parallax moves relative to scroll. Negative = moves up as you scroll down.
 */
export function useParallax(speed: number = -0.2): {
  ref: React.RefObject<HTMLElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  const y = useSpring(rawY, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  return { ref, y };
}
