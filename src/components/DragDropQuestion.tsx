'use client'

import { useState, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

// Types for different drag-drop question formats
export interface DragFillBlankQuestion {
  type: 'drag_fill_blank'
  id: string
  questionAl: string
  equation: string // e.g., "15 + [___] = 23"
  blanks: string[] // IDs of blanks
  options: number[]
  correctAnswers: Record<string, number> // blank ID -> correct value
  hints: string[]
}

export interface DragMatchQuestion {
  type: 'drag_match'
  id: string
  questionAl: string
  pairs: { left: string; right: number }[]
  hints: string[]
}

export interface DragBuildQuestion {
  type: 'drag_build'
  id: string
  questionAl: string
  story: string
  parts: (string | number)[] // Available pieces
  correctOrder: (string | number)[]
  hints: string[]
}

type DragQuestion = DragFillBlankQuestion | DragMatchQuestion | DragBuildQuestion

interface DragDropQuestionProps {
  question: DragQuestion
  onAnswer: (correct: boolean, hintsUsed: number) => void
  showResult: boolean
  isCorrect: boolean
}

// Fill in the Blank with Drag
function FillBlankQuestion({ 
  question, 
  onCheck,
  answers,
  setAnswers,
  showResult,
  isCorrect 
}: {
  question: DragFillBlankQuestion
  onCheck: () => void
  answers: Record<string, number | null>
  setAnswers: (a: Record<string, number | null>) => void
  showResult: boolean
  isCorrect: boolean
}) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [usedOptions, setUsedOptions] = useState<Set<number>>(new Set())

  const handleDragStart = (value: number) => {
    setDraggedItem(value)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDrop = (blankId: string) => {
    if (draggedItem === null || showResult) return
    
    // If blank already has a value, return it to options
    const currentValue = answers[blankId]
    const newUsed = new Set(usedOptions)
    
    if (currentValue !== null) {
      newUsed.delete(currentValue)
    }
    
    newUsed.add(draggedItem)
    setUsedOptions(newUsed)
    
    setAnswers({ ...answers, [blankId]: draggedItem })
    setDraggedItem(null)
  }

  const handleRemoveFromBlank = (blankId: string) => {
    if (showResult) return
    
    const value = answers[blankId]
    if (value !== null) {
      const newUsed = new Set(usedOptions)
      newUsed.delete(value)
      setUsedOptions(newUsed)
      setAnswers({ ...answers, [blankId]: null })
    }
  }

  // Parse equation and render with blanks
  const renderEquation = () => {
    const parts = question.equation.split(/(\[___\d?\])/g)
    let blankIndex = 0
    
    return parts.map((part, i) => {
      if (part.match(/\[___\d?\]/)) {
        const blankId = question.blanks[blankIndex] || `blank-${blankIndex}`
        blankIndex++
        const value = answers[blankId]
        const isCorrectBlank = showResult && value === question.correctAnswers[blankId]
        const isWrongBlank = showResult && value !== null && value !== question.correctAnswers[blankId]
        
        return (
          <span
            key={i}
            className={`drop-zone inline-flex items-center justify-center mx-2 px-4 py-2 min-w-[70px] ${
              value !== null ? 'filled' : ''
            } ${isCorrectBlank ? 'border-green-500 bg-green-100' : ''} ${
              isWrongBlank ? 'border-red-500 bg-red-100' : ''
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(blankId)}
            onClick={() => handleRemoveFromBlank(blankId)}
          >
            {value !== null ? (
              <span className="font-bold text-xl">{value}</span>
            ) : (
              <span className="text-slate-400">?</span>
            )}
          </span>
        )
      }
      return <span key={i} className="text-3xl font-bold">{part}</span>
    })
  }

  return (
    <div className="space-y-6">
      {/* Equation with blanks */}
      <div className="flex items-center justify-center flex-wrap gap-2 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
        {renderEquation()}
      </div>

      {/* Draggable options */}
      <div className="flex flex-wrap justify-center gap-3">
        {question.options.map((option, i) => (
          <div
            key={i}
            draggable={!usedOptions.has(option) && !showResult}
            onDragStart={() => handleDragStart(option)}
            onDragEnd={handleDragEnd}
            className={`drag-item ${usedOptions.has(option) ? 'placed' : ''} ${
              !usedOptions.has(option) && !showResult ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  )
}

// Match pairs question
function MatchQuestion({
  question,
  answers,
  setAnswers,
  showResult,
}: {
  question: DragMatchQuestion
  onCheck: () => void
  answers: Record<string, number | null>
  setAnswers: (a: Record<string, number | null>) => void
  showResult: boolean
}) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [usedRights, setUsedRights] = useState<Set<number>>(new Set())

  const rightValues = question.pairs.map(p => p.right)
  const shuffledRights = Array.from(new Set(rightValues)).sort(() => Math.random() - 0.5)

  const handleDrop = (leftKey: string) => {
    if (draggedItem === null || showResult) return
    
    const currentValue = answers[leftKey]
    const newUsed = new Set(usedRights)
    
    if (currentValue !== null) {
      newUsed.delete(currentValue)
    }
    
    newUsed.add(draggedItem)
    setUsedRights(newUsed)
    setAnswers({ ...answers, [leftKey]: draggedItem })
    setDraggedItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Left items with drop zones */}
      <div className="space-y-3">
        {question.pairs.map((pair, i) => {
          const value = answers[pair.left]
          const isCorrect = showResult && value === pair.right
          const isWrong = showResult && value !== null && value !== pair.right
          
          return (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1 p-4 bg-indigo-100 rounded-xl font-bold text-lg text-center">
                {pair.left}
              </div>
              <div className="text-2xl">→</div>
              <div
                className={`drop-zone flex-1 flex items-center justify-center p-4 ${
                  value !== null ? 'filled' : ''
                } ${isCorrect ? 'border-green-500 bg-green-100' : ''} ${
                  isWrong ? 'border-red-500 bg-red-100' : ''
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(pair.left)}
              >
                {value !== null ? (
                  <span className="font-bold text-xl">{value}</span>
                ) : (
                  <span className="text-slate-400">Tërhiq këtu</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Draggable answers */}
      <div className="flex flex-wrap justify-center gap-3 pt-4 border-t">
        {shuffledRights.map((value, i) => (
          <div
            key={i}
            draggable={!usedRights.has(value) && !showResult}
            onDragStart={() => setDraggedItem(value)}
            onDragEnd={() => setDraggedItem(null)}
            className={`drag-item text-xl ${usedRights.has(value) ? 'placed' : ''} ${
              !usedRights.has(value) && !showResult ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}

// Main component
export default function DragDropQuestion({
  question,
  onAnswer,
  showResult,
  isCorrect,
}: DragDropQuestionProps) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [hintsRevealed, setHintsRevealed] = useState(0)

  // Initialize answers based on question type
  useEffect(() => {
    if (question.type === 'drag_fill_blank') {
      const initial: Record<string, number | null> = {}
      question.blanks.forEach(id => { initial[id] = null })
      setAnswers(initial)
    } else if (question.type === 'drag_match') {
      const initial: Record<string, number | null> = {}
      question.pairs.forEach(p => { initial[p.left] = null })
      setAnswers(initial)
    }
  }, [question])

  const handleCheck = () => {
    let correct = false
    
    if (question.type === 'drag_fill_blank') {
      correct = Object.entries(question.correctAnswers).every(
        ([key, value]) => answers[key] === value
      )
    } else if (question.type === 'drag_match') {
      correct = question.pairs.every(pair => answers[pair.left] === pair.right)
    }
    
    onAnswer(correct, hintsRevealed)
  }

  const handleReset = () => {
    if (question.type === 'drag_fill_blank') {
      const initial: Record<string, number | null> = {}
      question.blanks.forEach(id => { initial[id] = null })
      setAnswers(initial)
    } else if (question.type === 'drag_match') {
      const initial: Record<string, number | null> = {}
      question.pairs.forEach(p => { initial[p.left] = null })
      setAnswers(initial)
    }
  }

  const allFilled = Object.values(answers).every(v => v !== null)

  return (
    <div className="space-y-6">
      {/* Question text */}
      <h2 className="text-2xl font-bold text-center text-slate-800">
        {question.questionAl}
      </h2>

      {/* Render based on type */}
      {question.type === 'drag_fill_blank' && (
        <FillBlankQuestion
          question={question}
          onCheck={handleCheck}
          answers={answers}
          setAnswers={setAnswers}
          showResult={showResult}
          isCorrect={isCorrect}
        />
      )}

      {question.type === 'drag_match' && (
        <MatchQuestion
          question={question}
          onCheck={handleCheck}
          answers={answers}
          setAnswers={setAnswers}
          showResult={showResult}
        />
      )}

      {/* Hints */}
      {hintsRevealed > 0 && !showResult && (
        <div className="space-y-2">
          {question.hints.slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl animate-hint-reveal">
              <span className="text-yellow-800">💡 {hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {!showResult && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleReset}
            className="btn-secondary-fun flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Fillo rishtas
          </button>
          
          {hintsRevealed < question.hints.length && (
            <button
              onClick={() => setHintsRevealed(h => h + 1)}
              className="btn-secondary-fun"
            >
              💡 Ndihmë ({question.hints.length - hintsRevealed})
            </button>
          )}
          
          <button
            onClick={handleCheck}
            disabled={!allFilled}
            className="btn-fun"
          >
            Kontrollo
          </button>
        </div>
      )}

      {/* Result display */}
      {showResult && (
        <div className={`p-4 rounded-2xl text-center font-bold text-xl ${
          isCorrect 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isCorrect ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" /> Saktë! Bravo!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <XCircle className="w-6 h-6" /> Provo përsëri!
            </span>
          )}
        </div>
      )}
    </div>
  )
}
