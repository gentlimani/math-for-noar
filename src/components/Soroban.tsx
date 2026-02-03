'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, HelpCircle, CheckCircle, ChevronRight } from 'lucide-react'

interface SorobanProps {
  columns?: number
  targetNumber?: number
  mode?: 'free' | 'tutorial' | 'challenge'
  onCorrect?: () => void
  onTargetChange?: (target: number) => void
}

interface ColumnState {
  heaven: boolean // Top bead (value 5)
  earth: number   // Bottom beads active (0-4, each = 1)
}

// Calculate value of a single column
function calculateColumnValue(col: ColumnState): number {
  return (col.heaven ? 5 : 0) + col.earth
}

// Calculate total value
function calculateTotal(columns: ColumnState[]): number {
  return columns.reduce((total, col, idx) => {
    const placeValue = Math.pow(10, columns.length - 1 - idx)
    return total + calculateColumnValue(col) * placeValue
  }, 0)
}

// Main Soroban Component - Smooth Toggle with CSS Transitions
export default function Soroban({
  columns = 5,
  targetNumber: externalTarget,
  mode = 'free',
  onCorrect,
  onTargetChange
}: SorobanProps) {
  const [state, setState] = useState<ColumnState[]>(
    Array(columns).fill(null).map(() => ({ heaven: false, earth: 0 }))
  )
  const [showTutorial, setShowTutorial] = useState(mode === 'tutorial')
  const [tutorialStep, setTutorialStep] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  // Local target for free mode quick practice
  const [localTarget, setLocalTarget] = useState<number | undefined>(undefined)
  
  // Use external target if provided, otherwise use local target
  const targetNumber = externalTarget !== undefined ? externalTarget : localTarget

  const currentValue = calculateTotal(state)

  // Check if target is reached
  useEffect(() => {
    if (targetNumber !== undefined && currentValue === targetNumber && !isCorrect) {
      setIsCorrect(true)
      onCorrect?.()
    }
  }, [currentValue, targetNumber, isCorrect, onCorrect])

  // Reset when target changes
  useEffect(() => {
    setState(Array(columns).fill(null).map(() => ({ heaven: false, earth: 0 })))
    setIsCorrect(false)
  }, [targetNumber, columns])

  // Tutorial steps
  const tutorialSteps = [
    { text: 'Mirësevjen në Soroban - llogaritësin japonez!' },
    { text: 'Rruaza e sipërme (e kuqe) vlen 5. Klikoje për ta aktivizuar!' },
    { text: 'Çdo rruazë poshtë (verdhë) vlen 1. Klikoji për t\'i aktivizuar!' },
    { text: 'Numri 7 = 5 (sipër) + 2 (poshtë). Provo ta bësh!' },
    { text: 'Shkëlqyeshëm! Tani di si funksionon Sorobani!' }
  ]

  // SIMPLE TOGGLE - Click to activate/deactivate
  const toggleHeaven = (colIndex: number) => {
    setState(prev => {
      const newState = [...prev]
      newState[colIndex] = {
        ...newState[colIndex],
        heaven: !newState[colIndex].heaven
      }
      return newState
    })
  }

  // SMOOTH TOGGLE - Click earth bead to toggle active state
  const toggleEarthBead = (colIndex: number, beadIndex: number) => {
    setState(prev => {
      const newState = [...prev]
      const currentEarth = newState[colIndex].earth
      
      // Simple toggle logic:
      // If clicking a bead that's active (index < currentEarth), deactivate from that point
      // If clicking a bead that's inactive (index >= currentEarth), activate up to that bead
      if (beadIndex < currentEarth) {
        // Deactivate: set earth to this bead's index (deactivate this and above)
        newState[colIndex] = {
          ...newState[colIndex],
          earth: beadIndex
        }
      } else {
        // Activate: set earth to include this bead
        newState[colIndex] = {
          ...newState[colIndex],
          earth: beadIndex + 1
        }
      }
      return newState
    })
  }

  // Reset
  const handleReset = () => {
    setState(Array(columns).fill(null).map(() => ({ heaven: false, earth: 0 })))
    setIsCorrect(false)
  }

  // Column labels
  const getColumnLabel = (idx: number): string => {
    const labels = ['Njësh', 'Dhjet', 'Qind', 'Mijë', '10Mij']
    const reverseIdx = columns - 1 - idx
    return labels[reverseIdx] || `×${Math.pow(10, reverseIdx)}`
  }

  return (
    <div className="soroban-wrapper bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <p className="text-xl font-bold text-slate-700 mb-6">
              {tutorialSteps[tutorialStep]?.text}
            </p>
            <div className="flex justify-center gap-4">
              {tutorialStep < tutorialSteps.length - 1 ? (
                <button
                  onClick={() => setTutorialStep(s => s + 1)}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold 
                           text-lg rounded-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  Vazhdo
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowTutorial(false)}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold 
                           text-lg rounded-xl hover:scale-105 transition-all"
                >
                  🎮 Fillo të luash
                </button>
              )}
            </div>
            
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {tutorialSteps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx < tutorialStep ? 'bg-green-500' : 
                    idx === tutorialStep ? 'bg-indigo-500 scale-125' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="text-3xl">🧮</span>
          Soroban
        </h3>
        
        {targetNumber !== undefined && (
          <div className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xl font-bold ${
            isCorrect ? 'bg-green-100 text-green-700 ring-4 ring-green-300' : 'bg-indigo-100 text-indigo-700'
          }`}>
            <span className="text-sm font-normal">Objektivi:</span>
            <span className="text-2xl">{targetNumber}</span>
            {isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
          </div>
        )}
      </div>

      {/* Instruction */}
      <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center">
        <p className="font-bold text-yellow-800">
          👆 Kliko rruazat për t'i aktivizuar/çaktivizuar! Rruaza e kuqe = 5, çdo verdhë = 1
        </p>
      </div>

      {/* Soroban Frame */}
      <div className="soroban-frame bg-gradient-to-b from-amber-600 to-amber-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        {/* Top decorative rail */}
        <div className="h-3 bg-amber-900 rounded-full mb-2" />
        
        {/* Columns */}
        <div className="flex justify-around gap-2 relative z-10">
          {state.map((col, colIdx) => (
            <div key={colIdx} className="soroban-col flex flex-col items-center w-14">
              {/* Heaven section (5 value) */}
              <div className="heaven-zone h-16 flex flex-col justify-end items-center relative mb-1">
                {/* Heaven bead */}
                <button
                  onClick={() => toggleHeaven(colIdx)}
                  className={`soroban-bead-new heaven transition-all duration-300 ease-out
                            ${col.heaven ? 'translate-y-4' : 'translate-y-0'}
                            hover:brightness-110 active:scale-95`}
                  aria-label={`Rruaza 5, kolona ${colIdx + 1}`}
                />
              </div>

              {/* Middle bar with value display */}
              <div className="w-full h-5 bg-amber-900 rounded-sm flex items-center justify-center relative z-20 shadow-inner">
                <span className="text-white text-xs font-bold">
                  {calculateColumnValue(col)}
                </span>
              </div>

              {/* Earth section (1 value each) */}
              <div className="earth-zone h-28 flex flex-col justify-start items-center pt-1 gap-0.5">
                {[0, 1, 2, 3].map(beadIdx => (
                  <button
                    key={beadIdx}
                    onClick={() => toggleEarthBead(colIdx, beadIdx)}
                    className={`soroban-bead-new earth transition-all duration-300 ease-out
                              ${beadIdx < col.earth ? '-translate-y-3' : 'translate-y-0'}
                              hover:brightness-110 active:scale-95`}
                    aria-label={`Rruaza ${beadIdx + 1}, kolona ${colIdx + 1}`}
                  />
                ))}
              </div>

              {/* Column label */}
              <div className="mt-2 text-xs font-bold text-amber-200">
                {getColumnLabel(colIdx)}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decorative rail */}
        <div className="h-3 bg-amber-900 rounded-full mt-2" />

        {/* Vertical rods (decorative) */}
        <div className="absolute inset-0 flex justify-around pointer-events-none" style={{ padding: '0.5rem 1rem' }}>
          {state.map((_, idx) => (
            <div key={idx} className="w-1 bg-amber-500/50 rounded-full" />
          ))}
        </div>
      </div>

      {/* Current value display */}
      <div className="mt-6 p-4 bg-slate-100 rounded-xl text-center">
        <span className="text-lg text-slate-600">Vlera aktuale:</span>
        <span className={`text-5xl font-bold ml-4 ${
          isCorrect ? 'text-green-600' : 'text-slate-800'
        }`}>
          {currentValue}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button 
          onClick={handleReset} 
          className="px-6 py-3 bg-slate-200 text-slate-700 font-bold text-lg rounded-xl 
                   hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Pastro
        </button>
        
        <button 
          onClick={() => setShowTutorial(true)} 
          className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold text-lg rounded-xl 
                   hover:bg-indigo-200 transition-all flex items-center gap-2"
        >
          <HelpCircle className="w-5 h-5" />
          Tutorial
        </button>
      </div>

      {/* Quick practice numbers */}
      {mode === 'free' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 mb-3">Provo këta numra:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[3, 7, 12, 25, 48, 99].map(num => (
              <button
                key={num}
                onClick={() => {
                  handleReset()
                  setLocalTarget(num)
                  onTargetChange?.(num)
                }}
                className={`px-4 py-2 rounded-xl font-mono font-bold 
                         hover:bg-indigo-100 transition-colors text-lg ${
                           localTarget === num 
                             ? 'bg-indigo-200 ring-2 ring-indigo-400' 
                             : 'bg-slate-100 hover:bg-slate-200'
                         }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Success message */}
      {isCorrect && (
        <div className="mt-6 p-4 bg-green-100 rounded-xl text-center border-2 border-green-300">
          <span className="text-3xl mr-3">🎉</span>
          <span className="text-xl font-bold text-green-700">
            Bravo! E paraqite saktë numrin {targetNumber}!
          </span>
        </div>
      )}
    </div>
  )
}

// Tutorial mode wrapper
export function SorobanTutorial({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0)
  const targets = [3, 7, 12, 25, 48]
  const [key, setKey] = useState(0)
  
  const handleCorrect = () => {
    setTimeout(() => {
      if (step < targets.length - 1) {
        setStep(s => s + 1)
        setKey(k => k + 1)
      } else {
        onComplete?.()
      }
    }, 1500)
  }
  
  return (
    <div className="soroban-tutorial">
      <div className="mb-4 p-4 bg-indigo-100 rounded-xl text-center">
        <h2 className="text-xl font-bold text-indigo-800">Mëso Sorobanin</h2>
        <p className="text-indigo-600 mt-2">
          Hapi {step + 1} / {targets.length}: Paraqit numrin <strong className="text-2xl">{targets[step]}</strong>
        </p>
      </div>
      
      <Soroban
        key={key}
        columns={3}
        targetNumber={targets[step]}
        mode="challenge"
        onCorrect={handleCorrect}
      />
      
      {/* Progress */}
      <div className="flex justify-center gap-2 mt-6">
        {targets.map((_, idx) => (
          <div 
            key={idx}
            className={`w-4 h-4 rounded-full transition-all ${
              idx < step ? 'bg-green-500' : idx === step ? 'bg-indigo-500 scale-125' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Challenge mode with scoring
export function SorobanChallenge({ onComplete }: { onComplete?: (score: number) => void }) {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [target, setTarget] = useState(Math.floor(Math.random() * 50) + 1)
  const [key, setKey] = useState(0)
  const maxRounds = 10

  const handleCorrect = () => {
    const newScore = score + 10
    setScore(newScore)
    
    if (round < maxRounds) {
      setTimeout(() => {
        setRound(r => r + 1)
        setTarget(Math.floor(Math.random() * (50 + round * 10)) + 1)
        setKey(k => k + 1)
      }, 1000)
    } else {
      setTimeout(() => {
        onComplete?.(newScore)
      }, 1000)
    }
  }

  return (
    <div className="soroban-challenge">
      <div className="flex justify-between items-center mb-4 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white">
        <span className="font-bold text-lg">Raundi {round}/{maxRounds}</span>
        <span className="font-bold text-lg">⭐ Pikë: {score}</span>
      </div>
      
      <Soroban
        key={key}
        columns={4}
        targetNumber={target}
        mode="challenge"
        onCorrect={handleCorrect}
      />
    </div>
  )
}
