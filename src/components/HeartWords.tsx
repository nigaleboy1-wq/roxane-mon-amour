'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Easing ───
const easeOut = [0.22, 1, 0.36, 1] as const
const easeOutExpo = [0.16, 1, 0.3, 1] as const

// ─── Heart parametric path (SVG cubic bezier) ───
// A perfectly smooth heart using cubic bezier curves
const HEART_PATH = 'M140 240 C140 240, 30 180, 30 100 C30 50, 70 20, 110 20 C130 20, 140 35, 140 55 C140 35, 150 20, 170 20 C210 20, 250 50, 250 100 C250 180, 140 240, 140 240Z'

// ─── Generate orbiting particles ───
function generateOrbitParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2
    // Place on heart outline using parametric
    const hx = 16 * Math.pow(Math.sin(t), 3)
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    // Normalize to SVG viewBox
    const nx = hx / 17 * 105 + 140
    const ny = hy / 17 * 100 + 130
    return {
      id: i,
      baseX: nx,
      baseY: ny,
      size: 0.8 + Math.random() * 2.2,
      orbitRadius: 8 + Math.random() * 20,
      orbitSpeed: 1.5 + Math.random() * 2.5,
      orbitDelay: Math.random() * 3,
      driftX: (Math.random() - 0.5) * 12,
      driftY: (Math.random() - 0.5) * 12,
      hue: 345 + Math.random() * 25,
      brightness: 0.55 + Math.random() * 0.3,
    }
  })
}

// ─── Floating dust / ember particles ───
function generateEmbers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 60 + Math.random() * 160,
    startY: 80 + Math.random() * 120,
    size: 0.5 + Math.random() * 1.5,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
    drift: (Math.random() - 0.5) * 40,
    opacity: 0.15 + Math.random() * 0.35,
  }))
}

// ─── Love words that float up from heart ───
const loveWords = [
  'je t\'aime', 'amour', 'toujours', 'mon cœur', 'tendresse',
  'passion', 'pour toi', 'infini', 'caresse', 'ensemble',
  'Roxane', 'bébé', 'flamme', 'désir', 'romance',
]

export default function HeartWords() {
  const [phase, setPhase] = useState<'drawing' | 'filling' | 'alive'>('drawing')
  const [isHovered, setIsHovered] = useState(false)

  const orbitParticles = useMemo(() => generateOrbitParticles(35), [])
  const embers = useMemo(() => generateEmbers(18), [])
  const floatingWords = useMemo(() =>
    loveWords.map((word, i) => ({
      word,
      delay: 4.5 + i * 0.7,
      x: 80 + Math.random() * 120,
      fontSize: 0.55 + Math.random() * 0.5,
      duration: 5 + Math.random() * 3,
    })),
  [])

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('filling'), 1800)
    const t2 = setTimeout(() => setPhase('alive'), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const pathLength = phase === 'drawing' ? 1 : 1

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 340, height: 340 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ═══ DEEP BACKGROUND GLOW ═══ */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          background: 'radial-gradient(circle, rgba(180, 20, 60, 0.12) 0%, rgba(120, 10, 40, 0.06) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={phase === 'alive' ? {
          opacity: [0.5, 0.9, 0.5],
          scale: [0.97, 1.06, 0.97],
        } : { opacity: phase === 'filling' ? 0.6 : 0.3, scale: phase === 'filling' ? 1 : 0.8 }}
        transition={phase === 'alive' ? {
          duration: 3,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
          times: [0, 0.35, 1],
        } : { duration: 1.2, ease: easeOut as unknown as number[] }}
      />

      {/* ═══ SECONDARY HALO — offset, warmer ═══ */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(255, 80, 100, 0.08) 0%, transparent 65%)',
          filter: 'blur(30px)',
          marginTop: -15,
        }}
        initial={{ opacity: 0 }}
        animate={phase === 'alive' ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
          delay: 0.5,
        }}
      />

      {/* ═══ MAIN SVG HEART ═══ */}
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 270"
        className="relative z-10"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="heartGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Gradient fill */}
          <linearGradient id="heartFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(220, 30, 70, 0.35)" />
            <stop offset="50%" stopColor="rgba(180, 20, 60, 0.2)" />
            <stop offset="100%" stopColor="rgba(140, 10, 50, 0.3)" />
          </linearGradient>
          <linearGradient id="heartStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.72 0.22 12)" />
            <stop offset="50%" stopColor="oklch(0.65 0.20 350)" />
            <stop offset="100%" stopColor="oklch(0.60 0.18 10)" />
          </linearGradient>
          {/* Radial inner glow */}
          <radialGradient id="innerGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 100, 130, 0.25)" />
            <stop offset="70%" stopColor="rgba(255, 50, 80, 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Outer glow stroke (wide, faint) */}
        <motion.path
          d={HEART_PATH}
          fill="none"
          stroke="rgba(255, 60, 90, 0.15)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: phase === 'alive' ? [0.15, 0.3, 0.15] : 0.15,
          }}
          transition={{
            pathLength: { duration: 2, ease: easeOut as unknown as number[] },
            opacity: phase === 'alive'
              ? { duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
              : { duration: 0.5 },
          }}
          filter="url(#heartGlowStrong)"
          style={{ transformOrigin: '140px 130px' }}
        />

        {/* Main stroke — the bright line */}
        <motion.path
          d={HEART_PATH}
          fill="none"
          stroke="url(#heartStroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            strokeWidth: isHovered ? 2.5 : 2,
          }}
          transition={{
            pathLength: { duration: 2, ease: easeOut as unknown as number[] },
            opacity: { duration: 0.8, delay: 0.3 },
            strokeWidth: { duration: 0.3 },
          }}
          filter="url(#heartGlow)"
          style={{ transformOrigin: '140px 130px' }}
        />

        {/* Fill — fades in after stroke draws */}
        <motion.path
          d={HEART_PATH}
          fill="url(#heartFill)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'drawing' ? 0 : phase === 'filling' ? 1 : [0.7, 1, 0.7],
            scale: phase === 'alive' ? [1, 1.04, 1] : 1,
          }}
          transition={
            phase === 'alive'
              ? { duration: 2.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1], times: [0, 0.3, 1] }
              : { duration: 1.2, ease: easeOutExpo as unknown as number[] }
          }
          style={{ transformOrigin: '140px 130px' }}
        />

        {/* Inner glow overlay */}
        <motion.path
          d={HEART_PATH}
          fill="url(#innerGlow)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'alive' ? [0.4, 0.8, 0.4] : phase === 'filling' ? 0.4 : 0,
          }}
          transition={
            phase === 'alive'
              ? { duration: 3, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay: 0.3 }
              : { duration: 1.5, ease: easeOut as unknown as number[] }
          }
          style={{ transformOrigin: '140px 130px' }}
        />

        {/* ═══ ORBITING PARTICLES ═══ */}
        {orbitParticles.map((p) => (
          <motion.circle
            key={p.id}
            cx={p.baseX}
            cy={p.baseY}
            r={p.size}
            fill={`oklch(${p.brightness} 0.18 ${p.hue})`}
            initial={{ opacity: 0 }}
            animate={
              phase === 'alive'
                ? {
                    cx: [p.baseX, p.baseX + p.orbitRadius, p.baseX - p.driftX, p.baseX],
                    cy: [p.baseY, p.baseY - p.orbitRadius * 0.6, p.baseY - p.driftY, p.baseY],
                    opacity: [0, 0.7, 0.4, 0],
                    r: [p.size * 0.5, p.size * 1.2, p.size, p.size * 0.5],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: p.orbitSpeed,
              repeat: Infinity,
              delay: p.orbitDelay,
              ease: [0.45, 0, 0.55, 1],
            }}
            style={{ transformOrigin: `${p.baseX}px ${p.baseY}px` }}
          />
        ))}

        {/* ═══ EMBER PARTICLES rising from heart ═══ */}
        {embers.map((e) => (
          <motion.circle
            key={`e-${e.id}`}
            cx={e.x}
            r={e.size}
            fill={`rgba(255, ${80 + Math.random() * 100}, ${100 + Math.random() * 60}, ${e.opacity})`}
            initial={{ opacity: 0, cy: e.startY + 60 }}
            animate={
              phase === 'alive'
                ? {
                    cy: [e.startY + 60, e.startY - 30],
                    cx: [e.x, e.x + e.drift],
                    opacity: [0, e.opacity, e.opacity * 0.3, 0],
                    r: [e.size * 0.3, e.size, e.size * 0.6, 0],
                  }
                : { opacity: 0 }
            }
            transition={{
              duration: e.duration,
              repeat: Infinity,
              delay: e.delay,
              ease: 'linear' as const,
            }}
          />
        ))}
      </svg>

      {/* ═══ FLOATING LOVE WORDS — rise from heart ═══ */}
      <AnimatePresence>
        {phase === 'alive' && floatingWords.map((fw) => (
          <motion.span
            key={fw.word}
            className="absolute pointer-events-none select-none"
            style={{
              left: fw.x,
              bottom: 60,
              fontSize: `${fw.fontSize}rem`,
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif",
              fontWeight: 300,
              color: `oklch(${0.55 + Math.random() * 0.15} ${0.12 + Math.random() * 0.08} ${348 + Math.random() * 14})`,
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{
              opacity: [0, 0.45, 0.3, 0],
              y: [-10, -60, -100, -140],
              x: [(Math.random() - 0.5) * 10, fw.drift ? fw.drift : (Math.random() - 0.5) * 30],
              scale: [0.8, 1, 1.05, 0.95],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: fw.duration,
              repeat: Infinity,
              delay: fw.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {fw.word}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* ═══ CENTER TEXT — appears after heart fills ═══ */}
      <AnimatePresence>
        {phase === 'alive' && (
          <motion.div
            className="absolute z-20 flex flex-col items-center pointer-events-none"
            style={{ top: '48%', left: '50%', transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: easeOutExpo as unknown as number[] }}
          >
            <motion.p
              style={{
                fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive",
                color: 'oklch(0.80 0.10 350)',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)',
                letterSpacing: '0.06em',
                textShadow: '0 0 20px rgba(255, 80, 100, 0.3)',
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                textShadow: [
                  '0 0 15px rgba(255, 80, 100, 0.2)',
                  '0 0 30px rgba(255, 80, 100, 0.5)',
                  '0 0 15px rgba(255, 80, 100, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            >
              pour toi
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SHIMMER LINE — travels along heart outline ═══ */}
      <AnimatePresence>
        {phase === 'alive' && (
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 270"
            className="absolute z-10 pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            <motion.path
              d={HEART_PATH}
              fill="none"
              stroke="rgba(255, 200, 210, 0.5)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="15 250"
              filter="url(#heartGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                pathLength: { duration: 3, repeat: Infinity, ease: 'linear' as const, repeatDelay: 1 },
                opacity: { duration: 3, repeat: Infinity, ease: 'linear' as const, repeatDelay: 1, times: [0, 0.1, 0.85, 1] },
              }}
              style={{ transformOrigin: '140px 130px' }}
            />
          </svg>
        )}
      </AnimatePresence>
    </div>
  )
}