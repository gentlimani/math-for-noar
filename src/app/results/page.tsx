'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { al } from '@/lib/i18n'
import { loadGameState, GameState, MASTERY_THRESHOLD } from '@/lib/gameState'
import { getTopicById } from '@/data/questions'
import Mascot from '@/components/Mascot'
import { Star, Trophy, Flame, Home, RotateCcw, ChevronRight, BookOpen, Sparkles } from 'lucide-react'

function ResultsContent() {
  const searchParams = useSearchParams()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const topicId = searchParams.get('topic') || ''
  const correct = parseInt(searchParams.get('correct') || '0')
  const total = parseInt(searchParams.get('total') || '10')
  const points = parseInt(searchParams.get('points') || '0')

  const topic = getTopicById(topicId)
  const percentage = Math.round((correct / total) * 100)
  const isMastery = percentage >= MASTERY_THRESHOLD
  const isPerfect = percentage === 100

  useEffect(() => {
    setGameState(loadGameState())
    if (percentage >= 80) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    }
  }, [percentage])

  // Determine message and mood based on score
  const getResult = () => {
    if (isPerfect) return { 
      text: 'PERFEKT! 🌟', 
      subtext: 'Asnjë gabim! Je i mrekullueshëm!',
      mood: 'celebrating' as const,
      emoji: '🏆',
      bgClass: 'from-yellow-400 via-orange-400 to-pink-400'
    }
    if (percentage >= 80) return { 
      text: 'Shkëlqyeshëm!', 
      subtext: 'Ke arritur zotërimin!',
      mood: 'celebrating' as const,
      emoji: '🎉',
      bgClass: 'from-green-400 to-emerald-500'
    }
    if (percentage >= 60) return { 
      text: 'Mirë!', 
      subtext: 'Vazhdo të praktikosh!',
      mood: 'happy' as const,
      emoji: '💪',
      bgClass: 'from-blue-400 to-indigo-500'
    }
    return { 
      text: 'Vazhdo!', 
      subtext: 'Çdo gabim është mësim!',
      mood: 'encouraging' as const,
      emoji: '📚',
      bgClass: 'from-purple-400 to-violet-500'
    }
  }

  const result = getResult()

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-fun-gradient">
        <div className="text-6xl animate-bounce">🦉</div>
      </div>
    )
  }

  const topicProgress = gameState.topicProgress[topicId]

  return (
    <div className="min-h-screen bg-fun-gradient flex items-center justify-center p-4">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#6366f1', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg w-full">
        {/* Main result card */}
        <div className="card-fun text-center mb-6 relative overflow-hidden">
          {/* Background decoration */}
          {isPerfect && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-6xl">⭐</div>
              <div className="absolute top-4 right-4 text-6xl">🌟</div>
              <div className="absolute bottom-4 left-4 text-6xl">✨</div>
              <div className="absolute bottom-4 right-4 text-6xl">💫</div>
            </div>
          )}

          {/* Result emoji */}
          <div className="text-7xl mb-4 animate-bounce-fun">{result.emoji}</div>
          
          {/* Score display */}
          <div className={`inline-block px-8 py-4 rounded-2xl bg-gradient-to-r ${result.bgClass} text-white mb-4`}>
            <div className="text-6xl font-bold">{percentage}%</div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{result.text}</h1>
          <p className="text-lg text-slate-600 mb-4">{result.subtext}</p>
          
          <p className="text-slate-500">
            {correct} nga {total} të sakta
          </p>

          {/* Points earned */}
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-yellow-100 rounded-full">
            <Star className="w-7 h-7 text-yellow-500 fill-current animate-star-spin" />
            <span className="text-2xl font-bold text-yellow-700">+{points}</span>
            <span className="text-yellow-600">{al.points}</span>
          </div>
        </div>

        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <Mascot 
            mood={result.mood} 
            message={isPerfect ? "WOW! Je mjeshtër!" : isMastery ? "Bravo! Tani hape temën tjetër!" : "Praktiko më shumë!"}
            size="md"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-fun text-center !p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{gameState.totalPoints}</div>
            <div className="text-sm text-slate-500">Pikë Gjithsej</div>
          </div>

          <div className="card-fun text-center !p-4">
            <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center ${
              gameState.currentStreak > 0 ? 'animate-pulse-glow' : ''
            }`}>
              <Flame className="w-7 h-7 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{gameState.bestStreak}</div>
            <div className="text-sm text-slate-500">{al.bestStreak}</div>
          </div>
        </div>

        {/* Topic Mastery */}
        {topic && topicProgress && (
          <div className="card-fun mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{topic.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{topic.titleAl}</h3>
                <p className="text-sm text-slate-500">{al.mastery}</p>
              </div>
              {topicProgress.mastery >= MASTERY_THRESHOLD && (
                <Sparkles className="w-8 h-8 text-yellow-500 animate-star-spin" />
              )}
            </div>

            <div className="h-5 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full progress-fill rounded-full ${
                  topicProgress.mastery >= MASTERY_THRESHOLD 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                style={{ width: `${topicProgress.mastery}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-700">{topicProgress.mastery}%</span>
              <span className="text-slate-500">
                {topicProgress.mastery >= MASTERY_THRESHOLD 
                  ? '✅ E zotëruar!' 
                  : `${MASTERY_THRESHOLD - topicProgress.mastery}% deri në zotërim`
                }
              </span>
            </div>
          </div>
        )}

        {/* Mastery achieved celebration */}
        {isMastery && topicProgress && topicProgress.mastery >= MASTERY_THRESHOLD && (
          <div className="card-fun !bg-gradient-to-r !from-green-400 !to-emerald-500 text-white text-center mb-6">
            <div className="text-3xl mb-2">🎊🏆🎊</div>
            <p className="font-bold text-lg">Urime! Ke zotëruar {topic?.titleAl}!</p>
            <p className="text-green-100 mt-1">Tema tjetër është hapur!</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href={`/quiz/${topicId}`}
            className="btn-fun w-full flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            {al.playAgain}
          </Link>

          <Link 
            href={`/learn/${topicId}`}
            className="btn-secondary-fun w-full flex items-center justify-center gap-3"
          >
            <BookOpen className="w-5 h-5" />
            Shiko Mësimin
          </Link>

          <Link 
            href="/"
            className="block text-center py-3 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Home className="w-5 h-5 inline mr-2" />
            {al.backToTopics}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-fun-gradient">
        <div className="text-6xl animate-bounce">🦉</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
