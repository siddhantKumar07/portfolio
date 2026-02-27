import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Dot follows mouse closely
    const dotX = useSpring(mouseX, { stiffness: 500, damping: 35 });
    const dotY = useSpring(mouseY, { stiffness: 500, damping: 35 });

    // Aura ring lags behind more
    const auraX = useSpring(mouseX, { stiffness: 120, damping: 25 });
    const auraY = useSpring(mouseY, { stiffness: 120, damping: 25 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnterInteractive = () => setIsHovering(true);
        const handleMouseLeaveInteractive = () => setIsHovering(false);

        window.addEventListener('mousemove', handleMouseMove);

        // Add hover listeners to all interactive elements
        const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';
        const addListeners = () => {
            document.querySelectorAll<HTMLElement>(interactiveSelectors).forEach((el) => {
                el.addEventListener('mouseenter', handleMouseEnterInteractive);
                el.addEventListener('mouseleave', handleMouseLeaveInteractive);
            });
        };

        addListeners();

        // Re-scan on DOM changes
        const observer = new MutationObserver(addListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
        };
    }, [mouseX, mouseY, isVisible]);

    if (typeof window === 'undefined') return null;

    return (
        <>
            {/* Aura ring — lags behind */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-normal"
                style={{
                    x: auraX,
                    y: auraY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 1.8 : 1,
                    width: isHovering ? 48 : 36,
                    height: isHovering ? 48 : 36,
                }}
                transition={{ scale: { duration: 0.3 }, opacity: { duration: 0.2 } }}
            >
                <div
                    className="w-full h-full rounded-full border-2"
                    style={{
                        borderColor: isHovering ? 'rgba(168, 85, 247, 0.8)' : 'rgba(168, 85, 247, 0.4)',
                        background: isHovering ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
                        boxShadow: isHovering
                            ? '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.2)'
                            : '0 0 10px rgba(168, 85, 247, 0.25)',
                        transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
                    }}
                />
            </motion.div>

            {/* Dot — follows closely */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 0 : 1,
                    width: 8,
                    height: 8,
                }}
                transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.2 } }}
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                        boxShadow: '0 0 6px rgba(168, 85, 247, 0.8)',
                    }}
                />
            </motion.div>
        </>
    );
}
