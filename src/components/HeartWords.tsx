'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Easing (impeccable: ease-out quint/expo) ───
const easeOut = [0.22, 1, 0.36, 1] as const

// Generate points that fill a heart shape
function generateHeartPoints(count: number, scale: number) {
  const points: { x: number; y: number; angle: number; delay: number }[] = []
  
  const heartX = (t: number) => 16 * Math.pow(Math.sin(t), 3)
  const heartY = (t: number) => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  
  let placed = 0
  let attempts = 0
  const maxAttempts = count * 50
  
  while (placed < count && attempts < maxAttempts) {
    attempts++
    const t = Math.random() * Math.PI * 2
    const r = Math.pow(Math.random(), 0.5)
    
    const ox = heartX(t)
    const oy = heartY(t)
    
    const x = ox * r * scale
    const y = oy * r * scale
    
    const tooClose = points.some(p => {
      const dx = p.x - x
      const dy = p.y - y
      return Math.sqrt(dx * dx + dy * dy) < scale * 1.2
    })
    
    if (!tooClose) {
      const dist = Math.sqrt(x * x + y * y)
      const maxDist = 17 * scale
      const normalizedDist = dist / maxDist
      
      points.push({
        x,
        y,
        angle: Math.atan2(y, x),
        delay: normalizedDist * 2.5,
      })
      placed++
    }
  }
  
  return points
}

function generateHeartOutline(scale: number) {
  const points: { x: number; y: number }[] = []
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3) * scale
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale
    points.push({ x, y })
  }
  return points
}

const lovePhrases = [
  'je t\'aime',
  'Je t\'aime',
  'JE T\'AIME',
  'Je T\'Aime',
  'je T\'Aime',
  'amour',
  'Amour',
  'toujours',
  'éternel',
  'mon cœur',
  'mon amour',
  'tendresse',
  'passion',
  'désir',
  'caresse',
  'bisous',
  'câlin',
  'ensemble',
  'pour toi',
  'infini',
  'romance',
  'bébé',
  'chéri(e)',
  'flamme',
  '♥',
]

function getRandomPhrase() {
  return lovePhrases[Math.floor(Math.random() * lovePhrases.length)]
}

export default function HeartWords() {
  const [isComplete, setIsComplete] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const scale = 7.5
  const wordCount = 100
  
  const points = useMemo(() => generateHeartPoints(wordCount, scale), [wordCount, scale])
  const outlinePoints = useMemo(() => generateHeartOutline(scale), [scale])
  const phrases = useMemo(() => points.map(() => getRandomPhrase()), [points])
  const fontSizes = useMemo(() => 
    points.map(() => 0.45 + Math.random() * 0.55), 
    [points]
  )
  const opacities = useMemo(() => 
    points.map(() => 0.45 + Math.random() * 0.55), 
    [points]
  )
  const floatOffsets = useMemo(() => 
    points.map(() => ({
      x: (Math.random() - 0.5) * 2.5,
      y: (Math.random() - 0.5) * 2.5,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      rotate: (Math.random() - 0.5) * 10,
    })), 
    [points]
  )

  const outlinePath = useMemo(() => {
    if (outlinePoints.length === 0) return ''
    return outlinePoints.map((p, i) => {
      const cmd = i === 0 ? 'M' : 'L'
      return `${cmd} ${p.x + 130} ${p.y + 135}`
    }).join(' ') + ' Z'
  }, [outlinePoints])

  const containerSize = 320
  const maxDelay = Math.max(...points.map(p => p.delay))

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true)
    }, (maxDelay + 0.8) * 1000)
    return () => clearTimeout(timer)
  }, [maxDelay])

  return (
    <div className="relative flex items-center justify-center" style={{ width: containerSize, height: containerSize }}>
      {/* Glow — subtler, more refined */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 0.25, 0.1],
              scale: [0.97, 1.03, 0.97],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: [0.45, 0, 0.55, 1],
            }}
            className="absolute rounded-full"
            style={{
              width: containerSize * 0.65,
              height: containerSize * 0.65,
              background: 'radial-gradient(circle, rgba(255, 50, 80, 0.3) 0%, rgba(255, 50, 80, 0.08) 40%, transparent 70%)',
              filter: 'blur(25px)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* SVG outline — draws itself */}
      <svg
        className="absolute pointer-events-none"
        width={containerSize}
        height={containerSize}
        viewBox={`0 0 280 280`}
        style={{ opacity: isComplete ? 0.1 : 0 }}
      >
        <motion.path
          d={outlinePath}
          fill="none"
          stroke="oklch(0.65 0.20 10)"
          strokeWidth="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: isComplete ? 1 : 0,
            opacity: isComplete ? 1 : 0,
          }}
          transition={{ duration: 2.5, ease: easeOut as unknown as number[] }}
        />
      </svg>

      {/* Heart made of words */}
      <motion.div
        className="relative"
        animate={isComplete ? { 
          scale: [1, 1.03, 1, 1.015, 1],
        } : {}}
        transition={isComplete ? {
          duration: 4,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
          times: [0, 0.3, 0.5, 0.7, 1],
        } : {}}
        style={{ 
          width: containerSize, 
          height: containerSize,
          transformOrigin: 'center center',
        }}
      >
        {points.map((point, i) => {
          const float = floatOffsets[i]
          const isHovered = hoveredIndex === i
          
          return (
            <motion.span
              key={i}
              className="absolute select-none cursor-default"
              style={{
                left: '50%',
                top: '50%',
                fontSize: `${fontSizes[i]}rem`,
                lineHeight: 1,
                fontWeight: fontSizes[i] > 0.7 ? 500 : 300,
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', 'Georgia', serif",
                whiteSpace: 'nowrap',
                pointerEvents: 'auto',
                zIndex: isHovered ? 20 : 1,
                textShadow: isComplete 
                  ? '0 0 6px rgba(255, 80, 100, 0.35)' 
                  : 'none',
              }}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: isComplete ? opacities[i] : [0, opacities[i]],
                scale: isHovered ? 1.6 : (isComplete ? [1, 1.06, 1] : 1),
                x: point.x + (isComplete ? float.x * 0.4 : 0),
                y: point.y + (isComplete ? float.y * 0.4 : 0),
                rotate: isComplete ? float.rotate * 0.2 : 0,
                color: isHovered 
                  ? 'oklch(0.70 0.22 12)'
                  : isComplete 
                    ? [`oklch(0.60 0.15 350 / ${opacities[i]})`, `oklch(0.70 0.20 10 / ${opacities[i] + 0.15})`, `oklch(0.60 0.15 350 / ${opacities[i]})`]
                    : 'oklch(0.60 0.20 10)',
              }}
              transition={{
                opacity: { duration: 0.5, delay: point.delay, ease: easeOut as unknown as number[] },
                scale: { 
                  duration: isHovered ? 0.25 : (isComplete ? 3 + float.duration : 0.4), 
                  delay: isHovered ? 0 : (isComplete ? float.delay : point.delay),
                  repeat: isComplete && !isHovered ? Infinity : 0,
                  ease: [0.45, 0, 0.55, 1],
                },
                x: { 
                  duration: isComplete ? float.duration : 0.6, 
                  delay: isComplete ? float.delay : point.delay,
                  repeat: isComplete ? Infinity : 0,
                  ease: [0.45, 0, 0.55, 1],
                  yoyo: true,
                },
                y: { 
                  duration: isComplete ? float.duration : 0.6, 
                  delay: isComplete ? float.delay : point.delay,
                  repeat: isComplete ? Infinity : 0,
                  ease: [0.45, 0, 0.55, 1],
                  yoyo: true,
                },
                rotate: {
                  duration: float.duration * 1.5,
                  delay: isComplete ? float.delay : point.delay + 0.3,
                  repeat: isComplete ? Infinity : 0,
                  ease: [0.45, 0, 0.55, 1],
                  yoyo: true,
                },
                color: {
                  duration: isComplete ? 3.5 : 0.4,
                  delay: isComplete ? float.delay : point.delay,
                  repeat: isComplete ? Infinity : 0,
                  ease: [0.45, 0, 0.55, 1],
                },
              }}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {phrases[i]}
            </motion.span>
          )
        })}
      </motion.div>

      {/* Sparkle particles — fewer, more refined */}
      <AnimatePresence>
        {isComplete && (
          <>
            {[...Array(5)].map((_, i) => {
              const angle = (i / 5) * Math.PI * 2
              const radius = 95 + Math.random() * 35
              const cx = Math.cos(angle) * radius
              const cy = Math.sin(angle) * radius
              
              return (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 2 + Math.random() * 2,
                    height: 2 + Math.random() * 2,
                    background: `rgba(255, ${100 + Math.random() * 100}, ${120 + Math.random() * 80}, ${0.4 + Math.random() * 0.4})`,
                    left: '50%',
                    top: '50%',
                    x: cx,
                    y: cy,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 1.3, 0],
                    y: [cy, cy - 12, cy - 24],
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 2,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                  }}
                />
              )
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}