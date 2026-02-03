'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Target, Shuffle, HelpCircle, Zap, Sparkles } from 'lucide-react'
import VisualMultiplication, { VisualMultiplicationPractice } from '@/components/VisualMultiplication'
import AdvancedStickMultiplication, { AdvancedStickPractice } from '@/components/AdvancedStickMultiplication'
import { loadGameState, saveGameState, checkBadges, calculateLevel } from '@/lib/gameState'

type Mode = 'select' | 'learn' | 'practice' | 'hard-learn' | 'hard-practice'

export default function SticksPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('select')
  const [num1, setNum1] = useState(3)
  const [num2, setNum2] = useState(4)
  const [hardNum1, setHardNum1] = useState(139)
  const [hardNum2, setHardNum2] = useState(15)

  const easyProblems: [number, number][] = [
    [2, 3],
    [3, 2],
    [2, 4],
    [4, 2],
    [3, 3],
  ]

  const randomize = () => {
    const a = Math.floor(Math.random() * 4) + 2 // 2-5
    const b = Math.floor(Math.random() * 4) + 2
    setNum1(a)
    setNum2(b)
  }

  // Handle learn completion - award XP for solving
  const handleLearnComplete = (correct: boolean) => {
    if (correct) {
      let state = loadGameState()
      const xpGained = 15
      state.totalPoints += xpGained
      state.xp += xpGained
      state.level = calculateLevel(state.xp)
      state.sticksCompleted = true
      
      const { state: stateWithBadges } = checkBadges(state)
      saveGameState(stateWithBadges)
    }
  }

  // Handle practice completion - integrate with global state
  const handlePracticeComplete = (score: number) => {
    if (score > 0) {
      let state = loadGameState()
      state.totalPoints += score
      state.xp += score
      state.level = calculateLevel(state.xp)
      state.sticksCompleted = true
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50">
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
              <span className="text-2xl">📐</span>
              <span className="text-xl font-bold text-slate-800">Shkopinjt</span>
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
              <div className="text-6xl mb-4">📐</div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Shumëzimi me Shkopinj
              </h1>
              <p className="text-slate-600 text-lg">
                Tërhiq dhe numëro - metoda kineze!
              </p>
              <p className="text-sm text-indigo-600 mt-2 font-medium">
                ⭐ Pikët do të shtohen në XP-në tënde!
              </p>
            </div>

            {/* Mode selection - Easy */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Modaliteti i Lehtë (numra të vegjël)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setMode('learn')}
                  className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-blue-300"
                >
                  <Play className="w-12 h-12 text-blue-500 mb-3" />
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Mëso</h3>
                  <p className="text-slate-600">
                    Shiko si funksionon metoda hap pas hapi
                  </p>
                  <p className="text-xs text-green-600 mt-2">+15 XP për çdo zgjidhje</p>
                </button>

                <button
                  onClick={() => setMode('practice')}
                  className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-transparent hover:border-green-300"
                >
                  <Target className="w-12 h-12 text-green-500 mb-3" />
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Praktikë</h3>
                  <p className="text-slate-600">
                    Zgjidh probleme të rastësishme
                  </p>
                  <p className="text-xs text-green-600 mt-2">+20 XP për çdo saktë</p>
                </button>
              </div>
            </div>

            {/* Mode selection - Hard */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Modaliteti i Vështirë (139 × 15)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => setMode('hard-learn')}
                  className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-yellow-200 hover:border-yellow-400"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Mëso Modalitetin e Vështirë</h3>
                  <p className="text-slate-600">
                    Shumëzime të mëdha: 3-shifra × 2-shifra me ngjyra
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    <strong>Gjelbër</strong>=Qindëshe, <strong>Kuqe</strong>=Dhjetëshe, <strong>Blu</strong>=Njëshe
                  </p>
                </button>

                <button
                  onClick={() => setMode('hard-practice')}
                  className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left border-2 border-amber-200 hover:border-amber-400"
                >
                  <Target className="w-12 h-12 text-amber-500 mb-3" />
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Praktikë e Vështirë</h3>
                  <p className="text-slate-600">
                    Zgjidh probleme si 139 × 15, 234 × 11
                  </p>
                  <p className="text-xs text-amber-600 mt-2">+25 XP për çdo saktë</p>
                </button>
              </div>
            </div>

            {/* Quick demos */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Provo shpejt</h3>
              <div className="flex flex-wrap gap-3">
                {easyProblems.map(([a, b], idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNum1(a)
                      setNum2(b)
                      setMode('learn')
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl 
                             shadow hover:shadow-md transition-all font-mono text-xl font-bold
                             hover:scale-105 border-2 border-blue-200"
                  >
                    {a} × {b}
                  </button>
                ))}
              </div>
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

            {/* How it works */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                Si funksionon?
              </h3>
              <ol className="space-y-4 text-slate-600">
                <li className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-lg">1</span>
                  <div>
                    <strong className="text-red-600">Tërhiq shkopinj të kuq</strong> - për numrin e parë
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-lg">2</span>
                  <div>
                    <strong className="text-blue-600">Tërhiq shkopinj blu</strong> - për numrin e dytë
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-lg">3</span>
                  <div>
                    <strong className="text-green-600">Kliko kryqëzimet</strong> - numri i kryqëzimeve = produkti!
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}

        {mode === 'learn' && (
          <div>
            <button
              onClick={() => setMode('select')}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Kthehu
            </button>
            
            {/* Number selector */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div>
                  <label className="block text-sm text-slate-600 mb-1 font-bold">Numri 1</label>
                  <input
                    type="number"
                    value={num1}
                    onChange={(e) => setNum1(Math.max(2, Math.min(5, parseInt(e.target.value) || 2)))}
                    className="w-20 px-4 py-3 text-2xl text-center font-bold border-4 border-slate-200 rounded-xl focus:border-blue-400 outline-none"
                    min={2}
                    max={5}
                  />
                </div>
                <span className="text-4xl text-slate-400 mt-6">×</span>
                <div>
                  <label className="block text-sm text-slate-600 mb-1 font-bold">Numri 2</label>
                  <input
                    type="number"
                    value={num2}
                    onChange={(e) => setNum2(Math.max(2, Math.min(5, parseInt(e.target.value) || 2)))}
                    className="w-20 px-4 py-3 text-2xl text-center font-bold border-4 border-slate-200 rounded-xl focus:border-blue-400 outline-none"
                    min={2}
                    max={5}
                  />
                </div>
                <button
                  onClick={randomize}
                  className="mt-6 p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                  title="Numra të rastësishëm"
                >
                  <Shuffle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <VisualMultiplication 
              key={`${num1}-${num2}`} 
              num1={num1} 
              num2={num2}
              onComplete={handleLearnComplete}
            />
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
            <VisualMultiplicationPractice onComplete={handlePracticeComplete} />
          </div>
        )}

        {mode === 'hard-learn' && (
          <div>
            <button
              onClick={() => setMode('select')}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Kthehu
            </button>
            
            {/* Hard mode number selector */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div>
                  <label className="block text-sm text-slate-600 mb-1 font-bold">Numri 1 (3-shifra)</label>
                  <input
                    type="number"
                    value={hardNum1}
                    onChange={(e) => setHardNum1(Math.max(100, Math.min(999, parseInt(e.target.value) || 100)))}
                    className="w-24 px-4 py-3 text-2xl text-center font-bold border-4 border-green-200 rounded-xl focus:border-green-400 outline-none"
                    min={100}
                    max={999}
                  />
                </div>
                <span className="text-4xl text-slate-400 mt-6">×</span>
                <div>
                  <label className="block text-sm text-slate-600 mb-1 font-bold">Numri 2 (2-shifra)</label>
                  <input
                    type="number"
                    value={hardNum2}
                    onChange={(e) => setHardNum2(Math.max(10, Math.min(99, parseInt(e.target.value) || 10)))}
                    className="w-20 px-4 py-3 text-2xl text-center font-bold border-4 border-blue-200 rounded-xl focus:border-blue-400 outline-none"
                    min={10}
                    max={99}
                  />
                </div>
                <button
                  onClick={() => {
                    setHardNum1(Math.floor(Math.random() * 400) + 100) // 100-499
                    setHardNum2(Math.floor(Math.random() * 15) + 10) // 10-24
                  }}
                  className="mt-6 p-3 bg-yellow-100 rounded-xl hover:bg-yellow-200 transition-colors"
                  title="Numra të rastësishëm"
                >
                  <Shuffle className="w-6 h-6 text-yellow-600" />
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>Modaliteti i vështirë:</strong> Mëso të shumëzosh numra të mëdhenj me ngjyra të kodifikuara
                </p>
              </div>
            </div>
            
            <AdvancedStickMultiplication 
              key={`hard-${hardNum1}-${hardNum2}`} 
              num1={hardNum1} 
              num2={hardNum2}
              onComplete={() => handleLearnComplete(true)}
              hardMode={true}
            />
          </div>
        )}

        {mode === 'hard-practice' && (
          <div>
            <button
              onClick={() => setMode('select')}
              className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Kthehu
            </button>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl border-2 border-yellow-300">
              <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Praktikë me numra të mëdhenj
              </h3>
              <p className="text-yellow-700 text-sm mt-1">
                Zgjidh 5 problema shumëzimi me 3-shifra × 2-shifra. Përdor ngjyrat për të grupuar vijat!
              </p>
            </div>
            
            <AdvancedStickPractice 
              onComplete={(score) => {
                if (score > 0) {
                  let state = loadGameState()
                  state.totalPoints += score
                  state.xp += score
                  state.level = calculateLevel(state.xp)
                  state.sticksCompleted = true
                  
                  const { state: stateWithBadges } = checkBadges(state)
                  saveGameState(stateWithBadges)
                  
                  sessionStorage.setItem('pending-xp-toast', score.toString())
                }
                setMode('select')
              }} 
            />
          </div>
        )}
      </main>
    </div>
  )
}
