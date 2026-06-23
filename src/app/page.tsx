'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import HeartWords from '@/components/HeartWords'
import AuroraBackground from '@/components/AuroraBackground'
import Atmosphere from '@/components/Atmosphere'
import TextReveal from '@/components/TextReveal'
import RotatingWordsSection from '@/components/RotatingWordsSection'
import CinematicGallery from '@/components/CinematicGallery'
import AnimatedCounterSection from '@/components/AnimatedCounterSection'
import PromiseCards from '@/components/PromiseCards'
import AlternatingTimeline from '@/components/AlternatingTimeline'
import SpectacularEnding from '@/components/SpectacularEnding'
import Image from 'next/image'

// ═══════════════════════════════════════════════════════
// ─── CONSTANTS ───
// ═══════════════════════════════════════════════════════

// ⬇️ Change cette date pour ton anniversaire de couple ⬇️
const COUPLE_START_DATE = new Date('2024-01-15')

const display = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif" }
const script = { fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive" }
const easeOut = [0.22, 1, 0.36, 1] as const
const easeOutExpo = [0.16, 1, 0.3, 1] as const
const easeSmooth = [0.45, 0, 0.55, 1] as const

const c = {
  ink: 'oklch(0.82 0.06 350)',
  inkDim: 'oklch(0.68 0.08 350)',
  inkFaint: 'oklch(0.55 0.06 350)',
  accent: 'oklch(0.65 0.20 10)',
  accentSoft: 'oklch(0.60 0.12 350)',
  line: 'rgba(255, 80, 100, 0.2)',
}

// ═══════════════════════════════════════════════════════
// ─── FINGERPRINT INTRO ───
// ═══════════════════════════════════════════════════════
function FingerprintIntro({ onUnlock }: { onUnlock: () => void }) {
  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const startHold = useCallback(() => {
    setIsHolding(true)
    holdTimer.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (holdTimer.current) clearInterval(holdTimer.current)
          setUnlocked(true)
          setTimeout(onUnlock, 600)
          return 100
        }
        return prev + 2.5
      })
    }, 30)
  }, [onUnlock])

  const endHold = useCallback(() => {
    setIsHolding(false)
    if (holdTimer.current) { clearInterval(holdTimer.current); holdTimer.current = null }
    const decay = setInterval(() => {
      setProgress(p => { if (p <= 0) { clearInterval(decay); return 0 } return p - 1.5 })
    }, 30)
  }, [])

  useEffect(() => { return () => { if (holdTimer.current) clearInterval(holdTimer.current) } }, [])

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #0b0407 0%, #140810 50%, #0b0407 100%)' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          <motion.p
            className="mb-6"
            style={{ ...script, color: c.ink, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: easeOut }}
          >
            Pour Toi, Roxane
          </motion.p>
          <motion.div
            className="relative cursor-pointer select-none"
            onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
            onTouchStart={startHold} onTouchEnd={endHold}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easeOutExpo }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,80,100,0.08)" strokeWidth="2" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="oklch(0.65 0.20 10)" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={isHolding ? { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.5 }}
                transition={{ duration: 1.5, repeat: isHolding ? Infinity : 0, ease: easeSmooth }}
                style={{ filter: isHolding ? 'drop-shadow(0 0 20px rgba(255,80,100,0.4))' : 'none' }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="oklch(0.65 0.15 350)" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
                  <path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6s6 2.5 6 6c0 2.5-.5 4.5-1 6" />
                  <path d="M8 17c.5-1.5 1-3 1-5 0-2 1.5-3.5 3-3.5s3 1.5 3 3.5c0 1.5-.3 3-1 5" />
                  <path d="M11 15.5c.3-.8.5-1.5.5-2.5 0-1 .7-1.5 1.5-1.5s1.5.5 1.5 1.5" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
          <motion.p
            className="mt-6 text-center"
            style={{ ...display, color: c.inkFaint, fontSize: '0.85rem', letterSpacing: '0.05em', fontWeight: 300 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Maintiens pressé pour entrer
          </motion.p>
          <motion.p
            className="mt-2 text-center"
            style={{ ...display, color: 'rgba(255,80,100,0.3)', fontSize: '0.75rem', fontWeight: 300 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════
// ─── HEART PROGRESS BAR ───
// ═══════════════════════════════════════════════════════
function HeartProgressBar() {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.9, 1], [0, 1, 1, 0])
  return (
    <motion.div className="fixed top-4 left-1/2 -translate-x-1/2 z-50" style={{ opacity }}>
      <svg width="28" height="26" viewBox="0 0 28 26" fill="none">
        <path d="M14 26s-13-8.4-13-17a7.3 7.3 0 0 1 13-4.6A7.3 7.3 0 0 1 27 9c0 8.6-13 17-13 17z" stroke="rgba(255,80,100,0.15)" strokeWidth="1.5" />
        <motion.path d="M14 26s-13-8.4-13-17a7.3 7.3 0 0 1 13-4.6A7.3 7.3 0 0 1 27 9c0 8.6-13 17-13 17z" stroke="oklch(0.65 0.20 10)" strokeWidth="1.5" style={{ pathLength }} fill="none" />
      </svg>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── CLICK SPARKLES ───
// ═══════════════════════════════════════════════════════
function ClickSparkles() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  useEffect(() => {
    let nextId = 0
    const handler = (e: MouseEvent) => {
      const id = nextId++
      const ns = Array.from({ length: 6 }, (_, i) => ({
        id: id * 100 + i, x: e.clientX + (Math.random() - 0.5) * 40, y: e.clientY + (Math.random() - 0.5) * 40,
      }))
      setSparkles(prev => [...prev, ...ns])
      setTimeout(() => setSparkles(prev => prev.filter(s => !ns.find(n => n.id === s.id))), 800)
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div key={s.id} className="absolute rounded-full"
            style={{ left: s.x, top: s.y, width: 3 + Math.random() * 3, height: 3 + Math.random() * 3, background: `oklch(0.75 ${0.15 + Math.random() * 0.1} ${350 + Math.random() * 20})` }}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0, x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 30 - 15 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: easeOut }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── CURSOR HEART TRAIL ───
// ═══════════════════════════════════════════════════════
function CursorHeartTrail() {
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([])
  useEffect(() => {
    let nextId = 0, lastSpawn = 0
    const handler = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastSpawn < 80) return
      lastSpawn = now
      const id = nextId++
      setTrails(prev => [...prev.slice(-12), { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setTrails(prev => prev.filter(t => t.id !== id)), 1200)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none z-[55]">
      <AnimatePresence>
        {trails.map(t => (
          <motion.span key={t.id} className="absolute"
            style={{ left: t.x, top: t.y, fontSize: '0.7rem', color: 'rgba(255,120,140,0.4)' }}
            initial={{ opacity: 0.6, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, y: -30 }}
            exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: easeOut }}
          >♥</motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── DOUBLE-TAP HEART ───
// ═══════════════════════════════════════════════════════
function DoubleTapHeart() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const lastTap = useRef({ time: 0, x: 0, y: 0 })
  useEffect(() => {
    let nextId = 0
    const handler = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTap.current.time < 350 && Math.abs(e.clientX - lastTap.current.x) < 50 && Math.abs(e.clientY - lastTap.current.y) < 50) {
        const id = nextId++
        setHearts(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
        setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1000)
        lastTap.current = { time: 0, x: 0, y: 0 }
      } else {
        lastTap.current = { time: now, x: e.clientX, y: e.clientY }
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none z-[61]">
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div key={h.id} className="absolute"
            style={{ left: h.x, top: h.y, translateX: '-50%', translateY: '-50%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 0.3, 1.3, 1.5], y: -40 }}
            exit={{ opacity: 0 }} transition={{ duration: 1, ease: easeOut }}
          >
            <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 15px rgba(255,60,90,0.5))' }}>❤️</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── MUSIC PLAYER ───
// ═══════════════════════════════════════════════════════
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause() } else { audioRef.current.play().catch(() => {}) }
    setIsPlaying(!isPlaying)
  }, [isPlaying])
  return (
    <>
      <audio ref={audioRef} src="/music/romance.mp3" loop preload="none" />
      <motion.button
        className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,80,100,0.12)', backdropFilter: 'blur(10px)' }}
        onClick={toggle}
        whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 6, duration: 0.8, ease: easeOut }}
        title={isPlaying ? 'Pause' : 'Musique'}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.7)" strokeWidth="1.5"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.5)" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
        )}
      </motion.button>
      {isPlaying && (
        <motion.div className="fixed bottom-5 right-[3.75rem] z-50 flex items-end gap-[3px] h-4"
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} className="w-[2px] rounded-full" style={{ background: 'rgba(255,120,140,0.5)', height: '40%' }}
              animate={{ height: ['40%', '100%', '60%', '100%', '40%'] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' as const }}
            />
          ))}
        </motion.div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════
// ─── FLOATING HEARTS & PETALS ───
// ═══════════════════════════════════════════════════════
function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div key={`fh-${i}`} className="absolute"
          style={{ left: `${5 + Math.random() * 90}%`, fontSize: `${0.2 + Math.random() * 0.35}rem`, opacity: 0.03 + Math.random() * 0.04, color: c.inkFaint }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{ y: '-10vh', rotate: [0, 12, -8, 15, -10, 0], x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40] }}
          transition={{ duration: 20 + Math.random() * 20, repeat: Infinity, delay: Math.random() * 20, ease: 'linear' as const }}
        >♥</motion.div>
      ))}
    </div>
  )
}

function PetalsRain() {
  const petals = useRef(
    Array.from({ length: 5 }, (_, i) => ({
      id: i, left: 8 + Math.random() * 84, delay: Math.random() * 25,
      duration: 18 + Math.random() * 18, size: 0.25 + Math.random() * 0.3,
      rotation: Math.random() * 360, drift: (Math.random() - 0.5) * 140,
    }))
  ).current
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {petals.map(p => (
        <motion.div key={p.id} className="absolute" style={{ left: `${p.left}%`, top: '-5%', fontSize: `${p.size}rem` }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: '110vh', x: [0, p.drift * 0.3, p.drift * 0.7, p.drift], rotate: [p.rotation, p.rotation + 180, p.rotation + 360], opacity: [0, 0.06, 0.06, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' as const }}
        >🌸</motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── SECTION DIVIDER (organic gradient) ───
// ═══════════════════════════════════════════════════════
function SectionDivider() {
  return (
    <div className="relative h-16 md:h-24 w-full pointer-events-none">
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,80,100,0.015) 40%, rgba(255,80,100,0.015) 60%, transparent 100%)',
      }} />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px mx-auto" style={{
        maxWidth: '200px', background: 'linear-gradient(90deg, transparent, rgba(255,80,100,0.1), transparent)',
      }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── POEM SECTION ───
// ═══════════════════════════════════════════════════════
function PoemLine({ children, delay = 0, highlight = false }: { children: string; delay?: number; highlight?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.p ref={ref} className="text-center"
      style={{ ...display, fontSize: highlight ? 'clamp(1.1rem, 1.5vw, 1.3rem)' : 'var(--text-body)', letterSpacing: highlight ? '0.03em' : '0.015em', lineHeight: highlight ? 1.9 : 2, fontWeight: highlight ? 500 : 300, color: highlight ? c.ink : c.inkDim }}
      initial={{ opacity: 0.15, y: 12, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.2, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.p>
  )
}

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
      <div className="text-center mb-14" style={{ maxWidth: '65ch', margin: '0 auto 3.5rem' }}>
        <motion.p className="tracking-[0.25em] uppercase mb-3"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeOut }}
        >
          mots du cœur
        </motion.p>
        <TextReveal text="Mon Poème pour Toi" as="h2"
          style={{ ...display, color: c.ink, fontSize: 'var(--text-h2)', letterSpacing: '0.02em', fontWeight: 300, lineHeight: 1.2 }}
          delay={0.15}
        />
      </div>
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

// ═══════════════════════════════════════════════════════
// ─── ENVELOPE SECTION ───
// ═══════════════════════════════════════════════════════
function EnvelopeSection() {
  const [isOpen, setIsOpen] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className="relative flex items-center justify-center px-6"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <div className="text-center mb-12" style={{ maxWidth: '65ch', margin: '0 auto 3rem' }}>
        <motion.p className="tracking-[0.25em] uppercase mb-3"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeOut }}>
          un message pour toi
        </motion.p>
        <TextReveal text="Lettre d'Amour" as="h2"
          style={{ ...display, color: c.ink, fontSize: 'var(--text-h2)', fontWeight: 300, letterSpacing: '0.02em', lineHeight: 1.2 }}
          delay={0.15}
        />
      </div>

      <motion.div
        className="relative cursor-pointer max-w-md w-full mx-auto"
        style={{ perspective: '1000px' }}
        onClick={() => !isOpen && setIsOpen(true)}
        initial={{ opacity: 0.15, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: easeOutExpo }}
      >
        {/* Envelope body */}
        <motion.div
          className="relative overflow-hidden"
          style={{
            borderRadius: '8px',
            background: 'linear-gradient(145deg, rgba(50,25,35,0.95), rgba(30,15,20,0.98))',
            border: '1px solid rgba(255,80,100,0.08)',
            boxShadow: isOpen ? '0 20px 60px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.3)',
            minHeight: '260px',
          }}
          animate={isOpen ? { borderRadius: '8px 8px 4px 4px' } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <motion.div
            className="p-8 md:p-10 relative z-10"
            animate={isOpen ? { y: -20 } : { y: 0 }}
            transition={{ duration: 1.2, ease: easeOutExpo }}
          >
            <p style={{ ...script, color: c.ink, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', marginBottom: '1rem' }}>
              Ma chère Roxane,
            </p>
            <p className="leading-relaxed" style={{ ...display, color: c.inkDim, fontSize: 'var(--text-body)', fontWeight: 300, letterSpacing: '0.01em', maxWidth: '55ch' }}>
              Si tu lis ces mots, c&apos;est que tu es la personne la plus importante de ma vie.
              Chaque jour à tes côtés est un cadeau que je ne mérite pas, mais que je chéris plus que tout.
              Tu es mon refuge, ma force, et la raison pour laquelle je crois en l&apos;amour.
            </p>
            <p className="mt-6" style={{ ...script, color: c.accentSoft, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
              À toi, pour toujours.
            </p>
          </motion.div>

          {/* Envelope flap */}
          <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: '140px', zIndex: isOpen ? 5 : 20 }}>
            <motion.div
              className="w-0 h-0"
              style={{
                marginLeft: 'auto', marginRight: 'auto',
                borderLeft: '200px solid transparent', borderRight: '200px solid transparent',
                borderTop: '140px solid rgba(50,25,35,0.95)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                transformOrigin: 'top center',
              }}
              initial={{ rotateX: 0 }}
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 1, ease: easeOutExpo }}
            />
          </div>
        </motion.div>

        {/* Open hint */}
        <AnimatePresence>
          {!isOpen && (
            <motion.p
              className="text-center mt-4"
              style={{ ...display, color: c.inkFaint, fontSize: '0.8rem', letterSpacing: '0.06em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: easeSmooth }}
              exit={{ opacity: 0 }}
            >
              clique pour ouvrir
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── REASONS SECTION ───
// ═══════════════════════════════════════════════════════
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
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section id="raisons" ref={sectionRef} className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <div className="text-center mb-14" style={{ maxWidth: '65ch', margin: '0 auto 3.5rem' }}>
        <motion.p className="tracking-[0.25em] uppercase mb-3"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeOut }}>
          parce que tu mérites de savoir
        </motion.p>
        <TextReveal text="Pourquoi Je T'aime" as="h2"
          style={{ ...display, color: c.ink, fontSize: 'var(--text-h2)', fontWeight: 300, letterSpacing: '0.02em', lineHeight: 1.2 }}
          delay={0.15}
        />
      </div>
      <div className="max-w-lg mx-auto relative">
        <motion.div
          className="absolute left-3 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${c.line}, ${c.line}, transparent)` }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 2, ease: easeOut }}
        />
        <div className="space-y-6">
          {reasons.map((reason, i) => (
            <motion.div key={i} className="relative pl-10 md:pl-12"
              initial={{ opacity: 0.15, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: easeOutExpo }}
            >
              <motion.div className="absolute left-[5px] md:left-[7px] top-[7px] w-2 h-2 rounded-full"
                style={{ background: c.accent }}
                whileInView={{ scale: [0, 1.4, 1] }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 + 0.1, ease: easeOut }}
              />
              <p className="leading-relaxed" style={{ ...display, color: c.inkDim, fontSize: 'var(--text-body)', fontWeight: 400, letterSpacing: '0.01em' }}>
                {reason}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── NOTRE CHANSON ───
// ═══════════════════════════════════════════════════════
function SongSection() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => { if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100) }
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('ended', () => setIsPlaying(false))
    return () => { audio.removeEventListener('timeupdate', update) }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause() } else { audio.play().catch(() => {}) }
    setIsPlaying(!isPlaying)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  return (
    <section ref={sectionRef} className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <div className="text-center mb-14" style={{ maxWidth: '65ch', margin: '0 auto 3.5rem' }}>
        <motion.p className="tracking-[0.25em] uppercase mb-3"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: easeOut }}>
          notre mélodie
        </motion.p>
        <TextReveal text="Notre Chanson" as="h2"
          style={{ ...display, color: c.ink, fontSize: 'var(--text-h2)', fontWeight: 300, letterSpacing: '0.02em', lineHeight: 1.2 }}
          delay={0.15}
        />
      </div>
      <div className="max-w-sm mx-auto">
        <audio ref={audioRef} src="/music/romance.mp3" preload="metadata" />
        <motion.div
          className="p-6 relative"
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(255,80,100,0.06)',
            background: 'rgba(255,255,255,0.012)',
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0.15, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: easeOutExpo }}
        >
          <div className="flex items-center gap-4 mb-5">
            <motion.button
              onClick={toggle}
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(255,80,100,0.08)', border: '1px solid rgba(255,80,100,0.1)' }}
              whileHover={{ scale: 1.08, background: 'rgba(255,80,100,0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth="1.5"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
              )}
            </motion.button>
            <div>
              <p style={{ ...display, color: c.ink, fontSize: '1rem', fontWeight: 500, letterSpacing: '0.01em' }}>Notre Chanson</p>
              <p style={{ ...display, color: c.inkFaint, fontSize: '0.8rem', fontWeight: 300 }}>Écoute ensemble</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="relative h-1 rounded-full cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)' }}
            onClick={seek}>
            <motion.div className="absolute top-0 left-0 h-full rounded-full"
              style={{ background: c.accent, width: `${progress}%`, transition: 'width 0.3s linear' }} />
            <motion.div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
              style={{ background: c.ink, left: `${progress}%`, marginLeft: '-5px', boxShadow: '0 0 8px rgba(255,80,100,0.3)' }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── SCROLL INDICATOR ───
// ═══════════════════════════════════════════════════════
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 5.5, duration: 1, ease: easeOut }}
    >
      <span className="tracking-[0.35em] uppercase" style={{ ...script, color: c.inkFaint, fontSize: '1.1rem' }}>
        fais défiler
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: easeSmooth }}
        style={{ color: 'rgba(255, 120, 140, 0.25)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── MAIN PAGE ───
// ═══════════════════════════════════════════════════════
export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.94])
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40])

  return (
    <div className="relative" style={{ background: 'var(--surface)' }}>
      {/* Fingerprint intro gate */}
      <FingerprintIntro onUnlock={() => setIsUnlocked(true)} />

      {isUnlocked && (
        <>
          {/* ═══ BACKGROUND LAYERS ═══ */}
          <AuroraBackground />
          <Atmosphere />
          <FloatingHearts />
          <PetalsRain />

          {/* ═══ FIXED UI ═══ */}
          <HeartProgressBar />
          <ClickSparkles />
          <CursorHeartTrail />
          <DoubleTapHeart />
          <MusicPlayer />

          {/* ═══ HERO ═══ */}
          <motion.section
            className="relative flex flex-col items-center justify-center overflow-hidden"
            style={{ minHeight: '100vh', opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
            {/* Hero ambient particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div key={`hp-${i}`} className="absolute rounded-full"
                  style={{
                    width: 1 + Math.random() * 2, height: 1 + Math.random() * 2,
                    left: `${15 + Math.random() * 70}%`, top: `${15 + Math.random() * 70}%`,
                    background: `rgba(255, ${80 + Math.random() * 80}, ${100 + Math.random() * 60}, ${0.06 + Math.random() * 0.1})`,
                  }}
                  animate={{ y: [-12, 12, -12], x: [-6, 6, -6], opacity: [0.06, 0.18, 0.06] }}
                  transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: easeSmooth, delay: Math.random() * 3 }}
                />
              ))}
            </div>

            {/* Heart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
              className="relative z-10"
            >
              <HeartWords />
            </motion.div>

            {/* Title */}
            <motion.div
              className="text-center relative z-10 mt-4"
              style={{ maxWidth: '65ch' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.5, ease: easeOutExpo }}
            >
              <motion.h1
                className="font-light"
                style={{ ...display, color: c.ink, fontSize: 'var(--text-display)', letterSpacing: '0.04em', fontWeight: 300, lineHeight: 1.15 }}
                animate={{ textShadow: ['0 0 20px rgba(255,80,100,0.15)', '0 0 40px rgba(255,80,100,0.35)', '0 0 20px rgba(255,80,100,0.15)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: easeSmooth }}
              >
                Roxane, Tu Es Mon Seul Amour
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 4.2, ease: easeOutExpo }}
                className="mt-4 mx-auto"
                style={{ width: 45, height: 1, background: `linear-gradient(90deg, transparent, ${c.line}, transparent)` }}
              />
              <motion.p
                className="mt-3"
                style={{ ...script, color: c.inkFaint, letterSpacing: '0.08em', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 4.8, ease: easeOut }}
              >
                pour toujours et à jamais...
              </motion.p>
            </motion.div>

            <ScrollIndicator />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(11,4,7,0.8) 100%)' }} />
          </motion.section>

          {/* ═══ SECTIONS ═══ */}
          <SectionDivider />
          <CinematicGallery />
          <SectionDivider />

          <RotatingWordsSection />
          <SectionDivider />

          <AnimatedCounterSection />
          <SectionDivider />

          <EnvelopeSection />
          <SectionDivider />

          <PoemSection />
          <SectionDivider />

          <PromiseCards />
          <SectionDivider />

          <ReasonsSection />
          <SectionDivider />

          <AlternatingTimeline />
          <SectionDivider />

          <SongSection />
          <SectionDivider />

          <SpectacularEnding />

          <div className="h-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--surface))' }} />
        </>
      )}
    </div>
  )
}