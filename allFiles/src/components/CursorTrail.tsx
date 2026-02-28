import { useEffect, useRef } from 'react';

// ─── Tuning ────────────────────────────────────────────────────────────────────
const TRAIL_CAP = 48;   // kept positions
const SMOOTH_K = 0.28; // EMA factor: higher = more responsive, lower = more lag
const STEPS = 8;    // Catmull-Rom subdivisions per segment
const BASE_RADIUS = 5;    // stroke half-width at freshest point (px)
const HUE_SPEED = 0.55; // hue degrees per frame
const MAX_PX = 80;   // max particles
const PX_EVERY = 4;    // spawn a particle every N frames
const FADE_ZONES = 6;    // opacity/width buckets along the trail

// ─── Catmull-Rom ───────────────────────────────────────────────────────────────
function cmRom(
    p0x: number, p0y: number,
    p1x: number, p1y: number,
    p2x: number, p2y: number,
    p3x: number, p3y: number,
    t: number,
): [number, number] {
    const t2 = t * t, t3 = t2 * t;
    return [
        0.5 * ((2 * p1x) + (-p0x + p2x) * t + (2 * p0x - 5 * p1x + 4 * p2x - p3x) * t2 + (-p0x + 3 * p1x - 3 * p2x + p3x) * t3),
        0.5 * ((2 * p1y) + (-p0y + p2y) * t + (2 * p0y - 5 * p1y + 4 * p2y - p3y) * t2 + (-p0y + 3 * p1y - 3 * p2y + p3y) * t3),
    ];
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        // Raw + smoothed mouse
        let rawX = -300, rawY = -300;
        let smX = -300, smY = -300;

        // Trail as flat typed array for speed
        const trailX = new Float32Array(TRAIL_CAP);
        const trailY = new Float32Array(TRAIL_CAP);
        let trailLen = 0;

        interface Px { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number }
        const particles: Px[] = [];

        let hue = 200;
        let frame = 0;
        let rafId = 0;

        // ── Resize ────────────────────────────────────────────────────────────
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        // ── Mouse capture ─────────────────────────────────────────────────────
        const onMove = (e: MouseEvent) => { rawX = e.clientX; rawY = e.clientY; };
        window.addEventListener('mousemove', onMove, { passive: true });

        // ── Particle spawn ────────────────────────────────────────────────────
        const spawnPx = (x: number, y: number, h: number) => {
            if (particles.length >= MAX_PX) return;
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.4 + Math.random() * 1.2;
            const life = 18 + Math.floor(Math.random() * 28);
            particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.25, life, maxLife: life, size: 0.7 + Math.random() * 1.8, hue: h + (Math.random() - 0.5) * 55 });
        };

        // ── rAF loop ──────────────────────────────────────────────────────────
        const tick = () => {
            rafId = requestAnimationFrame(tick);
            frame++;
            hue = (hue + HUE_SPEED) % 360;

            // EMA smooth
            smX += (rawX - smX) * SMOOTH_K;
            smY += (rawY - smY) * SMOOTH_K;

            // Prepend to trail (shift right)
            const len = Math.min(trailLen + 1, TRAIL_CAP);
            for (let i = len - 1; i > 0; i--) { trailX[i] = trailX[i - 1]; trailY[i] = trailY[i - 1]; }
            trailX[0] = smX; trailY[0] = smY;
            trailLen = len;

            // Particles
            if (frame % PX_EVERY === 0) spawnPx(smX, smY, hue);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy; p.vy += 0.035; p.life--;
                if (p.life <= 0) particles.splice(i, 1);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (trailLen < 4) return;

            // Build spline samples
            const sX: number[] = [];
            const sY: number[] = [];
            const n = trailLen;
            for (let i = 1; i < n - 2; i++) {
                for (let s = 0; s < STEPS; s++) {
                    const t = s / STEPS;
                    const [x, y] = cmRom(trailX[i - 1], trailY[i - 1], trailX[i], trailY[i], trailX[i + 1], trailY[i + 1], trailX[i + 2], trailY[i + 2], t);
                    sX.push(x); sY.push(y);
                }
            }
            const total = sX.length;
            if (total < 2) return;

            // Draw in FADE_ZONES groups — one path per zone = very few draw calls
            // No ctx.filter: use shadowBlur (GPU-accelerated) for glow
            for (let z = 0; z < FADE_ZONES; z++) {
                const frac0 = z / FADE_ZONES;
                const frac1 = (z + 1) / FADE_ZONES;
                const alpha = Math.pow(1 - frac0, 1.8); // head=1, tail→0
                if (alpha < 0.01) continue;

                const i0 = Math.floor(frac0 * total);
                const i1 = Math.min(Math.floor(frac1 * total), total - 1);
                if (i1 <= i0) continue;

                const zHue = (hue + frac0 * 70) % 360;
                const width = BASE_RADIUS * 2 * (1 - frac0 * 0.55);

                // ── Glow pass (wide, shadowBlur only, no css filter) ────────────
                ctx.save();
                ctx.globalAlpha = alpha * 0.45;
                ctx.lineWidth = width * 2.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = `hsl(${zHue}, 100%, 68%)`;
                ctx.shadowBlur = 22;
                ctx.shadowColor = `hsl(${zHue}, 100%, 68%)`;
                ctx.beginPath();
                ctx.moveTo(sX[i0], sY[i0]);
                for (let i = i0 + 1; i <= i1; i++) {
                    if (i < total - 1) {
                        ctx.quadraticCurveTo(sX[i], sY[i], (sX[i] + sX[i + 1]) / 2, (sY[i] + sY[i + 1]) / 2);
                    } else {
                        ctx.lineTo(sX[i], sY[i]);
                    }
                }
                ctx.stroke();
                ctx.restore();

                // ── Core pass (thin, crisp, bright) ─────────────────────────────
                ctx.save();
                ctx.globalAlpha = alpha * 0.95;
                ctx.lineWidth = Math.max(0.8, width * 0.7);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = `hsl(${(zHue + 30) % 360}, 100%, 82%)`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = `hsl(${(zHue + 30) % 360}, 100%, 90%)`;
                ctx.beginPath();
                ctx.moveTo(sX[i0], sY[i0]);
                for (let i = i0 + 1; i <= i1; i++) {
                    if (i < total - 1) {
                        ctx.quadraticCurveTo(sX[i], sY[i], (sX[i] + sX[i + 1]) / 2, (sY[i] + sY[i + 1]) / 2);
                    } else {
                        ctx.lineTo(sX[i], sY[i]);
                    }
                }
                ctx.stroke();
                ctx.restore();
            }

            // Particles — no filter, just shadowBlur
            ctx.save();
            ctx.shadowBlur = 6;
            for (const p of particles) {
                const a = (p.life / p.maxLife) * 0.8;
                ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, ${a})`;
                ctx.fillStyle = `hsla(${p.hue}, 100%, 78%, ${a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9998, mixBlendMode: 'screen' }}
        />
    );
}
