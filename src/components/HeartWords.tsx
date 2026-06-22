'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Generate points that fill a heart shape
function generateHeartPoints(count: number, scale: number) {
  const points: { x: number; y: number; angle: number; delay: number }[] = []
  
  // Heart parametric equation: x = 16sin³(t), y = -(13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t))
  const heartX = (t: number) => 16 * Math.pow(Math.sin(t), 3)
  const heartY = (t: number) => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  
  let placed = 0
  let attempts = 0
  const maxAttempts = count * 50
  
  while (placed < count && attempts < maxAttempts) {
    attempts++
    
    // Random angle for the outline
    const t = Math.random() * Math.PI * 2
    // Random radius from 0 to 1 (for filling)
    const r = Math.pow(Math.random(), 0.5) // sqrt for uniform distribution in area
    
    const ox = heartX(t)
    const oy = heartY(t)
    
    const x = ox * r * scale
    const y = oy * r * scale
    
    // Check minimum distance from already placed points
    const tooClose = points.some(p => {
      const dx = p.x - x
      const dy = p.y - y
      return Math.sqrt(dx * dx + dy * dy) < scale * 1.2
    })
    
    if (!tooClose) {
      // Calculate distance from center for delay ordering (outside in, or center out)
      const dist = Math.sqrt(x * x + y * y)
      const maxDist = 17 * scale
      const normalizedDist = dist / maxDist
      
      points.push({
        x,
        y,
        angle: Math.atan2(y, x),
        delay: normalizedDist * 2.5 // Stagger: center appears first, then outward
      })
      placed++
    }
  }
  
  return points
}

// Heart outline points for the border glow
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
  'flame',
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
  
  // Phrases assigned to each point (stable across renders)
  const phrases = useMemo(() => points.map(() => getRandomPhrase()), [points])
  
  // Font sizes for variety
  const fontSizes = useMemo(() => 
    points.map(() => 0.5 + Math.random() * 0.65), 
    [points]
  )
  
  // Opacity variations
  const opacities = useMemo(() => 
    points.map(() => 0.5 + Math.random() * 0.5), 
    [points]
  )
  
  // Individual floating animation offsets
  const floatOffsets = useMemo(() => 
    points.map(() => ({
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 3,
      duration: 2.5 + Math.random() * 2,
      delay: Math.random() * 2,
      rotate: (Math.random() - 0.5) * 15,
    })), 
    [points]
  )

  // Heart outline SVG path
  const outlinePath = useMemo(() => {
    if (outlinePoints.length === 0) return ''
    return outlinePoints.map((p, i) => {
      const cmd = i === 0 ? 'M' : 'L'
      return `${cmd} ${p.x + 130} ${p.y + 135}` // offset to center in SVG
    }).join(' ') + ' Z'
  }, [outlinePoints])

  // Container dimensions - heart extends ~240x240 at this scale
  const containerSize = 320
  const maxDelay = Math.max(...points.map(p => p.delay))

  // Mark heart as complete after all words have appeared
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true)
    }, (maxDelay + 0.8) * 1000)
    return () => clearTimeout(timer)
  }, [maxDelay])

  return (
    <div className="relative flex items-center justify-center" style={{ width: containerSize, height: containerSize }}>
      {/* Glow effect behind the heart when complete */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.15, 0.35, 0.15],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
            className="absolute rounded-full"
            style={{
              width: containerSize * 0.7,
              height: containerSize * 0.7,
              background: 'radial-gradient(circle, rgba(255, 50, 80, 0.4) 0%, rgba(255, 50, 80, 0.1) 40%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* SVG heart outline that draws itself */}
      <svg
        className="absolute pointer-events-none"
        width={containerSize}
        height={containerSize}
        viewBox={`0 0 280 280`}
        style={{ opacity: isComplete ? 0.15 : 0 }}
      >
        <motion.path
          d={outlinePath}
          fill="none"
          stroke="rgba(255, 80, 100, 0.6)"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: isComplete ? 1 : 0,
            opacity: isComplete ? 1 : 0,
          }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </svg>

      {/* Heart made of words */}
      <motion.div
        className="relative"
        animate={isComplete ? { 
          scale: [1, 1.04, 1, 1.02, 1],
        } : {}}
        transition={isComplete ? {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
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
                fontWeight: fontSizes[i] > 0.8 ? 600 : 400,
                fontFamily: "'Georgia', 'Times New Roman', serif",
                whiteSpace: 'nowrap',
                pointerEvents: 'auto',
                zIndex: isHovered ? 20 : 1,
                textShadow: isComplete 
                  ? '0 0 8px rgba(255, 80, 100, 0.5)' 
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
                scale: isHovered ? 1.8 : (isComplete ? [1, 1.1, 1] : 1),
                x: point.x + (isComplete ? float.x * 0.5 : 0),
                y: point.y + (isComplete ? float.y * 0.5 : 0),
                rotate: isComplete ? float.rotate * 0.3 : 0,
                color: isHovered 
                  ? '#ff2d55' 
                  : isComplete 
                    ? [`rgba(220, 40, 70, ${opacities[i]})`, `rgba(255, 80, 100, ${opacities[i] + 0.2})`, `rgba(220, 40, 70, ${opacities[i]})`]
                    : 'rgba(220, 40, 70, 1)',
              }}
              transition={{
                opacity: { duration: 0.6, delay: point.delay, ease: 'easeOut' },
                scale: { 
                  duration: isHovered ? 0.3 : (isComplete ? 3 + float.duration : 0.5), 
                  delay: isHovered ? 0 : (isComplete ? float.delay : point.delay),
                  repeat: isComplete && !isHovered ? Infinity : 0,
                  ease: 'easeInOut',
                },
                x: { 
                  duration: isComplete ? float.duration : 0.8, 
                  delay: isComplete ? float.delay : point.delay,
                  repeat: isComplete ? Infinity : 0,
                  ease: 'easeInOut',
                  yoyo: true,
                },
                y: { 
                  duration: isComplete ? float.duration : 0.8, 
                  delay: isComplete ? float.delay : point.delay,
                  repeat: isComplete ? Infinity : 0,
                  ease: 'easeInOut',
                  yoyo: true,
                },
                rotate: {
                  duration: float.duration * 1.5,
                  delay: isComplete ? float.delay : point.delay + 0.3,
                  repeat: isComplete ? Infinity : 0,
                  ease: 'easeInOut',
                  yoyo: true,
                },
                color: {
                  duration: isComplete ? 3 : 0.5,
                  delay: isComplete ? float.delay : point.delay,
                  repeat: isComplete ? Infinity : 0,
                  ease: 'easeInOut',
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

      {/* Sparkle particles when complete */}
      <AnimatePresence>
        {isComplete && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const radius = 100 + Math.random() * 40
              const cx = Math.cos(angle) * radius
              const cy = Math.sin(angle) * radius
              
              return (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 3 + Math.random() * 3,
                    height: 3 + Math.random() * 3,
                    background: `rgba(255, ${100 + Math.random() * 100}, ${120 + Math.random() * 80}, ${0.5 + Math.random() * 0.5})`,
                    left: '50%',
                    top: '50%',
                    x: cx,
                    y: cy,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0],
                    y: [cy, cy - 15, cy - 30],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
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