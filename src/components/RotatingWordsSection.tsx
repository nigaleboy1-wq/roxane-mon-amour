'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
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
  accentSoft: 'oklch(0.60 0.12 350)',
}

const compliments = [
  'magnifique',
  'ma lumière',
  'tout pour moi',
  'mon bonheur',
  'irremplaçable',
  'ma raison de sourire',
  'la plus belle',
  'mon univers',
  'pure magie',
  'ma favorite',
]

export default function RotatingWordsSection() {
  const [index, setIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % compliments.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center justify-center px-6"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(180,40,80,0.05) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2, ease: easeOutExpo as unknown as number[] }}
      />

      {/* Eyebrow */}
      <motion.p
        style={{ ...script, color: c.inkFaint, fontSize: '1rem', letterSpacing: '0.25em' }}
        className="uppercase text-center mb-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: easeOut as unknown as number[] }}
      >
        ce que tu es pour moi
      </motion.p>

      {/* Main line */}
      <div className="relative h-[5rem] md:h-[6rem] flex items-center justify-center">
        <TextReveal
          text="Roxane, tu es"
          as="span"
          style={{ ...display, color: c.ink, fontSize: 'var(--text-h2)', fontWeight: 300, letterSpacing: '0.02em' }}
          delay={0.2}
          perWord
          stagger={0.08}
        />

        {/* Rotating word */}
        <span className="mx-3" />

        <div className="relative inline-block" style={{ minWidth: '220px', textAlign: 'left' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={compliments[index]}
              style={{
                ...script,
                color: c.accent,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                display: 'inline-block',
                textShadow: '0 0 30px rgba(255, 80, 100, 0.25)',
              }}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)', scale: 0.9 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)', scale: 0.95 }}
              transition={{ duration: 0.6, ease: easeOut as unknown as number[] }}
            >
              {compliments[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Underline accent */}
      <motion.div
        className="mt-8"
        style={{
          width: 60,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${c.accentSoft}, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 1.5, ease: easeOutExpo as unknown as number[] }}
      />
    </section>
  )
}