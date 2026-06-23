'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import HeartWords from '@/components/HeartWords'
import Image from 'next/image'

// ═══════════════════════════════════════════════════════
// ─── CONSTANTS ───
// ═══════════════════════════════════════════════════════

// ⬇️ Change cette date pour ton anniversaire de couple ⬇️
const COUPLE_START_DATE = new Date('2024-01-15')

// ─── Font aliases ───
const display = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif" }
const script = { fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive" }

// ─── Shared easing ───
const easeOut = [0.22, 1, 0.36, 1] as const
const easeOutExpo = [0.16, 1, 0.3, 1] as const
const easeSmooth = [0.45, 0, 0.55, 1] as const

// ─── Color tokens ───
const c = {
  ink: 'oklch(0.82 0.06 350)',
  inkDim: 'oklch(0.68 0.08 350)',
  inkFaint: 'oklch(0.55 0.06 350)',
  accent: 'oklch(0.65 0.20 10)',
  accentSoft: 'oklch(0.60 0.12 350)',
  line: 'rgba(255, 80, 100, 0.2)',
}

// ═══════════════════════════════════════════════════════
// ─── FINGERPRINT INTRO (inspired by video) ───
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
    if (holdTimer.current) {
      clearInterval(holdTimer.current)
      holdTimer.current = null
    }
    // Slowly reset
    setProgress(prev => {
      if (prev < 10) return 0
      return prev
    })
    const decay = setInterval(() => {
      setProgress(p => {
        if (p <= 0) { clearInterval(decay); return 0 }
        return p - 1.5
      })
    }, 30)
  }, [])

  useEffect(() => {
    return () => { if (holdTimer.current) clearInterval(holdTimer.current) }
  }, [])

  return (
    <AnimatePresence>
      {!unlocked && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #0b0407 0%, #140810 50%, #0b0407 100%)' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
        >
          {/* Fingerprint SVG */}
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
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easeOutExpo }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Progress ring */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,80,100,0.08)" strokeWidth="2" />
              <motion.circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="oklch(0.65 0.20 10)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
            {/* Fingerprint icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={isHolding ? { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.5 }}
                transition={{ duration: 1.5, repeat: isHolding ? Infinity : 0, ease: easeSmooth as unknown as number[] }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Maintiens pressé pour entrer
          </motion.p>
          <motion.p
            className="mt-2 text-center"
            style={{ ...display, color: 'rgba(255,80,100,0.3)', fontSize: '0.75rem', fontWeight: 300 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
// ─── #1 HEART PROGRESS BAR ───
// ═══════════════════════════════════════════════════════
function HeartProgressBar() {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.9, 1], [0, 1, 1, 0])

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      style={{ opacity }}
    >
      <svg width="28" height="26" viewBox="0 0 28 26" fill="none">
        <path
          d="M14 26s-13-8.4-13-17a7.3 7.3 0 0 1 13-4.6A7.3 7.3 0 0 1 27 9c0 8.6-13 17-13 17z"
          stroke="rgba(255,80,100,0.15)"
          strokeWidth="1.5"
        />
        <motion.path
          d="M14 26s-13-8.4-13-17a7.3 7.3 0 0 1 13-4.6A7.3 7.3 0 0 1 27 9c0 8.6-13 17-13 17z"
          stroke="oklch(0.65 0.20 10)"
          strokeWidth="1.5"
          style={{ pathLength }}
          fill="none"
        />
      </svg>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── #2 CLICK SPARKLES ───
// ═══════════════════════════════════════════════════════
function ClickSparkles() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    let nextId = 0
    const handler = (e: MouseEvent) => {
      const id = nextId++
      const newSparkles = Array.from({ length: 6 }, (_, i) => ({
        id: id * 100 + i,
        x: e.clientX + (Math.random() - 0.5) * 40,
        y: e.clientY + (Math.random() - 0.5) * 40,
      }))
      setSparkles(prev => [...prev, ...newSparkles])
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)))
      }, 800)
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: s.x,
              top: s.y,
              width: 3 + Math.random() * 3,
              height: 3 + Math.random() * 3,
              background: `oklch(0.75 ${0.15 + Math.random() * 0.1} ${350 + Math.random() * 20})`,
            }}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0, x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 30 - 15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── #4 INTERACTIVE STARFIELD ───
// ═══════════════════════════════════════════════════════
function StarField() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 1.5,
      baseOpacity: 0.15 + Math.random() * 0.3,
      twinkleSpeed: 3 + Math.random() * 4,
      twinkleDelay: Math.random() * 5,
    }))
  ).current

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(star => {
        const starPixelX = (star.x / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1000)
        const starPixelY = (star.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 1000)
        const dist = Math.sqrt((mousePos.x - starPixelX) ** 2 + (mousePos.y - starPixelY) ** 2)
        const proximity = Math.max(0, 1 - dist / 150)
        const extraOpacity = proximity * 0.5
        const extraSize = proximity * 2
        return (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size + extraSize,
              height: star.size + extraSize,
              background: `rgba(255, ${180 + proximity * 75}, ${200 + proximity * 55}, ${star.baseOpacity + extraOpacity})`,
            }}
            animate={{
              opacity: [star.baseOpacity + extraOpacity, star.baseOpacity + extraOpacity + 0.15, star.baseOpacity + extraOpacity],
            }}
            transition={{
              duration: star.twinkleSpeed,
              repeat: Infinity,
              ease: easeSmooth as unknown as number[],
              delay: star.twinkleDelay,
            }}
          />
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── #6 CURSOR HEART TRAIL ───
// ═══════════════════════════════════════════════════════
function CursorHeartTrail() {
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    let nextId = 0
    let lastSpawn = 0
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
          <motion.span
            key={t.id}
            className="absolute"
            style={{ left: t.x, top: t.y, fontSize: '0.7rem', color: 'rgba(255,120,140,0.4)' }}
            initial={{ opacity: 0.6, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, y: -30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: easeOut }}
          >
            ♥
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── #8 MUSIC PLAYER ───
// ═══════════════════════════════════════════════════════
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggle = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  return (
    <>
      <audio ref={audioRef} src="/music/romance.mp3" loop preload="none" />
      <motion.button
        className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,80,100,0.12)',
          backdropFilter: 'blur(10px)',
        }}
        onClick={toggle}
        whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 6, duration: 0.8, ease: easeOut }}
        title={isPlaying ? 'Pause' : 'Musique'}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.7)" strokeWidth="1.5">
            <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,180,190,0.5)" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </motion.button>
      {isPlaying && (
        <motion.div
          className="fixed bottom-5 right-[3.75rem] z-50 flex items-end gap-[3px] h-4"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-[2px] rounded-full"
              style={{ background: 'rgba(255,120,140,0.5)', height: '40%' }}
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
// ─── #11 DOUBLE-TAP HEART ───
// ═══════════════════════════════════════════════════════
function DoubleTapHeart() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const lastTap = useRef({ time: 0, x: 0, y: 0 })

  useEffect(() => {
    let nextId = 0
    const handler = (e: MouseEvent) => {
      const now = Date.now()
      const dx = Math.abs(e.clientX - lastTap.current.x)
      const dy = Math.abs(e.clientY - lastTap.current.y)
      if (now - lastTap.current.time < 350 && dx < 50 && dy < 50) {
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
          <motion.div
            key={h.id}
            className="absolute"
            style={{ left: h.x, top: h.y, translateX: '-50%', translateY: '-50%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 0.3, 1.3, 1.5], y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: easeOut }}
          >
            <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 15px rgba(255,60,90,0.5))' }}>❤️</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── #9 WAVE TRANSITION (replaces Divider) ───
// ═══════════════════════════════════════════════════════
function WaveTransition({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative w-full" style={{ height: '40px', marginTop: '-1px', marginBottom: '-1px' }}>
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
      >
        <path
          d="M0,20 C300,40 600,0 900,20 C1050,30 1150,15 1200,20 L1200,40 L0,40 Z"
          fill="rgba(255,80,100,0.03)"
        />
        <path
          d="M0,25 C200,10 500,35 800,18 C1000,8 1100,28 1200,22 L1200,40 L0,40 Z"
          fill="rgba(255,80,100,0.015)"
        />
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── FLOATING HEARTS & PETALS ───
// ═══════════════════════════════════════════════════════
function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`fh-${i}`}
          className="absolute"
          style={{
            left: `${5 + Math.random() * 90}%`,
            fontSize: `${0.2 + Math.random() * 0.35}rem`,
            opacity: 0.03 + Math.random() * 0.04,
            color: c.inkFaint,
          }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: [0, 12, -8, 15, -10, 0],
            x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 20 + Math.random() * 20,
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

function PetalsRain() {
  const petals = useRef(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: 8 + Math.random() * 84,
      delay: Math.random() * 25,
      duration: 18 + Math.random() * 18,
      size: 0.25 + Math.random() * 0.3,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 140,
    }))
  ).current

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
            opacity: [0, 0.06, 0.06, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' as const }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── SHARED SECTION HEADING ───
// ═══════════════════════════════════════════════════════
function SectionHeading({ eyebrow, title, delay = 0 }: { eyebrow: string; title: string; delay?: number }) {
  return (
    <motion.div className="text-center mb-14 md:mb-16" style={{ maxWidth: '65ch', margin: '0 auto 3.5rem' }}>
      <motion.p
        className="tracking-[0.25em] uppercase mb-3"
        style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: easeOut, delay }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="font-light"
        style={{ ...display, color: c.ink, fontSize: 'var(--text-h2)', letterSpacing: '0.02em', fontWeight: 300, lineHeight: 1.2 }}
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
// ─── GALLERY (cinematic masonry) ───
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
            style={{ borderRadius: '2px' }}
            initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0.5 }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 1.2, delay: i * 0.15, ease: easeOutExpo }}
            onClick={() => setSelectedPhoto(i)}
          >
            <Image src={photo.src} alt="Roxane" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="(max-width: 768px) 45vw, 350px" />
            <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(180deg, rgba(11,4,7,0) 40%, rgba(11,4,7,0.7) 100%)', opacity: 0.6 }} />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <p style={{ ...script, color: `color-mix(in oklch, ${c.ink} 70%, transparent)`, fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)' }}>{photo.caption}</p>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,100,130,0.15), 0 8px 30px rgba(0,0,0,0.4)' }} />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(5,2,3,0.96)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl aspect-[4/5] md:aspect-[3/4] overflow-hidden"
              style={{ borderRadius: '3px', boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={photos[selectedPhoto].src} alt="Roxane" fill className="object-cover" sizes="(max-width: 768px) 90vw, 600px" />
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.4)' }} />
            </motion.div>
            <motion.p className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center" style={{ ...script, color: c.inkDim, fontSize: '1.2rem' }} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6, ease: easeOut }}>
              {photos[selectedPhoto].caption}
            </motion.p>
            <motion.button className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }} onClick={() => setSelectedPhoto(null)} whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.12)' }} whileTap={{ scale: 0.95 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </motion.button>
            <motion.button className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }} onClick={(e) => { e.stopPropagation(); setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1) }} whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
            </motion.button>
            <motion.button className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }} onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % photos.length) }} whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── #5 COUNTER SECTION ───
// ═══════════════════════════════════════════════════════
function CounterSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [counts, setCounts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!isInView) return
    const calc = () => {
      const now = new Date()
      const diff = now.getTime() - COUPLE_START_DATE.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setCounts({ days, hours, minutes, seconds })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [isInView])

  const units = [
    { value: counts.days, label: 'jours' },
    { value: counts.hours, label: 'heures' },
    { value: counts.minutes, label: 'minutes' },
    { value: counts.seconds, label: 'secondes' },
  ]

  return (
    <section ref={ref} className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <SectionHeading eyebrow="depuis le premier jour" title="Notre Histoire Continue" />
      <div className="flex justify-center gap-6 md:gap-10">
        {units.map((unit, i) => (
          <motion.div
            key={unit.label}
            className="text-center"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: easeOutExpo }}
          >
            <motion.span
              className="block tabular-nums"
              style={{
                ...display,
                color: c.accent,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span
              className="block mt-1.5 uppercase"
              style={{ ...display, color: c.inkFaint, fontSize: '0.7rem', letterSpacing: '0.15em', fontWeight: 400 }}
            >
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-center mt-10"
        style={{ ...script, color: c.inkFaint, fontSize: '1.1rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        et chaque seconde est un cadeau
      </motion.p>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── #3 ENVELOPE SECTION ───
// ═══════════════════════════════════════════════════════
function EnvelopeSection() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <section ref={ref} className="relative flex items-center justify-center px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <div className="relative w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
        {/* Envelope body */}
        <motion.div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(40,20,25,0.6), rgba(25,10,15,0.8))',
            border: '1px solid rgba(255,80,100,0.08)',
            borderRadius: '4px',
            minHeight: '280px',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: easeOutExpo }}
        >
          {/* Letter */}
          <motion.div
            className="p-8 md:p-10 relative z-10"
            initial={{ y: 0 }}
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
                marginLeft: 'auto',
                marginRight: 'auto',
                borderLeft: '200px solid transparent',
                borderRight: '200px solid transparent',
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
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── POEM SECTION ───
// ═══════════════════════════════════════════════════════
function PoemLine({ children, delay = 0, highlight = false }: { children: string; delay?: number; highlight?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.p
      ref={ref}
      className="text-center"
      style={{
        ...display,
        fontSize: highlight ? 'clamp(1.1rem, 1.5vw, 1.3rem)' : 'var(--text-body)',
        letterSpacing: highlight ? '0.03em' : '0.015em',
        lineHeight: highlight ? 1.9 : 2,
        fontWeight: highlight ? 500 : 300,
        color: highlight ? c.ink : c.inkDim,
      }}
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

// ═══════════════════════════════════════════════════════
// ─── #7 PROMISES SECTION ───
// ═══════════════════════════════════════════════════════
function PromisesSection() {
  const promises = [
    'Je promets de te faire rire chaque jour, même quand tout va mal.',
    'Je promets d\'être ton refuge quand le monde sera trop lourd.',
    'Je promets de t\'écouter, vraiment t\'écouter, même à 3h du matin.',
    'Je promets de te choisir, encore et encore, chaque matin.',
    'Je promets de danser avec toi dans la cuisine, même sans musique.',
    'Je promets que ton cœur sera toujours en sécurité avec moi.',
  ]

  return (
    <section className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <SectionHeading eyebrow="mes vœux pour toi" title="Mes Promesses" />
      <div className="max-w-lg mx-auto space-y-8">
        {promises.map((promise, i) => (
          <motion.div
            key={i}
            className="relative pl-6"
            style={{
              borderLeft: `1px solid rgba(255,80,100,${0.08 + (i / promises.length) * 0.15})`,
            }}
            initial={{ opacity: 0.15, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: easeOutExpo }}
          >
            <p
              className="leading-relaxed italic"
              style={{
                ...display,
                color: c.inkDim,
                fontSize: 'var(--text-body)',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              &ldquo;{promise}&rdquo;
            </p>
          </motion.div>
        ))}
      </div>
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
  return (
    <section id="raisons" className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <SectionHeading eyebrow="parce que tu mérites de savoir" title="Pourquoi Je T&apos;aime" />
      <div className="max-w-lg mx-auto relative">
        <motion.div
          className="absolute left-3 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${c.line}, ${c.line}, transparent)` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: easeOut }}
        />
        <div className="space-y-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              className="relative pl-10 md:pl-12"
              initial={{ opacity: 0.15, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: easeOutExpo }}
            >
              <motion.div
                className="absolute left-[5px] md:left-[7px] top-[7px] w-2 h-2 rounded-full"
                style={{ background: c.accent }}
                whileInView={{ scale: [0, 1.4, 1] }}
                viewport={{ once: true }}
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
// ─── TIMELINE SECTION ───
// ═══════════════════════════════════════════════════════
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
          style={{ background: `linear-gradient(to bottom, transparent, ${c.line}, ${c.line}, transparent)` }}
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
                style={{ background: 'rgba(255,50,80,0.12)', border: `1.5px solid ${c.accentSoft}` }}
                whileInView={{ scale: [0, 1.3, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25, ease: easeOut }}
              />
              <h3 style={{ ...display, color: c.ink, fontSize: 'var(--text-h3)', fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1.3, marginBottom: '0.375rem' }}>
                {moment.title}
              </h3>
              <p style={{ ...display, color: c.inkFaint, fontSize: 'var(--text-body)', fontWeight: 300, letterSpacing: '0.01em', maxWidth: '55ch', lineHeight: 1.6 }}>
                {moment.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── NOTRE CHANSON (visible audio player section) ───
// ═══════════════════════════════════════════════════════
function SongSection() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
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
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  return (
    <section className="relative px-6" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
      <SectionHeading eyebrow="notre mélodie" title="Notre Chanson" />
      <div className="max-w-sm mx-auto">
        <audio ref={audioRef} src="/music/romance.mp3" preload="metadata" />
        {/* Vinyl disc animation */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,80,100,0.05) 30%, rgba(20,10,15,0.8) 31%, rgba(20,10,15,0.9) 100%)',
              border: '1px solid rgba(255,80,100,0.08)',
              boxShadow: '0 0 40px rgba(255,60,90,0.05), inset 0 0 30px rgba(0,0,0,0.3)',
            }}
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: 'linear' as const } : {}}
          >
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(255,80,100,0.1), rgba(20,10,15,0.9))', border: '1px solid rgba(255,80,100,0.1)' }}
              >
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] } : { opacity: 0.4 }}
                  transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0, ease: easeSmooth as unknown as number[] }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.65 0.15 350)" strokeWidth="1.5">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                </motion.div>
              </div>
            </div>
            {/* Grooves */}
            {[0.35, 0.5, 0.65, 0.8].map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  inset: `${r * 50}%`,
                  border: '0.5px solid rgba(255,255,255,0.02)',
                }}
              />
            ))}
          </motion.div>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-5">
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: isPlaying ? 'rgba(255,80,100,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isPlaying ? 'rgba(255,80,100,0.2)' : 'rgba(255,255,255,0.06)'}` }}
            onClick={toggle}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.accent as string} strokeWidth="1.5">
                <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill={c.inkDim as string}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        </div>
        {/* Progress bar */}
        <div
          className="w-full h-1 rounded-full cursor-pointer relative group"
          style={{ background: 'rgba(255,80,100,0.08)' }}
          onClick={seek}
        >
          <div
            className="h-full rounded-full transition-[width] duration-200"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${c.accentSoft}, ${c.accent})` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)`, background: c.accent, boxShadow: '0 0 8px rgba(255,60,90,0.4)' }}
          />
        </div>
        <motion.p
          className="text-center mt-6"
          style={{ ...script, color: c.inkFaint, fontSize: '1rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          La chanson de notre histoire d&apos;amour
        </motion.p>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── CONFETTI FINAL (inspired by video) ───
// ═══════════════════════════════════════════════════════
function Confetti() {
  const pieces = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 5,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      color: [
        'oklch(0.65 0.22 12)',
        'oklch(0.70 0.18 45)',
        'oklch(0.60 0.20 350)',
        'oklch(0.75 0.15 30)',
        'oklch(0.55 0.15 10)',
      ][Math.floor(Math.random() * 5)],
      wobble: (Math.random() - 0.5) * 100,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))
  ).current

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-5%',
            width: p.size,
            height: p.shape === 'rect' ? p.size * 0.6 : p.size,
            borderRadius: p.shape === 'rect' ? '1px' : '50%',
            background: p.color,
            rotate: p.rotation,
          }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [0, p.wobble * 0.3, p.wobble * 0.7, p.wobble],
            rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear' as const,
          }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── FINAL SECTION (multi-style text like video) ───
// ═══════════════════════════════════════════════════════
function FinalSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.9, 1, 1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -20])

  const fullText = 'Je t\'aime plus que tous les mots du monde.'
  const [displayedText, setDisplayedText] = useState('')
  const sectionRef = useRef<HTMLDivElement>(null)
  const isTypingDone = useRef(false)

  useEffect(() => {
    if (isTypingDone.current) return
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTypingDone.current) {
          isTypingDone.current = true
          let i = 0
          const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, i + 1))
            i++
            if (i >= fullText.length) clearInterval(interval)
          }, 55)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fullText])

  return (
    <section ref={ref} className="relative flex items-center justify-center px-6 py-24 overflow-hidden" style={{ minHeight: '100vh' }}>
      <Confetti />
      <motion.div
        className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,40,70,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: easeSmooth as unknown as number[] }}
      />
      <motion.div className="relative z-10 text-center max-w-lg mx-auto" style={{ opacity, scale, y }}>
        {/* Gold small text — like video "Y AL FINAL SOLO QUEDA ESTO" */}
        <motion.p
          style={{
            ...display,
            color: 'oklch(0.75 0.15 85)',
            fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)',
            letterSpacing: '0.2em',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: easeOutExpo }}
        >
          Et à la fin, il ne reste que ça
        </motion.p>

        {/* Big red cursive — like video "Te amo, Mi amor." */}
        <motion.h2
          className="mt-4"
          style={{
            ...script,
            color: 'oklch(0.65 0.25 12)',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            letterSpacing: '0.03em',
            lineHeight: 1.2,
            textShadow: '0 0 30px rgba(255,60,90,0.2)',
          }}
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: easeOutExpo }}
        >
          Je t&apos;aime, Roxane.
        </motion.h2>

        {/* White smaller text — like video */}
        <motion.p
          className="mt-6 leading-relaxed"
          style={{
            ...display,
            color: c.inkDim,
            fontSize: 'var(--text-body)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            maxWidth: '50ch',
            margin: '1.5rem auto 0',
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: easeOut }}
        >
          Aujourd&apos;hui, demain, et tous les beaux mois qu&apos;il nous reste encore.
        </motion.p>

        {/* Gold signature — like video "Con todo mi amor ♡" */}
        <motion.p
          className="mt-8"
          style={{
            ...script,
            color: 'oklch(0.75 0.15 85)',
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            letterSpacing: '0.04em',
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: easeOut }}
        >
          Avec tout mon amour ♡
        </motion.p>

        {/* Typewriter line */}
        <div ref={sectionRef} className="mt-8">
          <p
            className="italic"
            style={{
              ...script,
              color: c.ink,
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
              letterSpacing: '0.03em',
              textShadow: '0 0 12px rgba(255,80,100,0.1)',
              minHeight: '2em',
            }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const }}
              style={{ color: c.accent }}
            >
              |
            </motion.span>
          </p>
        </div>
      </motion.div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ─── MAIN PAGE ───
// ═══════════════════════════════════════════════════════
export default function Home() {
  const heroRef = useRef(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -40])

  return (
    <div className="relative" style={{ background: 'linear-gradient(180deg, #0b0407 0%, #110810 25%, #0e0610 50%, #0a0818 75%, #0b0407 100%)' }}>
      {/* Fingerprint intro gate */}
      <FingerprintIntro onUnlock={() => setIsUnlocked(true)} />

      {isUnlocked && (
        <>
          {/* Fixed layers */}
          <StarField />
          <FloatingHearts />
          <PetalsRain />
          <HeartProgressBar />
          <ClickSparkles />
          <CursorHeartTrail />
          <DoubleTapHeart />
          <MusicPlayer />

          {/* ═══ HERO ═══ */}
          <motion.section
            ref={heroRef}
            className="relative flex flex-col items-center justify-center overflow-hidden"
            style={{ minHeight: '100vh', opacity: heroOpacity, scale: heroScale, y: heroY }}
          >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
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
              animate={{ y: [-12, 12, -12], x: [-6, 6, -6], opacity: [0.06, 0.18, 0.06] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: easeSmooth as unknown as number[], delay: Math.random() * 3 }}
            />
          ))}
        </div>

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
            style={{ ...display, color: c.ink, fontSize: 'var(--text-display)', letterSpacing: '0.04em', fontWeight: 300, lineHeight: 1.15 }}
            animate={{ textShadow: ['0 0 20px rgba(255,80,100,0.15)', '0 0 40px rgba(255,80,100,0.35)', '0 0 20px rgba(255,80,100,0.15)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: easeSmooth as unknown as number[] }}
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
      <WaveTransition />
      <CinematicGallery />
      <WaveTransition flip />

      <CounterSection />
      <WaveTransition />

      <EnvelopeSection />
      <WaveTransition flip />

      <PoemSection />
      <WaveTransition />

      <PromisesSection />
      <WaveTransition />

      <ReasonsSection />
      <WaveTransition />

      <TimelineSection />
      <WaveTransition flip />

      <SongSection />
      <WaveTransition />

      <FinalSection />

      <div className="h-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--surface))' }} />
        </>
      )}
    </div>
  )
}