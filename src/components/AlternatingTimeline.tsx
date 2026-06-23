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
  line: 'rgba(255, 80, 100, 0.2)',
}

const moments = [
  { title: "Le jour où on s'est rencontrés", text: "Le jour où tout a commencé, où le monde a changé de couleur grâce à toi, Roxane.", icon: "✦" },
  { title: 'Notre premier baiser', text: "Ce moment magique où le temps s'est arrêté, où nos lèvres se sont trouvées.", icon: "♡" },
  { title: 'Notre première danse', text: "Enveloppés l'un dans l'autre, le monde entier a disparu autour de nous.", icon: "♪" },
  { title: 'Nos rires partagés', text: "Ces éclats de rire qui résonnent encore dans ma mémoire, ma musique préférée.", icon: "✧" },
  { title: 'Chaque matin à tes côtés', text: "Me réveiller et te voir dormir est le plus beau spectacle du monde.", icon: "❋" },
]

export default function AlternatingTimeline() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      id="moments"
      className="relative px-6"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
    >
      {/* Heading */}
      <div className="text-center mb-16" style={{ maxWidth: '65ch', margin: '0 auto 4rem' }}>
        <motion.p
          className="tracking-[0.25em] uppercase mb-3"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeOut as unknown as number[] }}
        >
          gravés dans ma mémoire
        </motion.p>
        <TextReveal
          text="Nos Plus Beaux Moments"
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

      {/* Timeline */}
      <div className="max-w-2xl mx-auto relative">
        {/* Center line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: `linear-gradient(to bottom, transparent, ${c.line}, ${c.line}, transparent)` }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 2.5, ease: easeOut as unknown as number[] }}
        />

        <div className="space-y-16 md:space-y-20">
          {moments.map((moment, i) => {
            const isLeft = i % 2 === 0

            return (
              <TimelineItem
                key={i}
                moment={moment}
                index={i}
                isLeft={isLeft}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TimelineItem({
  moment,
  index,
  isLeft,
}: {
  moment: typeof moments[0]
  index: number
  isLeft: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div
      ref={ref}
      className="relative flex items-start"
      style={{ flexDirection: isLeft ? 'row' : 'row-reverse' }}
    >
      {/* Content card */}
      <motion.div
        className="w-[calc(50%-2rem)] relative group"
        style={isLeft ? { marginRight: 'auto' } : { marginLeft: 'auto' }}
        initial={{ opacity: 0.15, x: isLeft ? -25 : 25, y: 10 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.1, ease: easeOutExpo as unknown as number[] }}
      >
        {/* Glass card */}
        <div
          className="p-5 md:p-6 relative"
          style={{
            borderRadius: '10px',
            border: '1px solid rgba(255, 80, 100, 0.06)',
            background: 'rgba(255, 255, 255, 0.015)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Icon */}
          <span
            className="block mb-3"
            style={{ color: c.accent, fontSize: '0.9rem', opacity: 0.7 }}
          >
            {moment.icon}
          </span>

          <h3
            style={{
              ...display,
              color: c.ink,
              fontSize: 'var(--text-h3)',
              fontWeight: 500,
              letterSpacing: '0.01em',
              lineHeight: 1.3,
              marginBottom: '0.5rem',
            }}
          >
            {moment.title}
          </h3>

          <p
            style={{
              ...display,
              color: c.inkFaint,
              fontSize: 'var(--text-body)',
              fontWeight: 300,
              letterSpacing: '0.01em',
              maxWidth: '45ch',
              lineHeight: 1.65,
            }}
          >
            {moment.text}
          </p>
        </div>

        {/* Connector line to center */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-px"
          style={{
            [isLeft ? 'right' : 'left']: '-2rem',
            background: c.line,
          }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-2 z-10"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'rgba(255, 50, 80, 0.1)',
          border: `1.5px solid ${c.accentSoft}`,
          boxShadow: '0 0 15px rgba(255, 60, 90, 0.1)',
        }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: [0, 1.3, 1] } : {}}
        transition={{ duration: 0.5, delay: 0.3, ease: easeOut as unknown as number[] }}
      />

      {/* Empty space on opposite side */}
      <div className="w-[calc(50%-2rem)]" />
    </div>
  )
}