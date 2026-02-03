'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Trophy } from 'lucide-react'

interface CellConfig {
  index: number
  value: number
  is_fixed: boolean
}

interface MagicSquareConfig {
  grid_size: number
  target_value: number
  operation: 'sum' | 'multiply'
  cells: CellConfig[]
}

interface MagicSquareProps {
  id: string
  questionText: string
  config: MagicSquareConfig
  hints?: string[]
  onComplete?: (correct: boolean, attempts: number) => void
  showHints?: boolean
}

interface CellState {
  value: number | null
  isFixed: boolean
  isCorrect: boolean | null
}

interface LineValidation {
  isComplete: boolean
  isCorrect: boolean
  sum: number
}

export default function MagicSquare({
  id,
  questionText,
  config,
  hints = [],
  onComplete,
  showHints = true,
}: MagicSquareProps) {
  const { grid_size, target_value, operation, cells } = config
  
  // Initialize cell states
  const [cellStates, setCellStates] = useState<CellState[]>(() => 
    cells.map(cell => ({
      value: cell.is_fixed ? cell.value : null,
      isFixed: cell.is_fixed,
      isCorrect: null,
    }))
  )
  
  const [rowValidations, setRowValidations] = useState<LineValidation[]>([])
  const [colValidations, setColValidations] = useState<LineValidation[]>([])
  const [attempts, setAttempts] = useState(0)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  
  // Calculate row/column sums and validations
  const validateGrid = useCallback(() => {
    const newRowValidations: LineValidation[] = []
    const newColValidations: LineValidation[] = []
    
    // Validate rows
    for (let row = 0; row < grid_size; row++) {
      const rowCells = cellStates.slice(row * grid_size, (row + 1) * grid_size)
      const values = rowCells.map(c => c.value)
      const isComplete = values.every(v => v !== null)
      const sum = values.reduce((acc: number, v) => acc + (v || 0), 0)
      
      newRowValidations.push({
        isComplete,
        isCorrect: isComplete && sum === target_value,
        sum,
      })
    }
    
    // Validate columns
    for (let col = 0; col < grid_size; col++) {
      const colCells = []
      for (let row = 0; row < grid_size; row++) {
        colCells.push(cellStates[row * grid_size + col])
      }
      const values = colCells.map(c => c.value)
      const isComplete = values.every(v => v !== null)
      const sum = values.reduce((acc: number, v) => acc + (v || 0), 0)
      
      newColValidations.push({
        isComplete,
        isCorrect: isComplete && sum === target_value,
        sum,
      })
    }
    
    setRowValidations(newRowValidations)
    setColValidations(newColValidations)
    
    // Check if all rows and columns are correct
    const allRowsCorrect = newRowValidations.every(r => r.isCorrect)
    const allColsCorrect = newColValidations.every(c => c.isCorrect)
    
    if (allRowsCorrect && allColsCorrect && !isComplete) {
      setIsComplete(true)
      setShowCelebration(true)
      onComplete?.(true, attempts)
      
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [cellStates, grid_size, target_value, isComplete, attempts, onComplete])
  
  // Validate whenever cells change
  useEffect(() => {
    validateGrid()
  }, [validateGrid])
  
  // Handle cell input
  const handleCellChange = (index: number, value: string) => {
    if (cellStates[index].isFixed) return
    
    const numValue = parseInt(value)
    const newValue = isNaN(numValue) ? null : Math.min(99, Math.max(0, numValue))
    
    setCellStates(prev => {
      const newStates = [...prev]
      newStates[index] = {
        ...newStates[index],
        value: newValue,
        isCorrect: newValue === cells[index].value,
      }
      return newStates
    })
  }
  
  // Handle check answer
  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    
    // Mark all non-fixed cells as correct/incorrect
    setCellStates(prev => prev.map((cell, idx) => ({
      ...cell,
      isCorrect: cell.isFixed ? null : cell.value === cells[idx].value,
    })))
  }
  
  // Reset puzzle
  const handleReset = () => {
    setCellStates(cells.map(cell => ({
      value: cell.is_fixed ? cell.value : null,
      isFixed: cell.is_fixed,
      isCorrect: null,
    })))
    setAttempts(0)
    setHintsRevealed(0)
    setIsComplete(false)
  }
  
  // Reveal hint
  const handleRevealHint = () => {
    if (hintsRevealed < hints.length) {
      setHintsRevealed(prev => prev + 1)
    }
  }
  
  // Get cell position class for visual effects
  const getCellClass = (index: number) => {
    const cell = cellStates[index]
    let classes = 'magic-cell'
    
    if (cell.isFixed) {
      classes += ' magic-cell-fixed'
    } else {
      classes += ' magic-cell-input'
      if (cell.isCorrect === true) {
        classes += ' magic-cell-correct'
      } else if (cell.isCorrect === false) {
        classes += ' magic-cell-incorrect'
      }
    }
    
    return classes
  }
  
  // Get row glow class
  const getRowGlowClass = (rowIndex: number) => {
    const validation = rowValidations[rowIndex]
    if (!validation) return ''
    if (validation.isCorrect) return 'row-glow-correct'
    if (validation.isComplete && !validation.isCorrect) return 'row-glow-incorrect'
    return ''
  }
  
  // Get column glow class
  const getColGlowClass = (colIndex: number) => {
    const validation = colValidations[colIndex]
    if (!validation) return ''
    if (validation.isCorrect) return 'col-glow-correct'
    if (validation.isComplete && !validation.isCorrect) return 'col-glow-incorrect'
    return ''
  }

  return (
    <div className="magic-square-container">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="magic-celebration">
          <div className="celebration-content">
            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
            <h3 className="text-2xl font-bold text-green-600">Bravo! 🎉</h3>
            <p className="text-slate-600">Katrori magjik u plotësua!</p>
          </div>
        </div>
      )}
      
      {/* Question */}
      <div className="magic-question">
        <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
          🔲 Katrori Magjik
        </h3>
        <p className="text-slate-600 text-center">{questionText}</p>
        <div className="target-badge">
          <span className="target-label">Shuma e synuar:</span>
          <span className="target-value">{target_value}</span>
        </div>
      </div>
      
      {/* Grid */}
      <div className="magic-grid-wrapper">
        {/* Column sum indicators */}
        <div className="col-indicators" style={{ gridTemplateColumns: `repeat(${grid_size}, 1fr)` }}>
          {colValidations.map((validation, idx) => (
            <div 
              key={`col-${idx}`} 
              className={`col-indicator ${validation.isCorrect ? 'indicator-correct' : validation.isComplete ? 'indicator-incorrect' : ''}`}
            >
              {validation.isComplete && (
                validation.isCorrect ? <CheckCircle className="w-4 h-4" /> : <span>{validation.sum}</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="magic-grid-row-wrapper">
          {/* Main Grid */}
          <div 
            className="magic-grid"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${grid_size}, 1fr)`,
              gridTemplateRows: `repeat(${grid_size}, 1fr)`,
            }}
          >
            {cellStates.map((cell, index) => {
              const row = Math.floor(index / grid_size)
              const col = index % grid_size
              
              return (
                <div 
                  key={index}
                  className={`${getCellClass(index)} ${getRowGlowClass(row)} ${getColGlowClass(col)}`}
                >
                  {cell.isFixed ? (
                    <span className="fixed-value">{cell.value}</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={cell.value ?? ''}
                      onChange={(e) => handleCellChange(index, e.target.value)}
                      className="cell-input"
                      disabled={isComplete}
                      placeholder="?"
                    />
                  )}
                  
                  {/* Correctness indicator */}
                  {cell.isCorrect === true && (
                    <CheckCircle className="cell-icon correct" />
                  )}
                  {cell.isCorrect === false && (
                    <XCircle className="cell-icon incorrect" />
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Row sum indicators */}
          <div className="row-indicators">
            {rowValidations.map((validation, idx) => (
              <div 
                key={`row-${idx}`} 
                className={`row-indicator ${validation.isCorrect ? 'indicator-correct' : validation.isComplete ? 'indicator-incorrect' : ''}`}
              >
                {validation.isComplete && (
                  validation.isCorrect ? <CheckCircle className="w-4 h-4" /> : <span>{validation.sum}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="magic-legend">
        <div className="legend-item">
          <div className="legend-box fixed" />
          <span>Numër fiks</span>
        </div>
        <div className="legend-item">
          <div className="legend-box input" />
          <span>Plotëso</span>
        </div>
        <div className="legend-item">
          <div className="legend-box correct" />
          <span>I saktë</span>
        </div>
      </div>
      
      {/* Hints */}
      {showHints && hintsRevealed > 0 && (
        <div className="magic-hints">
          {hints.slice(0, hintsRevealed).map((hint, idx) => (
            <div key={idx} className="hint-item">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span>{hint}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Controls */}
      <div className="magic-controls">
        {showHints && !isComplete && hintsRevealed < hints.length && (
          <button onClick={handleRevealHint} className="btn-hint">
            <Lightbulb className="w-5 h-5" />
            Ndihmë ({hints.length - hintsRevealed})
          </button>
        )}
        
        {!isComplete && (
          <button onClick={handleCheck} className="btn-check">
            <CheckCircle className="w-5 h-5" />
            Kontrollo
          </button>
        )}
        
        <button onClick={handleReset} className="btn-reset">
          <RotateCcw className="w-5 h-5" />
          Fillo përsëri
        </button>
      </div>
      
      {/* Attempts counter */}
      {attempts > 0 && (
        <div className="attempts-counter">
          Përpjekje: {attempts}
        </div>
      )}
      
      {/* Styles */}
      <style jsx>{`
        .magic-square-container {
          position: relative;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 1.5rem;
          border: 2px solid #bae6fd;
        }
        
        .magic-celebration {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .celebration-content {
          text-align: center;
        }
        
        .magic-question {
          margin-bottom: 1.5rem;
        }
        
        .target-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 9999px;
          border: 2px solid #f59e0b;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        
        .target-label {
          font-weight: 500;
          color: #92400e;
        }
        
        .target-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #d97706;
        }
        
        .magic-grid-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .col-indicators {
          display: grid;
          gap: 0.5rem;
          margin-left: 0;
          padding-right: 2.5rem;
        }
        
        .col-indicator, .row-indicator {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          border-radius: 0.5rem;
          background: #e2e8f0;
          color: #64748b;
        }
        
        .indicator-correct {
          background: #bbf7d0;
          color: #16a34a;
        }
        
        .indicator-incorrect {
          background: #fecaca;
          color: #dc2626;
        }
        
        .magic-grid-row-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .row-indicators {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .magic-grid {
          gap: 0.5rem;
          padding: 1rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .magic-cell {
          position: relative;
          width: 4rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          font-size: 1.5rem;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        
        .magic-cell-fixed {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          color: #334155;
          border: 2px solid #94a3b8;
        }
        
        .magic-cell-input {
          background: white;
          border: 2px dashed #94a3b8;
        }
        
        .magic-cell-input:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        
        .magic-cell-correct {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          border: 2px solid #22c55e;
        }
        
        .magic-cell-incorrect {
          background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
          border: 2px solid #ef4444;
          animation: shake 0.3s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .row-glow-correct {
          box-shadow: inset 0 0 0 3px rgba(34, 197, 94, 0.3);
        }
        
        .col-glow-correct {
          box-shadow: inset 0 0 0 3px rgba(34, 197, 94, 0.3);
        }
        
        .fixed-value {
          color: #1e293b;
        }
        
        .cell-input {
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          background: transparent;
          border: none;
          outline: none;
          color: #6366f1;
        }
        
        .cell-input::placeholder {
          color: #cbd5e1;
        }
        
        .cell-input::-webkit-inner-spin-button,
        .cell-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .cell-icon {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          width: 1.25rem;
          height: 1.25rem;
          background: white;
          border-radius: 9999px;
        }
        
        .cell-icon.correct {
          color: #22c55e;
        }
        
        .cell-icon.incorrect {
          color: #ef4444;
        }
        
        .magic-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        
        .legend-box {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.375rem;
        }
        
        .legend-box.fixed {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          border: 2px solid #94a3b8;
        }
        
        .legend-box.input {
          background: white;
          border: 2px dashed #94a3b8;
        }
        
        .legend-box.correct {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          border: 2px solid #22c55e;
        }
        
        .magic-hints {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .hint-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fef3c7;
          border: 2px solid #fcd34d;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #92400e;
        }
        
        .magic-controls {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .btn-hint, .btn-check, .btn-reset {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }
        
        .btn-hint {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }
        
        .btn-hint:hover {
          background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
          transform: translateY(-2px);
        }
        
        .btn-check {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }
        
        .btn-check:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          transform: translateY(-2px);
        }
        
        .btn-reset {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
        }
        
        .btn-reset:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          transform: translateY(-2px);
        }
        
        .attempts-counter {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        
        @media (max-width: 480px) {
          .magic-cell {
            width: 3rem;
            height: 3rem;
            font-size: 1.25rem;
          }
          
          .cell-input {
            font-size: 1.25rem;
          }
          
          .magic-legend {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          
          .magic-controls {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}
