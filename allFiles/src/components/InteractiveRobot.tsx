import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveRobot() {
    const robotRef = useRef<SVGSVGElement>(null);
    const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
    const [isWaving, setIsWaving] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [speechText, setSpeechText] = useState('');
    const [blink, setBlink] = useState(false);

    const messages = [
        "Hi! I'm Siddhant's Robot 🤖",
        "Full Stack Dev is my owner!",
        "Click me to say hello! 👋",
        "I love React & Node.js! ⚡",
        "Building cool things! 🚀",
    ];
    const msgIndex = useRef(0);

    // Blink periodically
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
    }, []);

    // Wave periodically
    useEffect(() => {
        const waveInterval = setInterval(() => {
            setIsWaving(true);
            setTimeout(() => setIsWaving(false), 1500);
        }, 5000);
        return () => clearInterval(waveInterval);
    }, []);

    // Eye tracking
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!robotRef.current) return;
        const svgRect = robotRef.current.getBoundingClientRect();
        const centerX = svgRect.left + svgRect.width / 2;
        const centerY = svgRect.top + svgRect.height * 0.42;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.sqrt(dx * dx + dy * dy) / 15, 4);

        setEyePos({
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
        });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const handleClick = () => {
        setSpeechText(messages[msgIndex.current % messages.length]);
        msgIndex.current++;
        setIsTalking(true);
        setTimeout(() => setIsTalking(false), 2000);
        setTimeout(() => setSpeechText(''), 3000);
    };

    return (
        <div className="relative flex flex-col items-center" onClick={handleClick}>
            {/* Speech bubble */}
            {speechText && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-4 py-2 rounded-2xl shadow-lg whitespace-nowrap z-20 pointer-events-none"
                    style={{ boxShadow: '0 0 20px rgba(168,85,247,0.5)' }}
                >
                    {speechText}
                    {/* Speech bubble tail */}
                    <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0"
                        style={{
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid #9333ea',
                        }}
                    />
                </motion.div>
            )}

            {/* Glow aura */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(236,72,153,0.3) 50%, transparent 70%)' }} />

            <svg
                ref={robotRef}
                viewBox="0 0 280 340"
                className="w-64 h-80 drop-shadow-2xl relative z-10"
                style={{
                    filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.5)) drop-shadow(0 0 60px rgba(236,72,153,0.2))',
                    cursor: 'pointer',
                }}
            >
                <defs>
                    {/* Main body gradient */}
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e1040" />
                        <stop offset="100%" stopColor="#0f0a2e" />
                    </linearGradient>
                    {/* Accent gradient */}
                    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    {/* Screen glow */}
                    <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>
                    {/* Cyan gradient */}
                    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* ── Antenna ── */}
                <line x1="140" y1="28" x2="140" y2="52" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                <motion.circle
                    cx="140" cy="18" r="10"
                    fill="url(#accentGrad)"
                    filter="url(#glow)"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* ── Head ── */}
                <rect x="72" y="52" width="136" height="110" rx="28" fill="url(#bodyGrad)" />
                {/* Head border glow */}
                <rect x="72" y="52" width="136" height="110" rx="28" fill="none"
                    stroke="url(#accentGrad)" strokeWidth="2" opacity="0.8" />

                {/* ── Face screen ── */}
                <rect x="86" y="66" width="108" height="82" rx="16" fill="#0a0520" />
                <rect x="86" y="66" width="108" height="82" rx="16" fill="url(#screenGlow)" />
                <rect x="86" y="66" width="108" height="82" rx="16" fill="none"
                    stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />

                {/* ── Eyes ── */}
                {/* Left eye socket */}
                <circle cx="114" cy="104" r="16" fill="#1a0d3d" />
                <circle cx="114" cy="104" r="16" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
                {/* Right eye socket */}
                <circle cx="166" cy="104" r="16" fill="#1a0d3d" />
                <circle cx="166" cy="104" r="16" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.4" />

                {/* Eye pupils — mouse-tracking */}
                {blink ? (
                    <>
                        <line x1="102" y1="104" x2="126" y2="104" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                        <line x1="154" y1="104" x2="178" y2="104" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                    </>
                ) : (
                    <>
                        {/* Left pupil */}
                        <circle cx={114 + eyePos.x} cy={104 + eyePos.y} r="8" fill="url(#accentGrad)" filter="url(#glow)" />
                        <circle cx={114 + eyePos.x + 2} cy={104 + eyePos.y - 2} r="3" fill="white" opacity="0.9" />
                        {/* Right pupil */}
                        <circle cx={166 + eyePos.x} cy={104 + eyePos.y} r="8" fill="url(#accentGrad)" filter="url(#glow)" />
                        <circle cx={166 + eyePos.x + 2} cy={104 + eyePos.y - 2} r="3" fill="white" opacity="0.9" />
                    </>
                )}

                {/* ── Mouth ── */}
                <path
                    d={isTalking
                        ? "M 110 132 Q 140 146 170 132"
                        : "M 110 132 Q 140 142 170 132"}
                    fill="none" stroke="url(#accentGrad)" strokeWidth="3.5" strokeLinecap="round"
                    filter="url(#glow)"
                />

                {/* ── Ear bolts ── */}
                <rect x="54" y="86" width="20" height="46" rx="10" fill="url(#bodyGrad)"
                    stroke="url(#accentGrad)" strokeWidth="1.5" />
                <circle cx="64" cy="109" r="5" fill="url(#accentGrad)" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <rect x="206" y="86" width="20" height="46" rx="10" fill="url(#bodyGrad)"
                    stroke="url(#accentGrad)" strokeWidth="1.5" />
                <circle cx="216" cy="109" r="5" fill="url(#accentGrad)" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" begin="1s" />
                </circle>

                {/* ── Neck ── */}
                <rect x="122" y="160" width="36" height="20" rx="6" fill="url(#bodyGrad)"
                    stroke="url(#accentGrad)" strokeWidth="1" opacity="0.7" />
                {/* Neck stripe */}
                <line x1="122" y1="168" x2="158" y2="168" stroke="#a855f7" strokeWidth="1.5" opacity="0.5" />
                <line x1="122" y1="174" x2="158" y2="174" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />

                {/* ── Body ── */}
                <rect x="54" y="178" width="172" height="130" rx="24" fill="url(#bodyGrad)" />
                <rect x="54" y="178" width="172" height="130" rx="24" fill="none"
                    stroke="url(#accentGrad)" strokeWidth="2" opacity="0.7" />

                {/* ── Body chest panel ── */}
                <rect x="80" y="198" width="120" height="80" rx="14" fill="#0a0520" />
                <rect x="80" y="198" width="120" height="80" rx="14" fill="none"
                    stroke="#a855f7" strokeWidth="1" opacity="0.4" />

                {/* Power button / core */}
                <motion.circle
                    cx="140" cy="225" r="18"
                    fill="#1a0d3d"
                    stroke="url(#accentGrad)"
                    strokeWidth="2"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle
                    cx="140" cy="225" r="10"
                    fill="url(#accentGrad)"
                    filter="url(#glow)"
                    animate={{ scale: [0.85, 1.1, 0.85] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Power icon */}
                <path d="M 136 218 L 136 228 M 133 220 Q 128 225 133 230 Q 140 235 147 230 Q 152 225 147 220"
                    fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

                {/* Mini indicator lights */}
                <circle cx="100" cy="255" r="5" fill="#06b6d4">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="116" cy="255" r="5" fill="#a855f7">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                <circle cx="164" cy="255" r="5" fill="#ec4899">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="1s" />
                </circle>
                <circle cx="180" cy="255" r="5" fill="#06b6d4">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
                </circle>

                {/* Equalizer bars (animated) */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.rect
                        key={i}
                        x={124 + i * 8} y={268} width={5} rx={2}
                        fill="url(#cyanGrad)"
                        animate={{ height: [4, 6 + Math.random() * 8, 4], y: [272, 268 - Math.random() * 4, 272] }}
                        transition={{ duration: 0.4 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}
                    />
                ))}

                {/* ── Left Arm (waving) ── */}
                <motion.g
                    animate={isWaving ? { rotate: [0, -30, 15, -25, 0] } : { rotate: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    style={{ originX: '36px', originY: '200px' }}
                >
                    <rect x="18" y="186" width="38" height="80" rx="18" fill="url(#bodyGrad)"
                        stroke="url(#accentGrad)" strokeWidth="1.5" />
                    {/* Arm stripe */}
                    <line x1="18" y1="220" x2="56" y2="220" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
                    <circle cx="37" cy="252" r="14" fill="url(#bodyGrad)"
                        stroke="url(#accentGrad)" strokeWidth="1.5" />
                    {/* Hand fingers */}
                    {isWaving && (
                        <>
                            <line x1="31" y1="258" x2="28" y2="268" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                            <line x1="37" y1="260" x2="37" y2="271" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                            <line x1="43" y1="258" x2="46" y2="268" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                        </>
                    )}
                </motion.g>

                {/* ── Right Arm (static) ── */}
                <rect x="224" y="186" width="38" height="80" rx="18" fill="url(#bodyGrad)"
                    stroke="url(#accentGrad)" strokeWidth="1.5" />
                <line x1="224" y1="220" x2="262" y2="220" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
                <circle cx="243" cy="252" r="14" fill="url(#bodyGrad)"
                    stroke="url(#accentGrad)" strokeWidth="1.5" />

                {/* ── Legs ── */}
                <rect x="86" y="300" width="42" height="36" rx="14" fill="url(#bodyGrad)"
                    stroke="url(#accentGrad)" strokeWidth="1.5" />
                <rect x="152" y="300" width="42" height="36" rx="14" fill="url(#bodyGrad)"
                    stroke="url(#accentGrad)" strokeWidth="1.5" />
                {/* Boots */}
                <rect x="82" y="326" width="50" height="14" rx="8" fill="#1a0d3d"
                    stroke="#a855f7" strokeWidth="1" opacity="0.8" />
                <rect x="148" y="326" width="50" height="14" rx="8" fill="#1a0d3d"
                    stroke="#a855f7" strokeWidth="1" opacity="0.8" />
            </svg>

            {/* Click hint */}
            <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-400 text-xs mt-2 font-medium tracking-wide"
            >
                click me!
            </motion.p>
        </div>
    );
}
