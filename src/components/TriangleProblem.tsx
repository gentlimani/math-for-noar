'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'

export type TriangleValue = number | '?'

export interface TriangleProblemProps {
  // [top, bottomLeft, bottomRight]
  values: [TriangleValue, TriangleValue, TriangleValue]
  operation: 'addition' | 'multiplication'
  onAnswer: (answer: number, correct: boolean) => void
  showHints?: boolean
}

// Calculate the correct answer based on position and operation
function calculateCorrectAnswer(
  values: [TriangleValue, TriangleValue, TriangleValue],
  operation: 'addition' | 'multiplication'
): number {
  const [top, left, right] = values
  const unknownIndex = values.findIndex(v => v === '?')
  
  if (operation === 'addition') {
    // top = left + right
    if (unknownIndex === 0) {
      return (left as number) + (right as number)
    } else if (unknownIndex === 1) {
      return (top as number) - (right as number)
    } else {
      return (top as number) - (left as number)
    }
  } else {
    // top = left × right
    if (unknownIndex === 0) {
      return (left as number) * (right as number)
    } else if (unknownIndex === 1) {
      // Division - protect against division by zero
      const divisor = right as number
      if (divisor === 0) return 0
      return (top as number) / divisor
    } else {
      // Division - protect against division by zero
      const divisor = left as number
      if (divisor === 0) return 0
      return (top as number) / divisor
    }
  }
}

// Get hint text based on position
function getHintText(
  values: [TriangleValue, TriangleValue, TriangleValue],
  operation: 'addition' | 'multiplication'
): string {
  const unknownIndex = values.findIndex(v => v === '?')
  const op = operation === 'addition' ? '+' : '×'
  const invOp = operation === 'addition' ? '-' : '÷'
  
  if (unknownIndex === 0) {
    return `${values[1]} ${op} ${values[2]} = ?`
  } else if (unknownIndex === 1) {
    return `${values[0]} ${invOp} ${values[2]} = ?`
  } else {
    return `${values[0]} ${invOp} ${values[1]} = ?`
  }
}

// NO AUDIO - Big, colorful, kid-friendly
export default function TriangleProblem({
  values,
  operation,
  onAnswer,
  showHints = true
}: TriangleProblemProps) {
  const [userInput, setUserInput] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const unknownIndex = values.findIndex(v => v === '?')
  const correctAnswer = calculateCorrectAnswer(values, operation)
  
  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  // Handle submit
  const handleSubmit = () => {
    if (!userInput.trim() || isSubmitted) return
    
    const userAnswer = parseInt(userInput, 10)
    const correct = userAnswer === correctAnswer
    
    setIsCorrect(correct)
    setIsSubmitted(true)
    onAnswer(userAnswer, correct)
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  // Larger triangle dimensions for kid-friendly touch
  const size = 340
  const centerX = size / 2
  const topY = 50
  const bottomY = size - 50
  const leftX = 50
  const rightX = size - 50

  // Node positions
  const positions = {
    top: { x: centerX, y: topY },
    left: { x: leftX, y: bottomY },
    right: { x: rightX, y: bottomY }
  }

  // Node colors - bright and distinct
  const nodeColors = {
    0: { bg: 'from-purple-400 to-purple-600', border: 'border-purple-200', shadow: 'shadow-purple-300' },
    1: { bg: 'from-blue-400 to-blue-600', border: 'border-blue-200', shadow: 'shadow-blue-300' },
    2: { bg: 'from-green-400 to-green-600', border: 'border-green-200', shadow: 'shadow-green-300' }
  }

  // Render a value node - BIG and TAPPABLE
  const renderNode = (
    value: TriangleValue, 
    position: { x: number; y: number }, 
    index: number,
    label: string
  ) => {
    const isUnknown = value === '?'
    const nodeSize = 85 // Bigger for easy tapping
    const halfSize = nodeSize / 2
    const color = nodeColors[index as 0 | 1 | 2]

    return (
      <g key={index}>
        {/* Node circle */}
        <foreignObject
          x={position.x - halfSize}
          y={position.y - halfSize}
          width={nodeSize}
          height={nodeSize}
        >
          <div 
            className={`w-full h-full rounded-full flex items-center justify-center
                       bg-gradient-to-br ${color.bg} shadow-xl border-4 ${color.border} ${color.shadow}
                       ${isUnknown && isSubmitted ? (isCorrect ? 'ring-4 ring-green-400 animate-pulse' : 'ring-4 ring-red-400 animate-shake') : ''}
                       ${isUnknown && !isSubmitted ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
          >
            {isUnknown ? (
              isSubmitted ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">
                    {isCorrect ? userInput : correctAnswer}
                  </span>
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-200" />
                  ) : (
                    <span className="text-sm text-red-200 line-through">{userInput}</span>
                  )}
                </div>
              ) : (
                <input
                  ref={inputRef}
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-14 h-14 text-center text-3xl font-bold bg-white rounded-xl 
                           border-4 border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300
                           shadow-lg"
                  placeholder="?"
                  disabled={isSubmitted}
                />
              )
            ) : (
              <span className="text-4xl font-bold text-white drop-shadow-lg">{value}</span>
            )}
          </div>
        </foreignObject>
        
        {/* Label - positioned outside */}
        <text
          x={position.x}
          y={index === 0 ? position.y - halfSize - 15 : position.y + halfSize + 25}
          textAnchor="middle"
          className="text-base font-bold fill-slate-600"
        >
          {label}
        </text>
      </g>
    )
  }

  return (
    <div className="triangle-problem-container p-4">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          🔺 Gjej numrin që mungon!
        </h3>
      </div>

      {/* SVG Triangle - BIGGER */}
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto block"
      >
        {/* Triangle shape with gradient fill */}
        <defs>
          <linearGradient id="triangleGradientNew" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Triangle fill */}
        <polygon
          points={`${centerX},${topY + 42} ${leftX + 42},${bottomY - 42} ${rightX - 42},${bottomY - 42}`}
          fill="url(#triangleGradientNew)"
          stroke="#8b5cf6"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Operation symbol in center - BIG */}
        <text
          x={centerX}
          y={size / 2 + 30}
          textAnchor="middle"
          className="text-6xl font-bold fill-indigo-500"
        >
          {operation === 'addition' ? '+' : '×'}
        </text>

        {/* Render nodes */}
        {renderNode(values[0], positions.top, 0, operation === 'addition' ? 'SHUMA' : 'PRODHIMI')}
        {renderNode(values[1], positions.left, 1, operation === 'addition' ? 'Pjesa 1' : 'Faktori 1')}
        {renderNode(values[2], positions.right, 2, operation === 'addition' ? 'Pjesa 2' : 'Faktori 2')}
      </svg>

      {/* Hint section */}
      {showHints && !isSubmitted && (
        <div className="mt-4 text-center">
          {showHint ? (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-50 border-4 border-yellow-300 rounded-2xl">
              <span className="text-2xl">💡</span>
              <span className="text-xl font-bold text-yellow-800">{getHintText(values, operation)}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 
                       rounded-2xl text-slate-600 transition-colors text-lg font-bold"
            >
              <HelpCircle className="w-6 h-6" />
              Ndihmë
            </button>
          )}
        </div>
      )}

      {/* Submit button - BIG */}
      {!isSubmitted && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white 
                     font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transform hover:scale-105 transition-all active:scale-95"
          >
            ✓ Kontrollo
          </button>
        </div>
      )}

      {/* Result feedback - BIG AND CLEAR */}
      {isSubmitted && (
        <div className={`mt-6 p-6 rounded-2xl text-center ${
          isCorrect 
            ? 'bg-green-100 border-4 border-green-400' 
            : 'bg-red-100 border-4 border-red-400'
        }`}>
          <div className="flex items-center justify-center gap-4">
            {isCorrect ? (
              <>
                <span className="text-5xl">🎉</span>
                <span className="text-2xl font-bold text-green-700">Saktë! Bravo!</span>
                <span className="text-5xl">🎉</span>
              </>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <XCircle className="w-10 h-10 text-red-600" />
                  <span className="text-2xl font-bold text-red-700">Jo saktë</span>
                </div>
                <p className="text-xl text-red-600">
                  Përgjigja e saktë: <strong className="text-3xl">{correctAnswer}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explanation - Always visible */}
      <div className="mt-4 p-4 bg-indigo-50 rounded-xl text-center border-2 border-indigo-200">
        {operation === 'addition' ? (
          <p className="text-lg text-indigo-700 font-medium">
            📐 <strong>SHUMA</strong> (lart) = Pjesa 1 <strong>+</strong> Pjesa 2
          </p>
        ) : (
          <p className="text-lg text-indigo-700 font-medium">
            📐 <strong>PRODHIMI</strong> (lart) = Faktori 1 <strong>×</strong> Faktori 2
          </p>
        )}
      </div>
    </div>
  )
}

// Export a simpler version for quick use
export function QuickTriangle({
  top,
  left,
  right,
  operation = 'addition',
  onAnswer
}: {
  top: TriangleValue
  left: TriangleValue
  right: TriangleValue
  operation?: 'addition' | 'multiplication'
  onAnswer: (answer: number, correct: boolean) => void
}) {
  return (
    <TriangleProblem
      values={[top, left, right]}
      operation={operation}
      onAnswer={onAnswer}
    />
  )
}
