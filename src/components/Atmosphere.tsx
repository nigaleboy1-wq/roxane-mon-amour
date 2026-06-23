'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

const easeSmooth = [0.45, 0, 0.55, 1] as const

// 3D-depth star particles that respond to mouse parallax
export default function Atmosphere() {
  const layers = useMemo(() => [
    { count: 25, sizeMin: 0.6, sizeMax: 1.2, opacityMin: 0.08, opacityMax: 0.2, speed: 25, parallaxFactor: 0.01 },
    { count: 15, sizeMin: 1, sizeMax: 2, opacityMin: 0.12, opacityMax: 0.3, speed: 35, parallaxFactor: 0.02 },
    { count: 8, sizeMin: 1.5, sizeMax: 3, opacityMin: 0.05, opacityMax: 0.15, speed: 45, parallaxFactor: 0.035 },
  ], [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {layers.map((layer, li) =>
        Array.from({ length: layer.count }, (_, i) => {
          const size = layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin)
          const baseOpacity = layer.opacityMin + Math.random() * (layer.opacityMax - layer.opacityMin)
          const twinkleSpeed = 3 + Math.random() * 5
          const twinkleDelay = Math.random() * 6

          return (
            <motion.div
              key={`${li}-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: size,
                height: size,
                background: `rgba(255, ${180 + Math.random() * 75}, ${200 + Math.random() * 55})`,
                boxShadow: size > 2 ? `0 0 ${size * 3}px rgba(255, 120, 150, 0.15)` : 'none',
                willChange: 'opacity, transform',
              }}
              animate={{
                opacity: [baseOpacity * 0.5, baseOpacity, baseOpacity * 0.7, baseOpacity, baseOpacity * 0.5],
                scale: [1, 1.2, 1, 1.1, 1],
              }}
              transition={{
                duration: twinkleSpeed,
                repeat: Infinity,
                ease: easeSmooth as unknown as number[],
                delay: twinkleDelay,
              }}
            />
          )
        })
      )}
    </div>
  )
}