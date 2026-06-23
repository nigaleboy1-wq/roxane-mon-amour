'use client'

import { useRef } from 'react'
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
  accentSoft: 'oklch(0.60 0.12 350)',
}

const promises = [
  { text: "te faire rire chaque jour, même quand tout va mal", icon: "✦" },
  { text: "être ton refuge quand le monde sera trop lourd", icon: "❋" },
  { text: "t'écouter, vraiment t'écouter, même à 3h du matin", icon: "✧" },
  { text: "te choisir, encore et encore, chaque matin", icon: "♡" },
  { text: "danser avec toi dans la cuisine, même sans musique", icon: "♪" },
  { text: "que ton cœur sera toujours en sécurité avec moi", icon: "✦" },
]

export default function PromiseCards() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

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
          mes vœux pour toi
        </motion.p>
        <TextReveal
          text="Mes Promesses"
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

      {/* Cards grid — 2 columns on desktop, 1 on mobile */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {promises.map((promise, i) => (
          <PromiseCard key={i} promise={promise} index={i} />
        ))}
      </div>
    </section>
  )
}

function PromiseCard({ promise, index }: { promise: typeof promises[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      className="group relative p-5 md:p-6 cursor-default"
      style={{
        borderRadius: '12px',
        border: '1px solid rgba(255, 80, 100, 0.05)',
        background: 'rgba(255, 255, 255, 0.012)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0.15, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: easeOutExpo as unknown as number[],
      }}
      whileHover={{
        borderColor: 'rgba(255, 80, 100, 0.12)',
        background: 'rgba(255, 255, 255, 0.025)',
        y: -2,
      }}
    >
      {/* Icon */}
      <span
        style={{
          ...script,
          color: c.accent,
          fontSize: '1.1rem',
          opacity: 0.6,
          display: 'block',
          marginBottom: '0.75rem',
        }}
      >
        {promise.icon}
      </span>

      {/* Text */}
      <p
        className="italic leading-relaxed"
        style={{
          ...display,
          color: c.inkDim,
          fontSize: 'var(--text-body)',
          fontWeight: 400,
          letterSpacing: '0.01em',
        }}
      >
        &ldquo;Je promets de {promise.text}&rdquo;
      </p>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '12px',
          opacity: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(180,40,80,0.04), transparent 70%)',
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Number */}
      <span
        className="absolute top-4 right-5"
        style={{
          ...display,
          color: 'rgba(255, 80, 100, 0.08)',
          fontSize: '2rem',
          fontWeight: 300,
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.div>
  )
}