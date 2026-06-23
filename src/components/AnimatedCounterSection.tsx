'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import TextReveal from './TextReveal'

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

// Smooth count-up hook with easing
function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const animate = (now: number) => {
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration, start])

  return value
}

function StatBlock({ value, label, suffix, delay }: { value: number; label: string; suffix: string; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const count = useCountUp(value, 2000, isInView)

  return (
    <motion.div
      ref={ref}
      className="text-center relative"
      initial={{ opacity: 0.15, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: easeOutExpo as unknown as number[] }}
    >
      {/* Number with odometer feel */}
      <div
        className="relative overflow-hidden"
        style={{ height: '4rem', lineHeight: '4rem' }}
      >
        <motion.span
          style={{
            ...display,
            color: c.ink,
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            display: 'block',
          }}
          key={count}
          initial={{ y: 20, opacity: 0.5, filter: 'blur(2px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {count.toLocaleString('fr-FR')}{suffix}
        </motion.span>
      </div>

      {/* Label */}
      <p
        style={{
          ...display,
          color: c.inkFaint,
          fontSize: 'var(--text-caption)',
          fontWeight: 300,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: '0.25rem',
        }}
      >
        {label}
      </p>

      {/* Underline */}
      <motion.div
        className="mx-auto mt-3"
        style={{
          width: 30,
          height: 1,
          background: c.accent,
          opacity: 0.3,
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.5, ease: easeOut as unknown as number[] }}
      />
    </motion.div>
  )
}

export default function AnimatedCounterSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const COUPLE_START = new Date('2024-01-15')
  const now = new Date()
  const diffMs = now.getTime() - COUPLE_START.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  // For the big counter, we use a live-updating effect
  const [liveTime, setLiveTime] = useState({ days, hours, minutes, seconds })

  useEffect(() => {
    const interval = setInterval(() => {
      const n = new Date()
      const d = n.getTime() - COUPLE_START.getTime()
      setLiveTime({
        days: Math.floor(d / (1000 * 60 * 60 * 24)),
        hours: Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((d % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((d % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative px-6"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
    >
      {/* Heading */}
      <div className="text-center mb-14" style={{ maxWidth: '65ch', margin: '0 auto 3.5rem' }}>
        <motion.p
          className="tracking-[0.25em] uppercase mb-3"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeOut as unknown as number[] }}
        >
          chaque seconde compte
        </motion.p>
        <TextReveal
          text="Notre Histoire en Chiffres"
          as="h2"
          style={{
            ...display,
            color: c.ink,
            fontSize: 'var(--text-h2)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
          }}
          delay={0.15}
        />
      </div>

      {/* Main live counter */}
      <motion.div
        className="max-w-2xl mx-auto mb-16 p-8 md:p-12 relative overflow-hidden"
        style={{
          borderRadius: '12px',
          border: '1px solid rgba(255, 80, 100, 0.06)',
          background: 'rgba(255, 255, 255, 0.015)',
          backdropFilter: 'blur(10px)',
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.3, ease: easeOutExpo as unknown as number[] }}
      >
        {/* Inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(180,40,80,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="grid grid-cols-4 gap-4 relative z-10">
          {[
            { value: liveTime.days, label: 'jours', suffix: '' },
            { value: liveTime.hours, label: 'heures', suffix: '' },
            { value: liveTime.minutes, label: 'minutes', suffix: '' },
            { value: liveTime.seconds, label: 'secondes', suffix: '' },
          ].map((item, i) => (
            <motion.div key={i} className="text-center">
              <span
                style={{
                  ...display,
                  color: c.ink,
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                {String(item.value).padStart(2, '0')}{item.suffix}
              </span>
              <span
                style={{
                  ...display,
                  color: c.inkFaint,
                  fontSize: 'var(--text-caption)',
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Colon separators */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="grid grid-cols-4 gap-4 w-full px-4">
            {[1, 2].map(i => (
              <div key={i} className="hidden" />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Static stats */}
      <div className="max-w-xl mx-auto grid grid-cols-3 gap-8">
        <StatBlock value={days} label="jours ensemble" suffix="" delay={0.4} />
        <StatBlock value={days * 24} label="heures d'amour" suffix="" delay={0.6} />
        <StatBlock value={days * 1440} label="minutes de bonheur" suffix="" delay={0.8} />
      </div>
    </section>
  )
}