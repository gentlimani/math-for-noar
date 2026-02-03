'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react'

interface DragFillQuestionProps {
  equation: string // e.g., "5 + [BLANK] = 12"
  options: number[]
  correctAnswer: number
  hints: string[]
  onAnswer: (correct: boolean, hintsUsed: number) => void
  showResult: boolean
  isCorrect: boolean
}

export default function DragFillQuestion({
  equation,
  options,
  correctAnswer,
  hints,
  onAnswer,
  showResult,
  isCorrect,
}: DragFillQuestionProps) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)

  // Reset state when equation changes (new question)
  useEffect(() => {
    setSelectedValue(null)
    setHintsRevealed(0)
  }, [equation])

  // Parse equation to show with blank
  const renderEquation = () => {
    const parts = equation.split('[BLANK]')
    return (
      <div className="flex items-center justify-center gap-2 text-4xl font-bold flex-wrap">
        <span>{parts[0]}</span>
        <div 
          className={`min-w-[80px] h-16 border-4 border-dashed rounded-xl flex items-center justify-center transition-all ${
            selectedValue !== null 
              ? showResult 
                ? isCorrect 
                  ? 'border-green-500 bg-green-100' 
                  : 'border-red-500 bg-red-100'
                : 'border-indigo-500 bg-indigo-100'
              : 'border-slate-300 bg-slate-50'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (showResult) return
            const value = parseInt(e.dataTransfer.getData('text/plain'))
            setSelectedValue(value)
          }}
          onClick={() => {
            if (!showResult && selectedValue !== null) {
              setSelectedValue(null)
            }
          }}
        >
          {selectedValue !== null ? (
            <span className={`${isCorrect && showResult ? 'text-green-700' : !isCorrect && showResult ? 'text-red-700' : 'text-indigo-700'}`}>
              {selectedValue}
            </span>
          ) : (
            <span className="text-slate-400 text-2xl">?</span>
          )}
        </div>
        <span>{parts[1]}</span>
      </div>
    )
  }

  const handleCheck = () => {
    if (selectedValue === null) return
    const correct = selectedValue === correctAnswer
    onAnswer(correct, hintsRevealed)
  }

  const handleReset = () => {
    setSelectedValue(null)
  }

  return (
    <div className="space-y-6">
      {/* Equation with blank */}
      <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
        {renderEquation()}
      </div>

      {/* Draggable options */}
      <div className="flex flex-wrap justify-center gap-4">
        {options.map((option, i) => (
          <div
            key={i}
            draggable={!showResult && selectedValue !== option}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', option.toString())
            }}
            onClick={() => {
              if (!showResult && selectedValue === null) {
                setSelectedValue(option)
              }
            }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold cursor-grab active:cursor-grabbing transition-all ${
              selectedValue === option
                ? 'opacity-40 scale-90'
                : showResult
                  ? 'opacity-50'
                  : 'bg-white border-4 border-slate-200 hover:border-indigo-400 hover:scale-105 shadow-lg'
            }`}
          >
            {option}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {!showResult && selectedValue === null && (
        <p className="text-center text-slate-500 text-sm">
          Tërhiq ose kliko numrin e saktë në kutinë bosh
        </p>
      )}

      {/* Hints */}
      {hintsRevealed > 0 && !showResult && (
        <div className="space-y-2">
          {hints.slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl animate-hint-reveal">
              <span className="text-yellow-800">💡 {hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className={`p-4 rounded-2xl text-center font-bold text-xl flex items-center justify-center gap-2 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isCorrect ? (
            <>
              <CheckCircle className="w-6 h-6" />
              Saktë! Bravo! 🎉
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6" />
              Përgjigja e saktë: {correctAnswer}
            </>
          )}
        </div>
      )}

      {/* Action buttons */}
      {!showResult && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleReset}
            disabled={selectedValue === null}
            className="btn-secondary-fun flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-5 h-5" />
            Pastro
          </button>

          {hintsRevealed < hints.length && (
            <button
              onClick={() => setHintsRevealed(h => h + 1)}
              className="btn-secondary-fun flex items-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Ndihmë ({hints.length - hintsRevealed})
            </button>
          )}

          <button
            onClick={handleCheck}
            disabled={selectedValue === null}
            className="btn-fun disabled:opacity-50"
          >
            Kontrollo
          </button>
        </div>
      )}
    </div>
  )
}
