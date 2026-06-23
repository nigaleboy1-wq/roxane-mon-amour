'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const easeOut = [0.22, 1, 0.36, 1] as const
const easeOutExpo = [0.16, 1, 0.3, 1] as const

const display = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif" }
const script = { fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive" }
const c = {
  ink: 'oklch(0.82 0.06 350)',
  inkDim: 'oklch(0.68 0.08 350)',
  inkFaint: 'oklch(0.55 0.06 350)',
  accent: 'oklch(0.65 0.20 10)',
}

// ─── Firework heart particle ───
interface HeartParticle {
  id: number
  x: number
  y: number
  color: string
  size: number
  delay: number
  duration: number
  angle: number
  distance: number
  shape: 'heart' | 'circle' | 'star'
}

function generateFirework(cx: number, cy: number, id: number): HeartParticle[] {
  const count = 24
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const dist = 80 + Math.random() * 160
    const hue = 340 + Math.random() * 30
    const shapes: Array<'heart' | 'circle' | 'star'> = ['heart', 'circle', 'star']
    return {
      id: `${id}-${i}`,
      x: cx,
      y: cy,
      color: `oklch(${0.6 + Math.random() * 0.2} ${0.15 + Math.random() * 0.1} ${hue})`,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1.5,
      angle,
      distance: dist,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }
  })
}

function HeartShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function FireworkBurst({ particles }: { particles: HeartParticle[] }) {
  return (
    <>
      {particles.map((p) => {
        const tx = Math.cos(p.angle) * p.distance
        const ty = Math.sin(p.angle) * p.distance - 40 // slight upward bias

        return (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none"
            style={{ left: p.x, top: p.y, zIndex: 20 }}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.2, 0.4],
              x: [0, tx, tx * 1.1],
              y: [0, ty, ty * 1.2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {p.shape === 'heart' ? (
              <HeartShape size={p.size * 2.5} color={p.color} />
            ) : p.shape === 'star' ? (
              <span style={{ fontSize: p.size * 2, color: p.color, lineHeight: 1 }}>✦</span>
            ) : (
              <div
                style={{
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  background: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                }}
              />
            )}
          </motion.div>
        )
      })}
    </>
  )
}

export default function SpectacularEnding() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [fireworks, setFireworks] = useState<HeartParticle[][]>([])
  const [showFinalText, setShowFinalText] = useState(false)
  const nextId = useRef(0)
  const [typewriterText, setTypewriterText] = useState('')

  const finalMessage = "Roxane, tu es et tu seras toujours le plus beau chapitre de ma vie. Je t'aime, aujourd'hui, demain, et pour l'éternité."

  // Launch fireworks periodically when in view
  useEffect(() => {
    if (!isInView) return

    const launch = () => {
      const id = nextId.current++
      const cx = 100 + Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 200 : 400)
      const cy = 80 + Math.random() * 250
      const fw = generateFirework(cx, cy, id)
      setFireworks((prev) => [...prev, fw])

      // Remove after animation
      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f[0]?.id?.split('-')[0] !== String(id)))
      }, 3500)
    }

    // Staggered launches
    const timers = [
      setTimeout(launch, 800),
      setTimeout(launch, 1400),
      setTimeout(launch, 2000),
      setTimeout(launch, 2800),
      setTimeout(launch, 3500),
      setTimeout(launch, 4200),
      setTimeout(launch, 5000),
    ]

    // Show final text after first fireworks
    const textTimer = setTimeout(() => setShowFinalText(true), 1500)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(textTimer)
    }
  }, [isInView])

  // Typewriter effect
  useEffect(() => {
    if (!showFinalText) return
    let i = 0
    const interval = setInterval(() => {
      if (i < finalMessage.length) {
        setTypewriterText(finalMessage.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [showFinalText])

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)', minHeight: '80vh' }}
    >
      {/* Fireworks container */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 15 }}>
        {fireworks.map((fw, i) => (
          <FireworkBurst key={i} particles={fw} />
        ))}
      </div>

      {/* Central glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200, 40, 80, 0.08) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={isInView ? {
          opacity: [0.3, 0.7, 0.3],
          scale: [0.95, 1.05, 0.95],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      />

      {/* Heart icon */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easeOutExpo as unknown as number[] }}
            className="relative z-20 mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
                times: [0, 0.2, 0.4, 0.6, 1],
              }}
            >
              <HeartShape size={48} color="oklch(0.65 0.20 10)" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final message */}
      <AnimatePresence>
        {showFinalText && (
          <motion.div
            className="relative z-20 text-center max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeOutExpo as unknown as number[] }}
          >
            <p
              className="leading-relaxed"
              style={{
                ...display,
                color: c.ink,
                fontSize: 'var(--text-body)',
                fontWeight: 300,
                letterSpacing: '0.01em',
                lineHeight: 1.9,
                minHeight: '8em',
              }}
            >
              {typewriterText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const }}
                style={{ color: c.accent }}
              >
                |
              </motion.span>
            </p>

            <motion.p
              className="mt-8"
              style={{ ...script, color: c.accent, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1, ease: easeOut as unknown as number[] }}
            >
              pour toujours et à jamais...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--surface))' }}
      />
    </section>
  )
}