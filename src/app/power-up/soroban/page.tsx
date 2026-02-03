'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, HelpCircle, Target, Trophy } from 'lucide-react'
import Soroban, { SorobanTutorial, SorobanChallenge } from '@/components/Soroban'
import { loadGameState, saveGameState, checkBadges, calculateLevel } from '@/lib/gameState'

type Mode = 'select' | 'tutorial' | 'practice' | 'challenge'

export default function SorobanPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('select')
  const [targetNumber, setTargetNumber] = useState<number | undefined>(undefined)

  const handleTutorialComplete = () => {
    // Update global state - mark soroban tutorial as completed
    let state = loadGameState()
    state.sorobanCompleted = true
    
    // Award some XP for completing tutorial
    const xpGained = 50
    state.totalPoints += xpGained
    state.xp += xpGained
    state.level = calculateLevel(state.xp)
    
    // Check badges
    const { state: stateWithBadges } = checkBadges(state)
    saveGameState(stateWithBadges)
    
    // Store XP for toast
    sessionStorage.setItem('pending-xp-toast', xpGained.toString())
    
    setMode('select')
  }

  const handleChallengeComplete = (score: number) => {
    if (score > 0) {
      // Update global state
      let state = loadGameState()
      state.totalPoints += score
      state.xp += score
      state.level = calculateLevel(state.xp)
      
      // Check badges
      const { state: stateWithBadges } = checkBadges(state)
      saveGameState(stateWithBadges)
      
      // Store XP for toast
      sessionStorage.setItem('pending-xp-toast', score.toString())
    }
    
    setMode('select')
  }

  const handleBackToDashboard = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-50">
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
              <span className="text-2xl">🧮</span>
              <span className="text-xl font-bold text-slate-800">Soroban</span>
            </div>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {mode === 'select' && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center">
              <div className="text-6xl mb-4">🧮</div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Soroban - Llogaritësi Japonez
              </h1>
              <p className="text-slate-600">
                Mëso të llogaritësh me mjetin e lashtë japonez!
              </p>
              <p className="text-sm text-indigo-600 mt-2 font-medium">
                ⭐ Pikët do të shtohen në XP-në tënde!
              </p>
            </div>

            {/* Mode selection */}
            <div className="grid gap-4 sm:grid-cols-3">
              <button
                onClick={() => setMode('tutorial')}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-orange-300"
              >
                <HelpCircle className="w-10 h-10 text-orange-500 mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Tutorial</h3>
                <p className="text-sm text-slate-600">
                  Mëso bazat e Sorobanit hap pas hapi
                </p>
                <p className="text-xs text-green-600 mt-2">+50 XP</p>
              </button>

              <button
                onClick={() => {
                  setTargetNumber(undefined)
                  setMode('practice')
                }}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-300"
              >
                <Target className="w-10 h-10 text-blue-500 mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Praktikë e Lirë</h3>
                <p className="text-sm text-slate-600">
                  Eksploro dhe praktiko pa presion
                </p>
              </button>

              <button
                onClick={() => setMode('challenge')}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-yellow-300"
              >
                <Trophy className="w-10 h-10 text-yellow-500 mb-3" />
                <h3 className="font-bold text-slate-800 mb-1">Sfidë</h3>
                <p className="text-sm text-slate-600">
                  Testo njohuritë me numra të rastësishëm
                </p>
                <p className="text-xs text-green-600 mt-2">+10 XP për çdo saktë</p>
              </button>
            </div>

            {/* Back to dashboard button */}
            <div className="text-center">
              <button
                onClick={handleBackToDashboard}
                className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors"
              >
                Kthehu te Faqja Kryesore
              </button>
            </div>

            {/* Info */}
            <div className="bg-white/60 rounded-2xl p-6">
              <h3 className="font-bold text-slate-800 mb-4">Si funksionon Sorobani?</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-red-600">5</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Rruaza e Sipërme (Kuqe)</h4>
                    <p className="text-sm text-slate-600">Vlen 5 kur aktivizohet (kliko për ta zbritur)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-amber-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Rruazat e Poshtme (Verdhë)</h4>
                    <p className="text-sm text-slate-600">Çdo rruazë vlen 1 kur aktivizohet (kliko për ta ngritur)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'tutorial' && (
          <div>
            <button
              onClick={() => setMode('select')}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Kthehu
            </button>
            <SorobanTutorial onComplete={handleTutorialComplete} />
          </div>
        )}

        {mode === 'practice' && (
          <div>
            <button
              onClick={() => setMode('select')}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Kthehu
            </button>
            <Soroban 
              columns={5} 
              targetNumber={targetNumber}
              mode="free"
            />
          </div>
        )}

        {mode === 'challenge' && (
          <div>
            <button
              onClick={() => setMode('select')}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Kthehu
            </button>
            <SorobanChallenge onComplete={handleChallengeComplete} />
          </div>
        )}
      </main>
    </div>
  )
}
