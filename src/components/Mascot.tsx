'use client'

import { useState, useEffect } from 'react'

interface MascotProps {
  message?: string
  mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'sad'
  size?: 'sm' | 'md' | 'lg'
  showBubble?: boolean
}

export default function Mascot({ 
  message, 
  mood = 'happy', 
  size = 'md',
  showBubble = true 
}: MascotProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (mood === 'celebrating') {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [mood])

  const sizeClasses = {
    sm: 'w-16 h-16 text-3xl',
    md: 'w-24 h-24 text-5xl',
    lg: 'w-32 h-32 text-6xl',
  }

  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy': return '🦉'
      case 'thinking': return '🤔'
      case 'celebrating': return '🎉'
      case 'encouraging': return '💪'
      case 'sad': return '😢'
      default: return '🦉'
    }
  }

  const getEyes = () => {
    switch (mood) {
      case 'happy': return '◠‿◠'
      case 'thinking': return '◔_◔'
      case 'celebrating': return '★‿★'
      case 'encouraging': return '◉‿◉'
      case 'sad': return 'T_T'
      default: return '◠‿◠'
    }
  }

  return (
    <div className="flex items-end gap-3">
      {/* Mascot character */}
      <div 
        className={`relative ${sizeClasses[size]} ${
          isAnimating ? 'animate-celebrate' : 'animate-float'
        }`}
      >
        {/* Owl body */}
        <div className="relative">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Body */}
            <ellipse cx="50" cy="60" rx="35" ry="35" fill="#8B5CF6" />
            
            {/* Belly */}
            <ellipse cx="50" cy="65" rx="25" ry="25" fill="#C4B5FD" />
            
            {/* Head feathers (ears) */}
            <polygon points="25,25 35,40 25,40" fill="#7C3AED" />
            <polygon points="75,25 65,40 75,40" fill="#7C3AED" />
            
            {/* Eyes */}
            <circle cx="38" cy="45" r="12" fill="white" />
            <circle cx="62" cy="45" r="12" fill="white" />
            
            {/* Pupils */}
            <circle 
              cx={mood === 'thinking' ? '40' : '38'} 
              cy="45" 
              r="6" 
              fill="#1e293b"
              className={mood === 'celebrating' ? 'animate-bounce' : ''}
            />
            <circle 
              cx={mood === 'thinking' ? '64' : '62'} 
              cy="45" 
              r="6" 
              fill="#1e293b"
              className={mood === 'celebrating' ? 'animate-bounce' : ''}
            />
            
            {/* Eye sparkles */}
            <circle cx="36" cy="43" r="2" fill="white" />
            <circle cx="60" cy="43" r="2" fill="white" />
            
            {/* Beak */}
            <polygon points="50,52 45,60 55,60" fill="#F59E0B" />
            
            {/* Blush */}
            {(mood === 'happy' || mood === 'celebrating') && (
              <>
                <ellipse cx="28" cy="55" rx="5" ry="3" fill="#FDA4AF" opacity="0.6" />
                <ellipse cx="72" cy="55" rx="5" ry="3" fill="#FDA4AF" opacity="0.6" />
              </>
            )}
            
            {/* Wings */}
            <ellipse cx="18" cy="60" rx="8" ry="20" fill="#7C3AED" />
            <ellipse cx="82" cy="60" rx="8" ry="20" fill="#7C3AED" />
            
            {/* Feet */}
            <ellipse cx="40" cy="92" rx="8" ry="5" fill="#F59E0B" />
            <ellipse cx="60" cy="92" rx="8" ry="5" fill="#F59E0B" />
            
            {/* Graduation cap for learning */}
            <rect x="30" y="15" width="40" height="5" fill="#1e293b" />
            <polygon points="50,5 30,15 70,15" fill="#1e293b" />
            <circle cx="70" cy="15" r="2" fill="#F59E0B" />
            <line x1="70" y1="15" x2="75" y2="25" stroke="#F59E0B" strokeWidth="2" />
          </svg>
          
          {/* Celebration effects */}
          {mood === 'celebrating' && (
            <>
              <span className="absolute -top-2 -left-2 text-2xl animate-bounce">⭐</span>
              <span className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>🌟</span>
              <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
            </>
          )}
        </div>
      </div>

      {/* Speech bubble */}
      {showBubble && message && (
        <div className="speech-bubble max-w-xs animate-hint-reveal">
          <p className="text-slate-700 font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}

// Quick mascot reactions
export function MascotReaction({ type }: { type: 'correct' | 'incorrect' | 'hint' | 'streak' }) {
  const reactions = {
    correct: { mood: 'celebrating' as const, messages: ['Bravo! 🎉', 'Saktë! 💪', 'Shkëlqyeshëm! ⭐'] },
    incorrect: { mood: 'encouraging' as const, messages: ['Provo përsëri!', 'Ti mundesh!', 'Mos u dorëzo!'] },
    hint: { mood: 'thinking' as const, messages: ['Hmm, le të mendojmë...', 'Ja një ndihmë!'] },
    streak: { mood: 'celebrating' as const, messages: ['Seria vazhdon! 🔥', 'Je i pabesueshëm!'] },
  }

  const reaction = reactions[type]
  const message = reaction.messages[Math.floor(Math.random() * reaction.messages.length)]

  return <Mascot mood={reaction.mood} message={message} size="sm" />
}
