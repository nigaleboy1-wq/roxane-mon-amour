'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Aurora gradient blobs that shift color and position based on scroll
const blobs = [
  {
    id: 'rose',
    baseX: 20, baseY: 15,
    width: 60, height: 60,
    color: 'rgba(180, 30, 70, 0.12)',
    scrollInfluence: { x: -15, y: 10 },
    colorStops: [
      { at: 0, color: 'rgba(200, 40, 80, 0.15)' },
      { at: 0.5, color: 'rgba(160, 20, 60, 0.08)' },
      { at: 1, color: 'rgba(140, 15, 50, 0)' },
    ],
  },
  {
    id: 'violet',
    baseX: 70, baseY: 60,
    width: 50, height: 50,
    color: 'rgba(120, 30, 140, 0.08)',
    scrollInfluence: { x: 12, y: -8 },
    colorStops: [
      { at: 0, color: 'rgba(140, 40, 160, 0.12)' },
      { at: 0.5, color: 'rgba(100, 25, 130, 0.06)' },
      { at: 1, color: 'rgba(80, 15, 110, 0)' },
    ],
  },
  {
    id: 'amber',
    baseX: 50, baseY: 85,
    width: 55, height: 45,
    color: 'rgba(200, 120, 50, 0.06)',
    scrollInfluence: { x: -8, y: -12 },
    colorStops: [
      { at: 0, color: 'rgba(200, 130, 60, 0.1)' },
      { at: 0.5, color: 'rgba(180, 100, 40, 0.05)' },
      { at: 1, color: 'rgba(160, 80, 30, 0)' },
    ],
  },
  {
    id: 'deep',
    baseX: 80, baseY: 25,
    width: 45, height: 55,
    color: 'rgba(80, 10, 100, 0.07)',
    scrollInfluence: { x: 10, y: 15 },
    colorStops: [
      { at: 0, color: 'rgba(100, 20, 130, 0.1)' },
      { at: 0.5, color: 'rgba(70, 10, 90, 0.05)' },
      { at: 1, color: 'rgba(50, 5, 70, 0)' },
    ],
  },
  {
    id: 'warm',
    baseX: 30, baseY: 50,
    width: 40, height: 40,
    color: 'rgba(220, 60, 80, 0.06)',
    scrollInfluence: { x: -5, y: -5 },
    colorStops: [
      { at: 0, color: 'rgba(240, 80, 100, 0.08)' },
      { at: 0.5, color: 'rgba(200, 50, 70, 0.04)' },
      { at: 1, color: 'rgba(180, 40, 60, 0)' },
    ],
  },
]

export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.92, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      {blobs.map((blob) => (
        <AuroraBlob key={blob.id} blob={blob} scrollProgress={scrollYProgress} />
      ))}

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
          mixBlendMode: 'overlay',
        }}
      />
    </motion.div>
  )
}

function AuroraBlob({
  blob,
  scrollProgress,
}: {
  blob: typeof blobs[0]
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const x = useTransform(
    scrollProgress,
    [0, 1],
    [blob.baseX, blob.baseX + blob.scrollInfluence.x]
  )
  const y = useTransform(
    scrollProgress,
    [0, 1],
    [blob.baseY, blob.baseY + blob.scrollInfluence.y]
  )

  const gradientStops = blob.colorStops
    .map((s) => `${s.color} ${s.at * 100}%`)
    .join(', ')

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: `${blob.width}vw`,
        height: `${blob.height}vh`,
        left: `${blob.baseX}vw`,
        top: `${blob.baseY}vh`,
        x,
        y,
        background: `radial-gradient(ellipse at center, ${gradientStops})`,
        filter: 'blur(80px)',
        willChange: 'transform',
      }}
      animate={{
        scale: [1, 1.08, 0.95, 1.03, 1],
        rotate: [0, 2, -1, 1.5, 0],
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1],
        delay: Math.random() * 5,
      }}
    />
  )
}