'use client'

import { motion } from 'framer-motion'
import HeartWords from '@/components/HeartWords'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a0a0e 0%, #2d0a1a 30%, #1a0510 60%, #0d0a1a 100%)',
      }}
    >
      {/* Subtle floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`bg-particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(255, ${80 + Math.random() * 80}, ${100 + Math.random() * 60}, ${0.1 + Math.random() * 0.2})`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-8 px-4 py-12">
        
        {/* The heart made of "je t'aime" words */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <HeartWords />
        </motion.div>

        {/* Romantic phrase below the heart */}
        <motion.div
          className="text-center max-w-lg"
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
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Tu es mon seul et unique amour
          </motion.p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 4.2, ease: 'easeOut' }}
            className="mt-4 mx-auto"
            style={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255, 100, 120, 0.6), transparent)',
            }}
          />
          
          <motion.p
            className="mt-4 text-sm md:text-base italic"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: 'rgba(255, 180, 190, 0.6)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4.8 }}
          >
            pour toujours et à jamais...
          </motion.p>
        </motion.div>
      </main>

      {/* Subtle vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10, 5, 8, 0.6) 100%)',
        }}
      />
    </div>
  )
}