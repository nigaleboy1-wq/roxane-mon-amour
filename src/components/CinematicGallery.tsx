'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import TextReveal from './TextReveal'

const easeOut = [0.22, 1, 0.36, 1] as const
const easeOutExpo = [0.16, 1, 0.3, 1] as const

const c = {
  ink: 'oklch(0.82 0.06 350)',
  inkDim: 'oklch(0.68 0.08 350)',
  inkFaint: 'oklch(0.55 0.06 350)',
  accent: 'oklch(0.65 0.20 10)',
}

const display = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif" }
const script = { fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive" }

const photos = [
  { src: '/photos/roxane-1.jpg', caption: 'Mon rayon de soleil', kenBurns: 'zoom-in-right' },
  { src: '/photos/roxane-2.jpg', caption: 'Celle qui fait battre mon cœur', kenBurns: 'zoom-out-left' },
  { src: '/photos/roxane-3.jpg', caption: 'La plus belle femme du monde', kenBurns: 'zoom-in-left' },
  { src: '/photos/roxane-4.jpg', caption: 'Mon bonheur à moi', kenBurns: 'zoom-out-right' },
]

const kenBurnsKeyframes: Record<string, { from: string; to: string }> = {
  'zoom-in-right': { from: 'scale(1) translateX(0)', to: 'scale(1.12) translateX(3%)' },
  'zoom-out-left': { from: 'scale(1.08) translateX(-2%)', to: 'scale(1) translateX(0)' },
  'zoom-in-left': { from: 'scale(1) translateX(0)', to: 'scale(1.1) translateX(-2%)' },
  'zoom-out-right': { from: 'scale(1.06) translateX(2%)', to: 'scale(1) translateX(0)' },
}

export default function CinematicGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      id="galerie"
      className="relative px-5 md:px-8"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
    >
      {/* Heading */}
      <div className="text-center mb-14 md:mb-16" style={{ maxWidth: '65ch', margin: '0 auto 3.5rem' }}>
        <motion.p
          className="tracking-[0.25em] uppercase mb-3"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeOut as unknown as number[] }}
        >
          quelques souvenirs
        </motion.p>
        <TextReveal
          text="La Plus Belle"
          as="h2"
          style={{
            ...display,
            color: c.ink,
            fontSize: 'var(--text-h2)',
            letterSpacing: '0.02em',
            fontWeight: 300,
            lineHeight: 1.2,
          }}
          delay={0.15}
        />
      </div>

      {/* Grid */}
      <div className="max-w-3xl mx-auto grid grid-cols-2 gap-2.5 md:gap-3.5 auto-rows-[180px] md:auto-rows-[220px]">
        {photos.map((photo, i) => (
          <GalleryCard
            key={i}
            photo={photo}
            index={i}
            isInView={isInView}
            onSelect={() => setSelectedPhoto(i)}
            span={i === 0 ? 'row-span-2' : i === 3 ? 'col-span-2' : ''}
          />
        ))}
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(5, 2, 3, 0.92)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOut as unknown as number[] }}
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close hint */}
            <motion.p
              className="absolute top-6 right-6 cursor-pointer z-10"
              style={{ ...display, color: c.inkFaint, fontSize: '0.85rem', letterSpacing: '0.1em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ✕ fermer
            </motion.p>

            {/* Photo */}
            <motion.div
              className="relative w-full max-w-lg aspect-[3/4] overflow-hidden"
              style={{ borderRadius: '8px' }}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.6, ease: easeOutExpo as unknown as number[] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[selectedPhoto].src}
                alt={photos[selectedPhoto].caption}
                fill
                className="object-cover"
                style={{ filter: 'contrast(1.05) saturate(0.9)' }}
              />
              {/* Caption */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 text-center"
                style={{
                  background: 'linear-gradient(to top, rgba(11,4,7,0.9), transparent)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: easeOut as unknown as number[] }}
              >
                <p style={{ ...script, color: c.ink, fontSize: '1.1rem' }}>
                  {photos[selectedPhoto].caption}
                </p>
              </motion.div>
            </motion.div>

            {/* Navigation */}
            <motion.button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: c.inkFaint, fontSize: '2rem', background: 'none', border: 'none' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null))
              }}
            >
              ‹
            </motion.button>
            <motion.button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: c.inkFaint, fontSize: '2rem', background: 'none', border: 'none' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto((prev) => (prev !== null ? (prev + 1) % photos.length : null))
              }}
            >
              ›
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Individual gallery card with Ken Burns + 3D tilt ───
function GalleryCard({
  photo,
  index,
  isInView,
  onSelect,
  span,
}: {
  photo: typeof photos[0]
  index: number
  isInView: boolean
  onSelect: () => void
  span: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 })

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({
      rotateX: (y - 0.5) * -8,
      rotateY: (x - 0.5) * 8,
      glareX: x * 100,
      glareY: y * 100,
    })
  }, [])

  const handleLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 })
  }, [])

  const kb = kenBurnsKeyframes[photo.kenBurns]

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden cursor-pointer group ${span}`}
      style={{ borderRadius: '6px', perspective: '800px' }}
      initial={{ opacity: 0.15, y: 30, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: easeOutExpo as unknown as number[],
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onSelect}
    >
      {/* Ken Burns image */}
      <motion.div
        className="absolute inset-0"
        style={{
          animation: `kenBurns${index} 20s ease-in-out infinite alternate`,
          animationDelay: `${index * 2}s`,
        }}
      >
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          className="object-cover"
          style={{ filter: 'contrast(1.02) saturate(0.85) brightness(0.9)' }}
        />
      </motion.div>

      {/* 3D tilt wrapper */}
      <motion.div
        className="absolute inset-0"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Glare */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.06), transparent 60%)`,
          }}
        />

        {/* Light leak */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,120,140,0.08), transparent 50%, rgba(180,60,100,0.05))',
            opacity: 0.6,
          }}
        />
      </motion.div>

      {/* Caption overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(11,4,7,0.85) 0%, transparent 100%)',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p
          style={{
            ...display,
            color: c.ink,
            fontSize: '0.8rem',
            fontWeight: 400,
            letterSpacing: '0.03em',
            opacity: 0.9,
          }}
        >
          {photo.caption}
        </p>
      </motion.div>

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '6px',
          border: '1px solid transparent',
        }}
        whileHover={{
          borderColor: 'rgba(255, 80, 100, 0.15)',
          boxShadow: '0 0 20px rgba(255, 60, 90, 0.08)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}