'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Sparkles } from 'lucide-react'

interface XPToastProps {
  xp: number
  onComplete?: () => void
}

export default function XPToast({ xp, onComplete }: XPToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsAnimating(false)
    }, 2500)

    // Remove component after animation
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 3000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Backdrop glow */}
      <div className={`absolute inset-0 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent 
                      transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Toast card */}
      <div className={`relative transform transition-all duration-500 ${
        isAnimating 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-50 opacity-0 -translate-y-20'
      }`}>
        {/* Floating sparkles */}
        <div className="absolute -inset-8">
          <Sparkles className="absolute top-0 left-0 w-6 h-6 text-yellow-400 animate-ping" />
          <Sparkles className="absolute top-0 right-0 w-5 h-5 text-yellow-500 animate-ping" style={{ animationDelay: '0.2s' }} />
          <Sparkles className="absolute bottom-0 left-4 w-4 h-4 text-orange-400 animate-ping" style={{ animationDelay: '0.4s' }} />
          <Sparkles className="absolute bottom-0 right-4 w-5 h-5 text-yellow-400 animate-ping" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Main toast */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl
                      border-4 border-yellow-300 min-w-[200px]">
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-3 bg-white/30 rounded-full flex items-center justify-center
                          animate-bounce">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            
            {/* XP amount */}
            <div className="text-5xl font-bold text-white mb-1 drop-shadow-lg">
              +{xp}
            </div>
            <div className="text-white/90 font-bold text-lg">
              XP
            </div>
          </div>
        </div>

        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                backgroundColor: ['#fbbf24', '#f97316', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'][i % 6],
                left: `${50 + (Math.random() - 0.5) * 100}%`,
                top: '50%',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Level Up specific toast
export function LevelUpToast({ newLevel, onComplete }: { newLevel: number; onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsAnimating(false), 3000)
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 3500)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`absolute inset-0 bg-gradient-radial from-purple-500/30 via-transparent to-transparent 
                      transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className={`transform transition-all duration-500 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 shadow-2xl
                      border-4 border-purple-300">
          <div className="text-center">
            <div className="text-6xl mb-3">🎉</div>
            <div className="text-white/80 font-bold text-lg mb-1">
              Nivel i Ri!
            </div>
            <div className="text-6xl font-bold text-white drop-shadow-lg">
              {newLevel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
