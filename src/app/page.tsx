'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import HeartWords from '@/components/HeartWords'
import Image from 'next/image'

// ─── Floating Hearts Background ───
function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`fh-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${0.4 + Math.random() * 0.8}rem`,
            opacity: 0.08 + Math.random() * 0.12,
          }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: [0, 15, -10, 20, -15, 0],
            x: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 12 + Math.random() * 18,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: 'linear',
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
}

// ─── Scroll Indicator ───
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 5.5, duration: 1 }}
    >
      <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,180,190,0.4)', fontFamily: 'Georgia, serif' }}>
        fais défiler
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ color: 'rgba(255,120,140,0.5)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// ─── Section Divider ───
function Divider() {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1 }}
      >
        <div className="h-px w-16 md:w-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,100,120,0.4))' }} />
        <motion.span
          className="text-lg"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ♥
        </motion.span>
        <div className="h-px w-16 md:w-24" style={{ background: 'linear-gradient(90deg, rgba(255,100,120,0.4), transparent)' }} />
      </motion.div>
    </div>
  )
}

// ─── Animated Poem Line ───
function PoemLine({ children, delay = 0, highlight = false }: { children: string; delay?: number; highlight?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  
  return (
    <motion.p
      ref={ref}
      className="text-center"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflow: 'hidden',
        fontSize: highlight ? '1.15rem' : undefined,
      }}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.p>
  )
}

// ═══════════════════════════════════════
// ─── PHOTO GALLERY SECTION ───
// ═══════════════════════════════════════
function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const photos = [
    { src: '/photos/roxane-1.jpg', alt: 'Roxane' },
    { src: '/photos/roxane-2.jpg', alt: 'Roxane' },
    { src: '/photos/roxane-3.jpg', alt: 'Roxane' },
    { src: '/photos/roxane-4.jpg', alt: 'Roxane' },
  ]

  return (
    <section id="galerie" className="relative py-24 px-6">
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-center mb-16"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: 'rgba(255,180,190,0.85)',
          textShadow: '0 0 40px rgba(255,80,100,0.2)',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        La Plus Belle
      </motion.h2>

      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 md:gap-6">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              border: '1px solid rgba(255,80,100,0.15)',
            }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            whileHover={{ scale: 1.03, borderColor: 'rgba(255,80,100,0.4)' }}
            onClick={() => setSelectedPhoto(i)}
          >
            {/* Image */}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 45vw, 400px"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Caption */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 text-center"
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm md:text-base italic" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255,220,225,0.9)' }}>
                {i === 0 && 'Mon rayon de soleil'}
                {i === 1 && 'Celle qui fait battre mon cœur'}
                {i === 2 && 'La plus belle femme du monde'}
                {i === 3 && 'Mon bonheur à moi'}
              </p>
            </motion.div>

            {/* Glow border on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 30px rgba(255,60,90,0.3)',
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative max-w-lg w-full aspect-[3/4] rounded-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[selectedPhoto].src}
                alt={photos[selectedPhoto].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 500px"
              />
              {/* Glow effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(255,60,90,0.2)',
                }}
              />
            </motion.div>
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
              onClick={() => setSelectedPhoto(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
            {/* Nav buttons */}
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1) }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % photos.length) }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    <section id="poeme" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        ref={ref}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(180,40,80,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2 }}
      />

      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-16 relative z-10"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: 'rgba(255,180,190,0.85)',
          textShadow: '0 0 40px rgba(255,80,100,0.2)',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        Mon Poème pour Toi, Roxane
      </motion.h2>

      <div className="max-w-xl space-y-5 relative z-10">
        <PoemLine delay={0.2}>Roxane, dans le silence de la nuit,</PoemLine>
        <PoemLine delay={0.5}>je murmure ton nom dans le vent,</PoemLine>
        <PoemLine delay={0.8}>et chaque étoile qui s&apos;allume</PoemLine>
        <PoemLine delay={1.1}>me rappelle que tu existes.</PoemLine>
        
        <div className="py-4" />
        
        <PoemLine delay={1.5}>Tes yeux sont deux océans</PoemLine>
        <PoemLine delay={1.8}>où je voudrais me noyer pour toujours,</PoemLine>
        <PoemLine delay={2.1}>ton sourire est le soleil</PoemLine>
        <PoemLine delay={2.4}>qui réchauffe mes jours les plus froids.</PoemLine>
        
        <div className="py-4" />
        
        <PoemLine delay={2.8}>Chaque seconde loin de toi, Roxane,</PoemLine>
        <PoemLine delay={3.1}>est une éternité qui me dévore,</PoemLine>
        <PoemLine delay={3.4}>et chaque instant à tes côtés</PoemLine>
        <PoemLine delay={3.7}>est un paradis que je ne veux pas quitter.</PoemLine>
        
        <div className="py-4" />
        
        <PoemLine delay={4.1} highlight>Roxane, tu es la plus belle histoire</PoemLine>
        <PoemLine delay={4.4} highlight>que la vie m&apos;ait jamais offerte.</PoemLine>
      </div>
    </section>
  )
}

// ─── REASONS SECTION ───
function ReasonsSection() {
  const reasons = [
    { emoji: '✨', text: 'Ton rire, Roxane, qui illumine ma journée entière' },
    { emoji: '🌙', text: 'Ta douceur qui apaise mon cœur' },
    { emoji: '🔥', text: 'Ta passion qui me inspire chaque jour' },
    { emoji: '🦋', text: 'La façon dont tu me fais sentir vivant' },
    { emoji: '🌹', text: 'Ton regard, Roxane, qui me fait fondre' },
    { emoji: '💫', text: 'Chaque moment passé avec toi est un trésor' },
    { emoji: '🤗', text: 'Tes câlins, mon refuge préféré' },
    { emoji: '💋', text: 'Tes baisers, ma drogue préférée' },
  ]

  return (
    <section id="raisons" className="relative py-24 px-6">
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-center mb-16"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: 'rgba(255,180,190,0.85)',
          textShadow: '0 0 40px rgba(255,80,100,0.2)',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        Pourquoi Je T&apos;aime, Roxane
      </motion.h2>

      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {reasons.map((reason, i) => (
          <motion.div
            key={i}
            className="relative p-5 md:p-6 rounded-2xl"
            style={{
              background: 'rgba(255,60,90,0.06)',
              border: '1px solid rgba(255,80,100,0.1)',
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.8, delay: i * 0.12 }}
            whileHover={{
              scale: 1.03,
              borderColor: 'rgba(255,80,100,0.3)',
              background: 'rgba(255,60,90,0.1)',
            }}
          >
            <div className="flex items-start gap-3">
              <motion.span
                className="text-xl md:text-2xl flex-shrink-0 mt-0.5"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              >
                {reason.emoji}
              </motion.span>
              <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: 'rgba(255,200,210,0.8)' }}>
                {reason.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── TIMELINE SECTION ───
function TimelineSection() {
  const moments = [
    { title: 'Le jour où on s\'est rencontrés', text: 'Le jour où tout a commencé, où le monde a changé de couleur grâce à toi, Roxane.', icon: '💫' },
    { title: 'Notre premier baiser', text: 'Ce moment magique où le temps s\'est arrêté, où nos lèvres se sont trouvées.', icon: '💋' },
    { title: 'Notre première danse', text: 'Enveloppés l\'un dans l\'autre, le monde entier a disparu autour de nous.', icon: '🎵' },
    { title: 'Nos rires partagés', text: 'Ces éclats de rire qui résonnent encore dans ma mémoire, ma musique préférée.', icon: '😊' },
  ]

  return (
    <section id="moments" className="relative py-24 px-6">
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-center mb-20"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: 'rgba(255,180,190,0.85)',
          textShadow: '0 0 40px rgba(255,80,100,0.2)',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        Nos Plus Beaux Moments
      </motion.h2>

      <div className="max-w-lg mx-auto relative">
        <motion.div
          className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,80,100,0.3), rgba(255,80,100,0.3), transparent)' }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        <div className="space-y-16">
          {moments.map((moment, i) => (
            <motion.div
              key={i}
              className="relative pl-16 md:pl-20"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="absolute left-4 md:left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255,60,90,0.2)',
                  border: '2px solid rgba(255,80,100,0.5)',
                }}
                whileInView={{ scale: [0, 1.3, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="text-xs">{moment.icon}</span>
              </motion.div>

              <h3 className="text-lg md:text-xl font-medium mb-2" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: 'rgba(255,160,170,0.95)' }}>
                {moment.title}
              </h3>
              <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: 'rgba(255,190,200,0.65)' }}>
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
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.8, 1, 1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -30])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,40,70,0.15) 0%, rgba(180,30,60,0.05) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div className="relative z-10 text-center max-w-2xl mx-auto" style={{ opacity, scale, y }}>
        <motion.div
          className="text-6xl md:text-7xl mb-8"
          animate={{
            scale: [1, 1.15, 1],
            filter: [
              'drop-shadow(0 0 20px rgba(255,60,90,0.4))',
              'drop-shadow(0 0 40px rgba(255,60,90,0.8))',
              'drop-shadow(0 0 20px rgba(255,60,90,0.4))',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ❤️
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide mb-4"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: 'rgba(255,200,210,0.95)',
            textShadow: '0 0 40px rgba(255,80,100,0.3)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          À Toi, Roxane
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl font-light italic mb-8"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: 'rgba(255,160,170,0.8)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Pour Toujours
        </motion.p>

        <motion.div
          className="mx-auto mb-8"
          style={{
            width: 80,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,100,120,0.5), transparent)',
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        />

        <motion.p
          className="text-base md:text-lg leading-relaxed mb-6"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: 'rgba(255,190,200,0.7)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Ce cadeau n&apos;est qu&apos;une petite expression
        </motion.p>
        <motion.p
          className="text-base md:text-lg leading-relaxed mb-6"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: 'rgba(255,190,200,0.7)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          de tout ce que mon cœur ressent pour toi, Roxane.
        </motion.p>
        <motion.p
          className="text-lg md:text-xl font-medium italic mt-8"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: 'rgba(255,160,170,0.9)',
            textShadow: '0 0 20px rgba(255,80,100,0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Je t&apos;aime plus que tous les mots du monde, Roxane.
        </motion.p>
      </motion.div>
    </section>
  )
}

// ─── PETALS RAIN ───
function PetalsRain() {
  const petals = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 10 + Math.random() * 15,
    size: 0.4 + Math.random() * 0.6,
    rotation: Math.random() * 360,
    drift: (Math.random() - 0.5) * 200,
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
            opacity: [0, 0.15, 0.15, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
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
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -80])

  return (
    <div className="relative" style={{ background: 'linear-gradient(180deg, #0d0508 0%, #1a0a0e 15%, #150812 40%, #0d0a1a 70%, #0d0508 100%)' }}>
      
      <FloatingHearts />
      <PetalsRain />

      {/* ═══ HERO SECTION ═══ */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`hero-p-${i}`}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `rgba(255, ${80 + Math.random() * 80}, ${100 + Math.random() * 60}, ${0.1 + Math.random() * 0.2})`,
              }}
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10"
        >
          <HeartWords />
        </motion.div>

        <motion.div
          className="text-center max-w-lg relative z-10 mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.5, ease: 'easeOut' }}
        >
          <motion.p
            className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: 'rgba(255, 200, 210, 0.95)',
              textShadow: '0 0 30px rgba(255, 80, 100, 0.3)',
            }}
            animate={{
              textShadow: [
                '0 0 30px rgba(255, 80, 100, 0.3)',
                '0 0 50px rgba(255, 80, 100, 0.6)',
                '0 0 30px rgba(255, 80, 100, 0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Roxane, Tu Es Mon Seul Amour
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 4.2, ease: 'easeOut' }}
            className="mt-4 mx-auto"
            style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255, 100, 120, 0.6), transparent)' }}
          />

          <motion.p
            className="mt-4 text-sm md:text-base italic"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: 'rgba(255, 180, 190, 0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4.8 }}
          >
            pour toujours et à jamais...
          </motion.p>
        </motion.div>

        <ScrollIndicator />

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 5, 8, 0.7) 100%)' }} />
      </motion.section>

      {/* ═══ GALLERY SECTION ═══ */}
      <Divider />
      <GallerySection />
      <Divider />

      {/* ═══ POEM SECTION ═══ */}
      <PoemSection />
      <Divider />

      {/* ═══ REASONS SECTION ═══ */}
      <ReasonsSection />
      <Divider />

      {/* ═══ TIMELINE SECTION ═══ */}
      <TimelineSection />
      <Divider />

      {/* ═══ FINAL SECTION ═══ */}
      <FinalSection />

      <div className="h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0d0508)' }} />
    </div>
  )
}