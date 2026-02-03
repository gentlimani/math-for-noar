'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Trophy, RotateCcw, ChevronRight, Sparkles } from 'lucide-react'
import MagicSquare from '@/components/MagicSquare'
import { getMagicSquareQuestions, MagicSquareQuestion } from '@/data/quizDataLoader'
import { loadGameState, saveGameState, GameState } from '@/lib/gameState'

export default function MagicSquaresPage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [puzzles, setPuzzles] = useState<MagicSquareQuestion[]>([])
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [showComplete, setShowComplete] = useState(false)

  // Load game state and puzzles
  useEffect(() => {
    const state = loadGameState()
    setGameState(state)
    
    // Load 5 magic square puzzles
    const loadedPuzzles = getMagicSquareQuestions(5)
    setPuzzles(loadedPuzzles)
  }, [])

  // Handle puzzle completion
  const handleComplete = (correct: boolean, attempts: number) => {
    if (!gameState) return

    if (correct) {
      // Calculate score based on attempts
      const baseScore = 25
      const attemptPenalty = Math.max(0, (attempts - 1) * 5)
      const score = Math.max(10, baseScore - attemptPenalty)
      
      setTotalScore(prev => prev + score)
      setCompletedPuzzles(prev => [...prev, currentPuzzle])
      
      // Update game state
      const newState: GameState = {
        ...gameState,
        totalPoints: gameState.totalPoints + score,
        xp: gameState.xp + score,
      }
      
      setGameState(newState)
      saveGameState(newState)
    }
  }

  // Move to next puzzle
  const handleNext = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(prev => prev + 1)
    } else {
      setShowComplete(true)
    }
  }

  // Reset all puzzles
  const handleRestart = () => {
    const newPuzzles = getMagicSquareQuestions(5)
    setPuzzles(newPuzzles)
    setCurrentPuzzle(0)
    setCompletedPuzzles([])
    setTotalScore(0)
    setShowComplete(false)
  }

  if (!gameState || puzzles.length === 0) {
    return (
      <div className="min-h-screen bg-fun-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔲</div>
          <div className="text-2xl text-slate-600 font-medium">Duke ngarkuar...</div>
        </div>
      </div>
    )
  }

  const currentPuzzleData = puzzles[currentPuzzle]
  const isPuzzleComplete = completedPuzzles.includes(currentPuzzle)

  return (
    <div className="min-h-screen bg-fun-gradient">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href="/power-up" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Kthehu</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-3xl">🔲</span>
              <span className="text-lg font-bold text-slate-800">Katrorët Magjikë</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-bold text-yellow-700">{gameState.totalPoints}</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Enigma {currentPuzzle + 1} / {puzzles.length}</span>
              <span className="text-green-600 font-medium">
                <Trophy className="w-4 h-4 inline mr-1" />
                {completedPuzzles.length} të zgjidhura
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 progress-fill rounded-full transition-all duration-500"
                style={{ width: `${((currentPuzzle + 1) / puzzles.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {showComplete ? (
          /* Completion Screen */
          <div className="card-fun text-center py-12">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Bravo! Të gjitha enigmat u zgjidhën!
            </h2>
            
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">{completedPuzzles.length}</div>
                <div className="text-slate-500">Zgjidhje</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600">{totalScore}</div>
                <div className="text-slate-500">Pikë</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRestart}
                className="btn-secondary-fun flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Luaj përsëri
              </button>
              <Link href="/power-up" className="btn-fun flex items-center gap-2">
                Vazhdo
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Puzzle */
          <div className="space-y-6">
            {/* Info Card */}
            <div className="card-fun bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-800 mb-1">Si të luash?</h3>
                  <p className="text-indigo-700 text-sm">
                    Plotëso qelizat bosh ashtu që shuma e çdo rreshti dhe kolone 
                    të jetë e njëjtë me numrin e synuar. Kur rreshti është i saktë, 
                    do të ndriçohet me ngjyrë të gjelbër!
                  </p>
                </div>
              </div>
            </div>

            {/* Magic Square Component */}
            <MagicSquare
              key={currentPuzzleData.id}
              id={currentPuzzleData.id}
              questionText={currentPuzzleData.questionAl}
              config={currentPuzzleData.config}
              hints={currentPuzzleData.hints}
              onComplete={handleComplete}
              showHints={true}
            />

            {/* Next button (shows after completion) */}
            {isPuzzleComplete && (
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="btn-success flex items-center gap-2 animate-bounce-fun"
                >
                  {currentPuzzle < puzzles.length - 1 ? 'Enigma tjetër' : 'Përfundo'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Session Score */}
            {totalScore > 0 && (
              <div className="text-center text-slate-600">
                <span className="font-medium">Pikë në këtë seancë:</span>
                <span className="ml-2 text-lg font-bold text-indigo-600">{totalScore}</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
