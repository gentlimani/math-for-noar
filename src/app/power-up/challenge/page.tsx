'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Timer, Zap, Brain, Flame } from 'lucide-react'
import SpeedMathGame from '@/components/SpeedMathGame'
import { loadGameState, saveGameState, updateSpeedMathScore, checkBadges } from '@/lib/gameState'

type Difficulty = 'easy' | 'medium' | 'hard'
type Duration = 30 | 60 | 90

export default function ChallengePage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [duration, setDuration] = useState<Duration>(60)
  const [operations, setOperations] = useState<('addition' | 'subtraction' | 'multiplication' | 'division')[]>(['addition', 'subtraction'])

  // Handle game completion - UPDATE GLOBAL STATE
  const handleComplete = (score: number, correct: number, streak: number) => {
    if (score > 0) {
      // Load current state
      let state = loadGameState()
      
      // Update speed math score (adds to totalPoints and XP)
      state = updateSpeedMathScore(state, score)
      
      // Check for new badges
      const { state: stateWithBadges } = checkBadges(state)
      
      // Save updated state
      saveGameState(stateWithBadges)
      
      // Store XP gained for toast notification on dashboard
      sessionStorage.setItem('pending-xp-toast', score.toString())
    }
  }

  const handleBackToDashboard = () => {
    router.push('/')
  }

  const toggleOperation = (op: 'addition' | 'subtraction' | 'multiplication' | 'division') => {
    setOperations(prev => {
      if (prev.includes(op)) {
        if (prev.length === 1) return prev // Must have at least one
        return prev.filter(o => o !== op)
      }
      return [...prev, op]
    })
  }

  if (started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50">
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setStarted(false)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Ndalo</span>
              </button>
              
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-bold text-slate-800">Sfida</span>
              </div>
              
              <div className="w-20" />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <SpeedMathGame
            duration={duration}
            difficulty={difficulty}
            operations={operations}
            onComplete={handleComplete}
          />
          
          {/* Back to Dashboard button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToDashboard}
              className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Kthehu te Faqja Kryesore
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/power-up" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Power Up</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold text-slate-800">Sfida e Shpejtësisë</span>
            </div>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero */}
          <div className="text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Sfida e Shpejtësisë
            </h1>
            <p className="text-slate-600">
              Sa probleme mund të zgjidhësh? Testo veten!
            </p>
            <p className="text-sm text-indigo-600 mt-2 font-medium">
              ⭐ Pikët do të shtohen në XP-në tënde!
            </p>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            {/* Duration */}
            <div>
              <label className="block font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                Kohëzgjatja
              </label>
              <div className="flex gap-3">
                {([30, 60, 90] as Duration[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      duration === d 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d} sek
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Vështirësia
              </label>
              <div className="flex gap-3">
                {([
                  { value: 'easy', label: 'I Lehtë', color: 'green' },
                  { value: 'medium', label: 'Mesatar', color: 'yellow' },
                  { value: 'hard', label: 'I Vështirë', color: 'red' },
                ] as const).map(d => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      difficulty === d.value 
                        ? `bg-${d.color}-500 text-white shadow-lg` 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    style={difficulty === d.value ? {
                      backgroundColor: d.color === 'green' ? '#22c55e' : d.color === 'yellow' ? '#eab308' : '#ef4444'
                    } : {}}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Operations */}
            <div>
              <label className="block font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Veprimet
              </label>
              <div className="flex flex-wrap gap-3">
                {([
                  { value: 'addition', label: 'Mbledhja', symbol: '+' },
                  { value: 'subtraction', label: 'Zbritja', symbol: '-' },
                  { value: 'multiplication', label: 'Shumëzimi', symbol: '×' },
                  { value: 'division', label: 'Pjesëtimi', symbol: '÷' },
                ] as const).map(op => (
                  <button
                    key={op.value}
                    onClick={() => toggleOperation(op.value)}
                    className={`py-2 px-4 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      operations.includes(op.value) 
                        ? 'bg-indigo-500 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-lg font-mono">{op.symbol}</span>
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Zap className="w-6 h-6" />
            Fillo Sfidën!
          </button>

          {/* Tips */}
          <div className="bg-white/60 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 mb-3">Këshilla</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex gap-2">
                <span>💡</span>
                <span>Seria (streak) jep pikë bonus - provo të mos gabosh!</span>
              </li>
              <li className="flex gap-2">
                <span>⏱️</span>
                <span>Sa më shpejt përgjigesh, aq më shumë pikë merr.</span>
              </li>
              <li className="flex gap-2">
                <span>🎯</span>
                <span>Fillo me vështirësi të ulët dhe ngrihu gradualisht.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
