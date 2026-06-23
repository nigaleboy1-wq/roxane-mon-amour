'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const easeOut = [0.22, 1, 0.36, 1] as const

// Splits text into characters and reveals them with blur-to-sharp + fade
export default function TextReveal({
  text,
  as: Tag = 'h2',
  style,
  className = '',
  stagger = 0.03,
  delay = 0,
  perWord = false,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  style?: React.CSSProperties
  className?: string
  stagger?: number
  delay?: number
  perWord?: boolean  // if true, reveals word by word instead of char by char
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const units = perWord
    ? text.split(' ').map((word, i) => ({ text: word, key: i, isSpace: false }))
    : text.split('').map((char, i) => ({ text: char, key: i, isSpace: char === ' ' }))

  return (
    <Tag ref={ref} className={className} style={style}>
      {units.map((unit, i) =>
        unit.isSpace ? (
          <span key={unit.key}>&nbsp;</span>
        ) : (
          <motion.span
            key={unit.key}
            style={{
              display: 'inline-block',
              whiteSpace: perWord ? 'nowrap' : 'pre',
              willChange: 'opacity, filter, transform',
            }}
            initial={{
              opacity: 0.12,
              filter: 'blur(8px)',
              y: 10,
            }}
            animate={
              isInView
                ? { opacity: 1, filter: 'blur(0px)', y: 0 }
                : {}
            }
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: easeOut as unknown as number[],
            }}
          >
            {unit.text}
            {perWord && i < units.length - 1 ? '\u00A0' : ''}
          </motion.span>
        )
      )}
    </Tag>
  )
}