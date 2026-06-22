'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import HeartWords from '@/components/HeartWords'
import Image from 'next/image'

// ─── Fonts ───
const playfair = { fontFamily: "var(--font-playfair), 'Playfair Display', 'Georgia', serif" }
const parisienne = { fontFamily: "var(--font-parisienne), 'Parisienne', cursive" }

// ─── Floating Hearts Background ───
function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`fh-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${0.3 + Math.random() * 0.7}rem`,
            opacity: 0.06 + Math.random() * 0.1,
          }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: [0, 15, -10, 20, -15, 0],
            x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
          }}
          transition={{ duration: 14 + Math.random() * 18, repeat: Infinity, delay: Math.random() * 15, ease: 'linear' }}
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
      transition={{ delay: 5.5, duration: 1 }}
    >
      <span className="text-[0.65rem] tracking-[0.4em] uppercase" style={{ ...parisienne, color: 'rgba(255,180,190,0.35)', fontSize: '0.85rem' }}>
        fais défiler
      </span>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ color: 'rgba(255,120,140,0.4)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
      </motion.div>
    </motion.div>
  )
}

function Divider() {
  return (
    <div className="flex items-center justify-center py-10 md:py-14">
      <motion.div className="flex items-center gap-4" initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 1.2 }}>
        <div className="h-px w-12 md:w-20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,100,120,0.3))' }} />
        <motion.span className="text-base" animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>♥</motion.span>
        <div className="h-px w-12 md:w-20" style={{ background: 'linear-gradient(90deg, rgba(255,100,120,0.3), transparent)' }} />
      </motion.div>
    </div>
  )
}

function PoemLine({ children, delay = 0, highlight = false, small = false }: { children: string; delay?: number; highlight?: boolean; small?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.p ref={ref} className="text-center" style={{ ...playfair, overflow: 'hidden', fontSize: small ? '1rem' : highlight ? '1.2rem' : '1.05rem', letterSpacing: small ? '0.02em' : '0.04em', lineHeight: small ? 1.8 : 2.2 }}
      initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.p>
  )
}

// ═══════════════════════════════════════════════
// ─── POLAROID GALLERY ───
// ═══════════════════════════════════════════════
function PolaroidGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const photos = [
    { src: '/photos/roxane-1.jpg', caption: 'Mon rayon de soleil', rotation: -6, x: -8, y: 15 },
    { src: '/photos/roxane-2.jpg', caption: 'Celle qui fait battre mon cœur', rotation: 4, x: 12, y: -10 },
    { src: '/photos/roxane-3.jpg', caption: 'La plus belle femme du monde', rotation: -3, x: -15, y: -5 },
    { src: '/photos/roxane-4.jpg', caption: 'Mon bonheur à moi', rotation: 7, x: 5, y: 20 },
  ]

  return (
    <section id="galerie" className="relative py-20 md:py-28 px-6">
      <motion.div className="text-center mb-16 md:mb-20">
        <motion.p className="text-sm md:text-base tracking-[0.3em] uppercase mb-3" style={{ ...parisienne, color: 'rgba(255,150,165,0.5)', fontSize: '1rem' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          quelques souvenirs
        </motion.p>
        <motion.h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-wide" style={{ ...playfair, color: 'rgba(255,190,200,0.9)', fontWeight: 400 }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }}>
          La Plus Belle
        </motion.h2>
      </motion.div>

      {/* Polaroid scatter layout */}
      <div className="relative max-w-3xl mx-auto" style={{ height: 'clamp(400px, 60vw, 600px)' }}>
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className="absolute cursor-pointer"
            style={{
              left: `${25 + i * 15 + photo.x}%`,
              top: `${10 + (i % 2) * 30 + photo.y}%`,
              width: 'clamp(140px, 22vw, 220px)',
              zIndex: 10 - i,
            }}
            initial={{ opacity: 0, y: 60, rotate: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: photo.rotation, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 1, delay: i * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -15, rotate: 0, scale: 1.08, zIndex: 20 }}
            onClick={() => setSelectedPhoto(i)}
          >
            {/* Polaroid card */}
            <div className="bg-white/[0.95] p-2.5 pb-8 md:p-3 md:pb-10 relative" style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
              borderRadius: '2px',
            }}>
              <div className="relative aspect-[3/4] overflow-hidden" style={{ borderRadius: '1px' }}>
                <Image src={photo.src} alt="Roxane" fill className="object-cover" sizes="220px" />
                {/* Slight sepia/warm overlay */}
                <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'rgba(255,240,230,0.15)' }} />
              </div>
              {/* Caption */}
              <p className="absolute bottom-2.5 md:bottom-3 left-0 right-0 text-center" style={{ ...parisienne, color: '#6b4c5a', fontSize: '0.8rem' }}>
                {photo.caption}
              </p>
            </div>
            {/* Tape effect on top */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 md:w-12 md:h-5 -rotate-1" style={{
              background: 'rgba(255,220,180,0.5)',
              backdropFilter: 'blur(1px)',
              borderRadius: '1px',
            }} />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(5,2,3,0.95)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhoto(null)}>
            <motion.div className="relative max-w-md w-full aspect-[3/4] rounded-sm overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
              initial={{ scale: 0.85, opacity: 0, rotate: -3 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.85, opacity: 0, rotate: 3 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }} onClick={(e) => e.stopPropagation()}>
              <Image src={photos[selectedPhoto].src} alt="Roxane" fill className="object-cover" sizes="(max-width: 768px) 85vw, 400px" />
              <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)' }} />
            </motion.div>
            <motion.p className="absolute bottom-8 left-0 right-0 text-center" style={{ ...parisienne, color: 'rgba(255,200,210,0.8)', fontSize: '1.2rem' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {photos[selectedPhoto].caption}
            </motion.p>
            <motion.button className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
              onClick={() => setSelectedPhoto(null)} whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.9 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </motion.button>
            {/* Navigation */}
            <motion.button className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1) }} whileHover={{ scale: 1.1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
            </motion.button>
            <motion.button className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % photos.length) }} whileHover={{ scale: 1.1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
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
      <motion.div ref={ref} className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(180,40,80,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
        initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 2 }} />

      <motion.div className="text-center mb-14 relative z-10">
        <motion.p className="tracking-[0.3em] uppercase mb-3" style={{ ...parisienne, color: 'rgba(255,150,165,0.5)', fontSize: '0.9rem' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          mots du cœur
        </motion.p>
        <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-normal" style={{ ...playfair, color: 'rgba(255,190,200,0.9)', letterSpacing: '0.04em', fontWeight: 400 }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
          Mon Poème pour Toi
        </motion.h2>
      </motion.div>

      <div className="max-w-lg space-y-4 relative z-10">
        <PoemLine delay={0.2}>Roxane, dans le silence de la nuit,</PoemLine>
        <PoemLine delay={0.45}>je murmure ton nom dans le vent,</PoemLine>
        <PoemLine delay={0.7}>et chaque étoile qui s&apos;allume</PoemLine>
        <PoemLine delay={0.95}>me rappelle que tu existes.</PoemLine>
        <div className="py-3" />
        <PoemLine delay={1.3}>Tes yeux sont deux océans</PoemLine>
        <PoemLine delay={1.55}>où je voudrais me noyer pour toujours,</PoemLine>
        <PoemLine delay={1.8}>ton sourire est le soleil</PoemLine>
        <PoemLine delay={2.05}>qui réchauffe mes jours les plus froids.</PoemLine>
        <div className="py-3" />
        <PoemLine delay={2.4}>Chaque seconde loin de toi, Roxane,</PoemLine>
        <PoemLine delay={2.65}>est une éternité qui me dévore,</PoemLine>
        <PoemLine delay={2.9}>et chaque instant à tes côtés</PoemLine>
        <PoemLine delay={3.15}>est un paradis que je ne veux pas quitter.</PoemLine>
        <div className="py-3" />
        <PoemLine delay={3.5} highlight>Roxane, tu es la plus belle histoire</PoemLine>
        <PoemLine delay={3.75} highlight>que la vie m&apos;ait jamais offerte.</PoemLine>
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
    { emoji: '💫', text: 'Chaque moment avec toi est un trésor' },
    { emoji: '🤗', text: 'Tes câlins, mon refuge préféré' },
    { emoji: '💋', text: 'Tes baisers, ma drogue préférée' },
  ]
  return (
    <section id="raisons" className="relative py-20 md:py-28 px-6">
      <motion.div className="text-center mb-14">
        <motion.p className="tracking-[0.3em] uppercase mb-3" style={{ ...parisienne, color: 'rgba(255,150,165,0.5)', fontSize: '0.9rem' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          parce que tu mérites de savoir
        </motion.p>
        <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-normal" style={{ ...playfair, color: 'rgba(255,190,200,0.9)', letterSpacing: '0.04em', fontWeight: 400 }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
          Pourquoi Je T&apos;aime
        </motion.h2>
      </motion.div>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        {reasons.map((reason, i) => (
          <motion.div key={i} className="relative px-5 py-4 md:px-6 md:py-5 rounded-xl"
            style={{ background: 'rgba(255,50,80,0.04)', border: '1px solid rgba(255,80,100,0.08)' }}
            initial={{ opacity: 0, y: 35, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,80,100,0.25)', background: 'rgba(255,50,80,0.08)' }}>
            <div className="flex items-start gap-3">
              <motion.span className="text-lg md:text-xl flex-shrink-0 mt-0.5"
                animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}>
                {reason.emoji}
              </motion.span>
              <p className="text-sm md:text-[0.92rem] leading-relaxed" style={{ ...playfair, color: 'rgba(255,195,205,0.75)', letterSpacing: '0.01em' }}>
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
    <section id="moments" className="relative py-20 md:py-28 px-6">
      <motion.div className="text-center mb-16">
        <motion.p className="tracking-[0.3em] uppercase mb-3" style={{ ...parisienne, color: 'rgba(255,150,165,0.5)', fontSize: '0.9rem' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          gravés dans ma mémoire
        </motion.p>
        <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-normal" style={{ ...playfair, color: 'rgba(255,190,200,0.9)', letterSpacing: '0.04em', fontWeight: 400 }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
          Nos Plus Beaux Moments
        </motion.h2>
      </motion.div>
      <div className="max-w-md mx-auto relative">
        <motion.div className="absolute left-5 md:left-7 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,80,100,0.25), rgba(255,80,100,0.25), transparent)' }}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: 'easeOut' }} />
        <div className="space-y-14">
          {moments.map((moment, i) => (
            <motion.div key={i} className="relative pl-14 md:pl-18"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.15 }}>
              <motion.div className="absolute left-3 md:left-5 top-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,50,80,0.15)', border: '1.5px solid rgba(255,80,100,0.4)' }}
                whileInView={{ scale: [0, 1.3, 1] }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
                <span className="text-[10px]">{moment.icon}</span>
              </motion.div>
              <h3 className="text-base md:text-lg mb-1.5" style={{ ...playfair, color: 'rgba(255,160,175,0.9)', fontWeight: 500, letterSpacing: '0.02em' }}>
                {moment.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ ...playfair, color: 'rgba(255,185,195,0.55)', letterSpacing: '0.01em' }}>
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
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.85, 1, 1, 0.92])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -25])
  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      <motion.div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,40,70,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="relative z-10 text-center max-w-xl mx-auto" style={{ opacity, scale, y }}>
        <motion.div className="text-5xl md:text-6xl mb-6"
          animate={{ scale: [1, 1.12, 1], filter: ['drop-shadow(0 0 15px rgba(255,60,90,0.3))', 'drop-shadow(0 0 35px rgba(255,60,90,0.7))', 'drop-shadow(0 0 15px rgba(255,60,90,0.3))'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>❤️</motion.div>
        <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-2" style={{ ...playfair, color: 'rgba(255,200,210,0.95)', letterSpacing: '0.04em', fontWeight: 400, textShadow: '0 0 30px rgba(255,80,100,0.2)' }}
          initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
          À Toi, Roxane
        </motion.h2>
        <motion.p className="text-xl md:text-2xl mb-8" style={{ ...parisienne, color: 'rgba(255,160,175,0.7)', letterSpacing: '0.08em' }}
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}>
          Pour Toujours
        </motion.p>
        <motion.div className="mx-auto mb-8" style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,100,120,0.4), transparent)' }}
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
        <motion.p className="text-sm md:text-base leading-relaxed mb-4" style={{ ...playfair, color: 'rgba(255,185,195,0.6)', letterSpacing: '0.03em' }}
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.7 }}>
          Ce cadeau n&apos;est qu&apos;une petite expression
        </motion.p>
        <motion.p className="text-sm md:text-base leading-relaxed mb-4" style={{ ...playfair, color: 'rgba(255,185,195,0.6)', letterSpacing: '0.03em' }}
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.9 }}>
          de tout ce que mon cœur ressent pour toi, Roxane.
        </motion.p>
        <motion.p className="text-base md:text-lg font-normal italic mt-6" style={{ ...parisienne, color: 'rgba(255,170,180,0.85)', textShadow: '0 0 15px rgba(255,80,100,0.15)', letterSpacing: '0.04em' }}
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.3 }}>
          Je t&apos;aime plus que tous les mots du monde.
        </motion.p>
      </motion.div>
    </section>
  )
}

// ─── PETALS ───
function PetalsRain() {
  const petals = Array.from({ length: 12 }, (_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 20, duration: 12 + Math.random() * 15, size: 0.35 + Math.random() * 0.5, rotation: Math.random() * 360, drift: (Math.random() - 0.5) * 180 }))
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {petals.map(p => (
        <motion.div key={p.id} className="absolute" style={{ left: `${p.left}%`, top: '-5%', fontSize: `${p.size}rem` }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: '110vh', x: [0, p.drift * 0.3, p.drift * 0.7, p.drift], rotate: [p.rotation, p.rotation + 180, p.rotation + 360], opacity: [0, 0.12, 0.12, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}>🌸</motion.div>
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
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60])

  return (
    <div className="relative" style={{ background: 'linear-gradient(180deg, #0d0508 0%, #140810 20%, #100610 50%, #0a0818 80%, #0d0508 100%)' }}>
      <FloatingHearts />
      <PetalsRain />

      {/* ═══ HERO ═══ */}
      <motion.section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div key={`hp-${i}`} className="absolute rounded-full"
              style={{ width: 1.5 + Math.random() * 3, height: 1.5 + Math.random() * 3, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: `rgba(255, ${80 + Math.random() * 80}, ${100 + Math.random() * 60}, ${0.08 + Math.random() * 0.15})` }}
              animate={{ y: [-15, 15, -15], x: [-8, 8, -8], opacity: [0.08, 0.25, 0.08] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="relative z-10">
          <HeartWords />
        </motion.div>

        <motion.div className="text-center max-w-lg relative z-10 mt-3" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 3.5, ease: 'easeOut' }}>
          <motion.p className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-wide" style={{ ...playfair, color: 'rgba(255, 200, 210, 0.95)', letterSpacing: '0.06em', fontWeight: 400 }}
            animate={{ textShadow: ['0 0 25px rgba(255, 80, 100, 0.25)', '0 0 45px rgba(255, 80, 100, 0.5)', '0 0 25px rgba(255, 80, 100, 0.25)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            Roxane, Tu Es Mon Seul Amour
          </motion.p>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 4.2, ease: 'easeOut' }}
            className="mt-3 mx-auto" style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255, 100, 120, 0.5), transparent)' }} />
          <motion.p className="mt-3 text-sm" style={{ ...parisienne, color: 'rgba(255, 170, 185, 0.5)', letterSpacing: '0.1em', fontSize: '1rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 4.8 }}>
            pour toujours et à jamais...
          </motion.p>
        </motion.div>

        <ScrollIndicator />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(10, 5, 8, 0.75) 100%)' }} />
      </motion.section>

      {/* ═══ GALLERY ═══ */}
      <Divider />
      <PolaroidGallery />
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

      <div className="h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0d0508)' }} />
    </div>
  )
}