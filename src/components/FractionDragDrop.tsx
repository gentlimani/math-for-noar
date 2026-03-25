'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react'

export interface FractionDragDropProps {
  shape: 'circle' | 'square' | 'rectangle'
  numerator: number
  denominator: number
  questionAl: string
  hints: string[]
  onAnswer: (correct: boolean, hintsUsed: number) => void
  showResult: boolean
  isCorrect: boolean
}

// Generate SVG path for one pizza/circle slice
function slicePath(
  cx: number, cy: number, r: number,
  startDeg: number, endDeg: number
): string {
  const toRad = (d: number) => (d * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startDeg))
  const y1 = cy + r * Math.sin(toRad(startDeg))
  const x2 = cx + r * Math.cos(toRad(endDeg))
  const y2 = cy + r * Math.sin(toRad(endDeg))
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`
}

// Colours per shape theme
const THEMES = {
  circle: {
    filled: '#f97316',    // orange – pizza topping
    empty: '#fef9c3',     // cream – cheese
    stroke: '#d97706',
    label: '🍕',
  },
  square: {
    filled: '#6366f1',    // indigo
    empty: '#e0e7ff',
    stroke: '#4338ca',
    label: '🟦',
  },
  rectangle: {
    filled: '#22c55e',    // green – chocolate-bar style
    empty: '#dcfce7',
    stroke: '#16a34a',
    label: '🟩',
  },
}

export default function FractionDragDrop({
  shape,
  numerator,
  denominator,
  questionAl,
  hints,
  onAnswer,
  showResult,
  isCorrect,
}: FractionDragDropProps) {
  const [filled, setFilled] = useState<Set<number>>(new Set())
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const theme = THEMES[shape]

  // Reset when question changes
  useEffect(() => {
    setFilled(new Set())
    setHintsRevealed(0)
  }, [numerator, denominator, shape])

  // After result show, highlight correct pieces if wrong
  const displayFilled: Set<number> = showResult && !isCorrect
    ? new Set(Array.from({ length: numerator }, (_, i) => i))
    : filled

  const togglePiece = (i: number) => {
    if (showResult) return
    setFilled((prev: Set<number>) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const handleCheck = () => {
    if (showResult) return
    onAnswer(filled.size === numerator, hintsRevealed)
  }

  const handleReset = () => {
    if (!showResult) setFilled(new Set())
  }

  // ─── Circle (pizza) ───────────────────────────────────────────────
  const renderCircle = () => {
    const cx = 110, cy = 110, r = 95
    const angleStep = 360 / denominator
    // Start at top (-90°)
    const pieces = Array.from({ length: denominator }, (_, i) => {
      const start = i * angleStep - 90
      const end = (i + 1) * angleStep - 90
      const isFilled = displayFilled.has(i)
      return (
        <path
          key={i}
          d={slicePath(cx, cy, r, start, end)}
          fill={isFilled ? theme.filled : theme.empty}
          stroke="white"
          strokeWidth="2.5"
          onClick={() => togglePiece(i)}
          className={showResult ? 'cursor-default' : 'cursor-pointer hover:opacity-80 transition-opacity'}
          style={{ transition: 'fill 0.18s' }}
        />
      )
    })
    return (
      <svg viewBox="0 0 220 220" className="w-52 h-52 mx-auto drop-shadow-md">
        {pieces}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.stroke} strokeWidth="3" />
        {/* Fraction label in center */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">
          {numerator}
        </text>
        <line x1={cx - 14} y1={cy + 1} x2={cx + 14} y2={cy + 1} stroke="#1e293b" strokeWidth="2.5" />
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">
          {denominator}
        </text>
      </svg>
    )
  }

  // ─── Square (grid) ────────────────────────────────────────────────
  const renderSquare = () => {
    // Decide grid dimensions
    const cols = denominator <= 4 ? denominator : denominator <= 6 ? 3 : denominator <= 9 ? 3 : 4
    const rows = Math.ceil(denominator / cols)
    const cellSize = Math.min(200 / cols, 200 / rows)
    const totalW = cols * cellSize
    const totalH = rows * cellSize
    const pieces = Array.from({ length: denominator }, (_, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const isFilled = displayFilled.has(i)
      return (
        <rect
          key={i}
          x={col * cellSize + 1}
          y={row * cellSize + 1}
          width={cellSize - 2}
          height={cellSize - 2}
          rx="4"
          fill={isFilled ? theme.filled : theme.empty}
          stroke={theme.stroke}
          strokeWidth="1.5"
          onClick={() => togglePiece(i)}
          className={showResult ? 'cursor-default' : 'cursor-pointer hover:opacity-75 transition-opacity'}
          style={{ transition: 'fill 0.18s' }}
        />
      )
    })
    return (
      <svg viewBox={`0 0 ${totalW + 2} ${totalH + 2}`} className="w-52 mx-auto drop-shadow-md" style={{ height: `${Math.round((totalH + 2) / (totalW + 2) * 208)}px` }}>
        {pieces}
      </svg>
    )
  }

  // ─── Rectangle (horizontal bar) ───────────────────────────────────
  const renderRectangle = () => {
    const cellW = 240 / denominator
    const cellH = 70
    const pieces = Array.from({ length: denominator }, (_, i) => {
      const isFilled = displayFilled.has(i)
      return (
        <rect
          key={i}
          x={i * cellW + 1}
          y={1}
          width={cellW - 2}
          height={cellH - 2}
          rx="4"
          fill={isFilled ? theme.filled : theme.empty}
          stroke={theme.stroke}
          strokeWidth="1.5"
          onClick={() => togglePiece(i)}
          className={showResult ? 'cursor-default' : 'cursor-pointer hover:opacity-75 transition-opacity'}
          style={{ transition: 'fill 0.18s' }}
        />
      )
    })
    return (
      <svg viewBox={`0 0 242 72`} className="w-full max-w-xs mx-auto drop-shadow-md">
        {pieces}
      </svg>
    )
  }

  const renderShape = () => {
    if (shape === 'circle') return renderCircle()
    if (shape === 'square') return renderSquare()
    return renderRectangle()
  }

  const filledCount = showResult && !isCorrect ? numerator : filled.size
  const shapeLabel = shape === 'circle' ? 'rrethit' : shape === 'square' ? 'katrorit' : 'drejtkëndëshit'

  return (
    <div className="space-y-5">
      {/* Question */}
      <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 text-center">
        <p className="text-xl font-bold text-slate-800 mb-3">{questionAl}</p>
        {/* Big fraction display */}
        <div className="inline-flex flex-col items-center bg-white rounded-xl px-6 py-3 shadow-sm border-2 border-amber-300">
          <span className="text-4xl font-extrabold text-orange-600 leading-none">{numerator}</span>
          <div className="w-10 h-0.5 bg-slate-700 my-1" />
          <span className="text-4xl font-extrabold text-orange-600 leading-none">{denominator}</span>
        </div>
      </div>

      {/* Instructions */}
      {!showResult && (
        <p className="text-center text-slate-500 text-sm">
          Kliko {numerator} {numerator === 1 ? 'pjesë' : 'pjesë'} të {shapeLabel} për të treguar thyesën {numerator}/{denominator}
        </p>
      )}

      {/* Shape */}
      <div className="flex justify-center py-2">
        {renderShape()}
      </div>

      {/* Counter */}
      <div className="flex justify-center">
        <div className={`px-5 py-2 rounded-full font-bold text-lg transition-colors ${
          filled.size === numerator && !showResult
            ? 'bg-green-100 text-green-700 border-2 border-green-400'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {filled.size} / {denominator} pjesë të zgjedhura
        </div>
      </div>

      {/* Hints */}
      {hintsRevealed > 0 && !showResult && (
        <div className="space-y-2">
          {hints.slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <span className="text-yellow-800">💡 {hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* Result feedback */}
      {showResult && (
        <div className={`p-4 rounded-2xl text-center font-bold text-xl flex items-center justify-center gap-2 ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isCorrect ? (
            <><CheckCircle className="w-6 h-6" />Saktë! Bravo! 🎉</>
          ) : (
            <><XCircle className="w-6 h-6" />Duhet të zgjidhësh saktësisht {numerator} pjesë!</>
          )}
        </div>
      )}

      {/* Action buttons */}
      {!showResult && (
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={handleReset}
            disabled={filled.size === 0}
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
            disabled={filled.size === 0}
            className="btn-fun disabled:opacity-50"
          >
            Kontrollo ✓
          </button>
        </div>
      )}
    </div>
  )
}
