'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import HeartWords from '@/components/HeartWords'
import Image from 'next/image'

// ─── Font aliases ───
const display = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif" }
const script = { fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive" }

// ─── Shared easing (impeccable: ease-out quint/expo) ───
const easeOut = [0.22, 1, 0.36, 1] as const
const easeOutExpo = [0.16, 1, 0.3, 1] as const
const easeSmooth = [0.45, 0, 0.55, 1] as const

// ─── Color tokens ───
const colors = {
  ink: 'oklch(0.82 0.06 350)',
  inkDim: 'oklch(0.68 0.08 350)',
  inkFaint: 'oklch(0.55 0.06 350)',
  accent: 'oklch(0.65 0.20 10)',
  accentSoft: 'oklch(0.60 0.12 350)',
  glow: 'rgba(255, 60, 90, 0.15)',
  surface: '#0b0407',
  surfaceUp: '#140a0e',
  line: 'rgba(255, 80, 100, 0.2)',
}

// ─── Ambient particles — fewer, subtler (impeccable: less can be more) ───
function AmbientParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: `rgba(255, ${90 + Math.random() * 60}, ${110 + Math.random() * 50}, 0.12)`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.06, 0.2, 0.06],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  )
}

function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`fh-${i}`}
          className="absolute"
          style={{
            left: `${5 + Math.random() * 90}%`,
            fontSize: `${0.25 + Math.random() * 0.4}rem`,
            opacity: 0.04 + Math.random() * 0.05,
            color: colors.inkFaint,
          }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: [0, 12, -8, 15, -10, 0],
            x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 18 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: 'linear' as const,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 5.5, duration: 1, ease: easeOut }}
    >
      <span
        className="tracking-[0.35em] uppercase"
        style={{ ...script, color: colors.inkFaint, fontSize: '1.1rem' }}
      >
        fais défiler
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: easeSmooth }}
        style={{ color: 'rgba(255, 120, 140, 0.25)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

function Divider() {
  return (
    <div className="flex items-center justify-center py-8 md:py-12">
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, ease: easeOut }}
      >
        <div className="h-px w-10 md:w-16" style={{ background: `linear-gradient(90deg, transparent, ${colors.line})` }} />
        <motion.span
          className="text-sm"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: easeSmooth }}
          style={{ color: colors.inkFaint }}
        >
          ✦
        </motion.span>
        <div className="h-px w-10 md:w-16" style={{ background: `linear-gradient(90deg, ${colors.line}, transparent)` }} />
      </motion.div>
    </div>
  )
}

// ─── Section heading component ───
function SectionHeading({ eyebrow, title, delay = 0 }: { eyebrow: string; title: string; delay?: number }) {
  return (
    <motion.div className="text-center mb-14 md:mb-16" style={{ maxWidth: '65ch', margin: '0 auto 3.5rem' }}>
      <motion.p
        className="tracking-[0.25em] uppercase mb-3"
        style={{ ...script, color: colors.inkFaint, fontSize: '1rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: easeOut, delay }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="font-light"
        style={{
          ...display,
          color: colors.ink,
          fontSize: 'var(--text-h2)',
          letterSpacing: '0.02em',
          fontWeight: 300,
          lineHeight: 1.2,
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: delay + 0.15, ease: easeOutExpo }}
      >
        {title}
      </motion.h2>
    </motion.div>
  )
}

function PoemLine({ children, delay = 0, highlight = false }: { children: string; delay?: number; highlight?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.p
      ref={ref}
      className="text-center"
      style={{
        ...display,
        overflow: 'hidden',
        fontSize: highlight ? 'clamp(1.1rem, 1.5vw, 1.3rem)' : 'var(--text-body)',
        letterSpacing: highlight ? '0.03em' : '0.015em',
        lineHeight: highlight ? 1.9 : 2,
        fontWeight: highlight ? 500 : 300,
        color: highlight ? colors.ink : colors.inkDim,
      }}
      // Impeccable: reveal must enhance already-visible default
      initial={{ opacity: 0.15, y: 12, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.2, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.p>
  )
}

// ═══════════════════════════════════════════════════════
// ─── CINEMATIC GALLERY ───
// Cinematic masonry with clip-path reveals (impeccable: premium motion)
// ═══════════════════════════════════════════════════════
function CinematicGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const photos = [
    { src: '/photos/roxane-1.jpg', caption: 'Mon rayon de soleil', span: 'row-span-2' },
    { src: '/photos/roxane-2.jpg', caption: 'Celle qui fait battre mon cœur', span: '' },
    { src: '/photos/roxane-3.jpg', caption: 'La plus belle femme du monde', span: '' },
    { src: '/photos/roxane-4.jpg', caption: 'Mon bonheur à moi', span: 'col-span-2' },
  ]

  return (
    <section id="galerie" className="relative px-5 md:px-8" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <SectionHeading eyebrow="quelques souvenirs" title="La Plus Belle" />

      <div className="max-w-3xl mx-auto grid grid-cols-2 gap-2.5 md:gap-3.5 auto-rows-[180px] md:auto-rows-[220px]">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className={`relative cursor-pointer overflow-hidden group ${photo.span}`}
            style={{
              borderRadius: '2px',
            }}
            // Clip-path reveal for premium feel
            initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0.5 }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: easeOutExpo }}
            onClick={() => setSelectedPhoto(i)}
          >
            <Image
              src={photo.src}
              alt="Roxane"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 45vw, 350px"
            />
            {/* Warm tonal overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(180deg, rgba(11,4,7,0) 40%, rgba(11,4,7,0.7) 100%)',
                opacity: 0.6,
              }}
            />
            {/* Caption — always visible, enhances on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <p
                className="transition-all duration-500"
                style={{
                  ...script,
                  color: `color-mix(in oklch, ${colors.ink} 70%, transparent)`,
                  fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                  transform: 'translateY(4px)',
                }}
              >
                {photo.caption}
              </p>
            </div>
            {/* Hover: subtle border glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 0 1px rgba(255, 100, 130, 0.15), 0 8px 30px rgba(0,0,0,0.4)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox — cinematic wide format */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(5, 2, 3, 0.96)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl aspect-[4/5] md:aspect-[3/4] overflow-hidden"
              style={{
                borderRadius: '3px',
                boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[selectedPhoto].src}
                alt="Roxane"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 600px"
              />
              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.4)' }}
              />
              {/* Film grain overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />
            </motion.div>
            <motion.p
              className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center"
              style={{ ...script, color: colors.inkDim, fontSize: '1.2rem' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: easeOut }}
            >
              {photos[selectedPhoto].caption}
            </motion.p>
            {/* Close */}
            <motion.button
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
              onClick={() => setSelectedPhoto(null)}
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
            {/* Nav */}
            <motion.button
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1)
              }}
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
            <motion.button
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto((selectedPhoto + 1) % photos.length)
              }}
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── POEM SECTION ───
function PoemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <section id="poeme" className="relative flex flex-col items-center justify-center px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <motion.div
        ref={ref}
        className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(180,40,80,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2, ease: easeOutExpo }}
      />

      <SectionHeading eyebrow="mots du cœur" title="Mon Poème pour Toi" />

      <div className="max-w-lg space-y-3 relative z-10">
        <PoemLine delay={0.2}>Roxane, dans le silence de la nuit,</PoemLine>
        <PoemLine delay={0.4}>je murmure ton nom dans le vent,</PoemLine>
        <PoemLine delay={0.6}>et chaque étoile qui s&apos;allume</PoemLine>
        <PoemLine delay={0.8}>me rappelle que tu existes.</PoemLine>
        <div className="py-4" />
        <PoemLine delay={1.1}>Tes yeux sont deux océans</PoemLine>
        <PoemLine delay={1.3}>où je voudrais me noyer pour toujours,</PoemLine>
        <PoemLine delay={1.5}>ton sourire est le soleil</PoemLine>
        <PoemLine delay={1.7}>qui réchauffe mes jours les plus froids.</PoemLine>
        <div className="py-4" />
        <PoemLine delay={2.0}>Chaque seconde loin de toi, Roxane,</PoemLine>
        <PoemLine delay={2.2}>est une éternité qui me dévore,</PoemLine>
        <PoemLine delay={2.4}>et chaque instant à tes côtés</PoemLine>
        <PoemLine delay={2.6}>est un paradis que je ne veux pas quitter.</PoemLine>
        <div className="py-4" />
        <PoemLine delay={2.9} highlight>Roxane, tu es la plus belle histoire</PoemLine>
        <PoemLine delay={3.1} highlight>que la vie m&apos;ait jamais offerte.</PoemLine>
      </div>
    </section>
  )
}

// ─── REASONS SECTION ───
// Impeccable: "cards are the lazy answer" — use a refined list instead
function ReasonsSection() {
  const reasons = [
    'Ton rire qui illumine ma journée entière, Roxane',
    'Ta douceur qui apaise mon cœur',
    'Ta passion qui me inspire chaque jour',
    'La façon dont tu me fais sentir vivant',
    'Ton regard qui me fait fondre',
    'Chaque moment avec toi est un trésor',
    'Tes câlins, mon refuge préféré',
    'Tes baisers, ma drogue préférée',
  ]
  return (
    <section id="raisons" className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <SectionHeading eyebrow="parce que tu mérites de savoir" title="Pourquoi Je T&apos;aime" />

      <div className="max-w-lg mx-auto relative">
        <motion.div
          className="absolute left-3 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${colors.line}, ${colors.line}, transparent)` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: easeOut }}
        />
        <div className="space-y-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              className="relative pl-10 md:pl-12 group"
              initial={{ opacity: 0.15, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: easeOutExpo }}
            >
              {/* Dot marker */}
              <motion.div
                className="absolute left-[5px] md:left-[7px] top-[7px] w-2 h-2 rounded-full"
                style={{ background: colors.accent }}
                whileInView={{ scale: [0, 1.4, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 + 0.1, ease: easeOut }}
              />
              <p
                className="leading-relaxed transition-colors duration-300"
                style={{
                  ...display,
                  color: colors.inkDim,
                  fontSize: 'var(--text-body)',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                {reason}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TIMELINE SECTION ───
// Impeccable: numbered markers only when content is a real sequence
function TimelineSection() {
  const moments = [
    { title: 'Le jour où on s\'est rencontrés', text: 'Le jour où tout a commencé, où le monde a changé de couleur grâce à toi, Roxane.' },
    { title: 'Notre premier baiser', text: 'Ce moment magique où le temps s\'est arrêté, où nos lèvres se sont trouvées.' },
    { title: 'Notre première danse', text: 'Enveloppés l\'un dans l\'autre, le monde entier a disparu autour de nous.' },
    { title: 'Nos rires partagés', text: 'Ces éclats de rire qui résonnent encore dans ma mémoire, ma musique préférée.' },
  ]
  return (
    <section id="moments" className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <SectionHeading eyebrow="gravés dans ma mémoire" title="Nos Plus Beaux Moments" />

      <div className="max-w-md mx-auto relative">
        <motion.div
          className="absolute left-3 md:left-4 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${colors.line}, ${colors.line}, transparent)` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: easeOut }}
        />
        <div className="space-y-14">
          {moments.map((moment, i) => (
            <motion.div
              key={i}
              className="relative pl-12 md:pl-14"
              initial={{ opacity: 0.15, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            >
              <motion.div
                className="absolute left-[3px] md:left-[5px] top-1 w-3 h-3 rounded-full"
                style={{ background: 'rgba(255,50,80,0.12)', border: `1.5px solid ${colors.accentSoft}` }}
                whileInView={{ scale: [0, 1.3, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25, ease: easeOut }}
              />
              <h3
                className="mb-1.5"
                style={{
                  ...display,
                  color: colors.ink,
                  fontSize: 'var(--text-h3)',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  lineHeight: 1.3,
                }}
              >
                {moment.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  ...display,
                  color: colors.inkFaint,
                  fontSize: 'var(--text-body)',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  maxWidth: '55ch',
                }}
              >
                {moment.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FINAL SECTION ───
function FinalSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.9, 1, 1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -20])

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center px-6 py-24 overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <motion.div
        className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,40,70,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: easeSmooth }}
      />
      <motion.div
        className="relative z-10 text-center max-w-lg mx-auto"
        style={{ opacity, scale, y }}
      >
        <motion.div
          className="text-5xl md:text-6xl mb-6"
          animate={{
            scale: [1, 1.08, 1],
            filter: [
              'drop-shadow(0 0 12px rgba(255,60,90,0.2))',
              'drop-shadow(0 0 30px rgba(255,60,90,0.5))',
              'drop-shadow(0 0 12px rgba(255,60,90,0.2))',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: easeSmooth }}
        >
          ❤️
        </motion.div>
        <motion.h2
          className="font-light mb-2"
          style={{
            ...display,
            color: colors.ink,
            fontSize: 'var(--text-h2)',
            letterSpacing: '0.03em',
            fontWeight: 300,
            lineHeight: 1.2,
            textShadow: '0 0 25px rgba(255,80,100,0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: easeOutExpo }}
        >
          À Toi, Roxane
        </motion.h2>
        <motion.p
          className="mb-8"
          style={{ ...script, color: colors.accentSoft, fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', letterSpacing: '0.06em' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
        >
          Pour Toujours
        </motion.p>
        <motion.div
          className="mx-auto mb-8"
          style={{ width: 50, height: 1, background: `linear-gradient(90deg, transparent, ${colors.line}, transparent)` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
        />
        <motion.p
          className="leading-relaxed mb-3"
          style={{
            ...display,
            color: colors.inkFaint,
            fontSize: 'var(--text-body)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            maxWidth: '55ch',
            margin: '0 auto 0.75rem',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
        >
          Ce cadeau n&apos;est qu&apos;une petite expression
        </motion.p>
        <motion.p
          className="leading-relaxed mb-6"
          style={{
            ...display,
            color: colors.inkFaint,
            fontSize: 'var(--text-body)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            maxWidth: '55ch',
            margin: '0 auto 1.5rem',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7, ease: easeOut }}
        >
          de tout ce que mon cœur ressent pour toi, Roxane.
        </motion.p>
        <motion.p
          className="italic mt-6"
          style={{
            ...script,
            color: colors.ink,
            fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
            letterSpacing: '0.03em',
            textShadow: '0 0 12px rgba(255,80,100,0.1)',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1, ease: easeOut }}
        >
          Je t&apos;aime plus que tous les mots du monde.
        </motion.p>
      </motion.div>
    </section>
  )
}

// ─── PETALS — fewer, more refined ───
function PetalsRain() {
  const petals = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: 8 + Math.random() * 84,
    delay: Math.random() * 25,
    duration: 15 + Math.random() * 18,
    size: 0.3 + Math.random() * 0.35,
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 150,
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {petals.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.left}%`, top: '-5%', fontSize: `${p.size}rem` }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [0, p.drift * 0.3, p.drift * 0.7, p.drift],
            rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
            opacity: [0, 0.08, 0.08, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' as const }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════
// ─── MAIN PAGE ───
// ═══════════════════════════════════════
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -40])

  return (
    <div
      className="relative"
      style={{
        background: 'linear-gradient(180deg, #0b0407 0%, #110810 25%, #0e0610 50%, #0a0818 75%, #0b0407 100%)',
      }}
    >
      <AmbientParticles />
      <FloatingHearts />
      <PetalsRain />

      {/* ═══ HERO — the thesis (frontend-design skill) ═══ */}
      <motion.section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh', opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`hp-${i}`}
              className="absolute rounded-full"
              style={{
                width: 1 + Math.random() * 2,
                height: 1 + Math.random() * 2,
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                background: `rgba(255, ${80 + Math.random() * 80}, ${100 + Math.random() * 60}, ${0.06 + Math.random() * 0.1})`,
              }}
              animate={{
                y: [-12, 12, -12],
                x: [-6, 6, -6],
                opacity: [0.06, 0.18, 0.06],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: easeSmooth as unknown as number[],
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Signature element: the heart — bold, everything else quiet */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="relative z-10"
        >
          <HeartWords />
        </motion.div>

        <motion.div
          className="text-center relative z-10 mt-4"
          style={{ maxWidth: '65ch' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5, ease: easeOutExpo }}
        >
          <motion.h1
            className="font-light"
            style={{
              ...display,
              color: colors.ink,
              fontSize: 'var(--text-display)',
              letterSpacing: '0.04em',
              fontWeight: 300,
              lineHeight: 1.15,
            }}
            animate={{
              textShadow: [
                '0 0 20px rgba(255, 80, 100, 0.15)',
                '0 0 40px rgba(255, 80, 100, 0.35)',
                '0 0 20px rgba(255, 80, 100, 0.15)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: easeSmooth as unknown as number[] }}
          >
            Roxane, Tu Es Mon Seul Amour
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 4.2, ease: easeOutExpo }}
            className="mt-4 mx-auto"
            style={{ width: 45, height: 1, background: `linear-gradient(90deg, transparent, ${colors.line}, transparent)` }}
          />
          <motion.p
            className="mt-3"
            style={{
              ...script,
              color: colors.inkFaint,
              letterSpacing: '0.08em',
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 4.8, ease: easeOut }}
          >
            pour toujours et à jamais...
          </motion.p>
        </motion.div>

        <ScrollIndicator />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(11, 4, 7, 0.8) 100%)' }}
        />
      </motion.section>

      {/* ═══ GALLERY ═══ */}
      <Divider />
      <CinematicGallery />
      <Divider />

      {/* ═══ POEM ═══ */}
      <PoemSection />
      <Divider />

      {/* ═══ REASONS ═══ */}
      <ReasonsSection />
      <Divider />

      {/* ═══ TIMELINE ═══ */}
      <TimelineSection />
      <Divider />

      {/* ═══ FINAL ═══ */}
      <FinalSection />

      <div
        className="h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--surface))' }}
      />
    </div>
  )
}