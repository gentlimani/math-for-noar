'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCcw, CheckCircle, HelpCircle, Package, ArrowRight, Sparkles } from 'lucide-react'

interface VisualMultiplicationProps {
  num1: number
  num2: number
  onComplete?: (correct: boolean) => void
}

interface PlacedStick {
  id: string
  type: 'horizontal' | 'vertical'
  position: number // row index for horizontal, column index for vertical
}

interface Intersection {
  id: string
  x: number
  y: number
  row: number
  col: number
  clicked: boolean
}

// Grid configuration - responsive values calculated in component
const GRID_ROWS = 6
const GRID_COLS = 6
const BASE_CELL_SIZE = 50
const BASE_GRID_PADDING = 40

// Draggable Stick Component with touch support
function DraggableStick({
  type,
  index,
  onDragStart,
  onTouchStart,
  disabled,
  isSmallScreen
}: {
  type: 'horizontal' | 'vertical'
  index: number
  onDragStart: (type: 'horizontal' | 'vertical') => void
  onTouchStart: (type: 'horizontal' | 'vertical', e: React.TouchEvent) => void
  disabled: boolean
  isSmallScreen: boolean
}) {
  const isHorizontal = type === 'horizontal'
  
  // Responsive sizes - smaller on small screens
  const stickWidth = isHorizontal ? (isSmallScreen ? '60px' : '80px') : (isSmallScreen ? '10px' : '12px')
  const stickHeight = isHorizontal ? (isSmallScreen ? '10px' : '12px') : (isSmallScreen ? '60px' : '80px')
  
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    
    // Set drag data
    e.dataTransfer.setData('stickType', type)
    e.dataTransfer.effectAllowed = 'move'
    
    // Create a custom drag image
    const dragImage = document.createElement('div')
    dragImage.style.width = isHorizontal ? '120px' : '8px'
    dragImage.style.height = isHorizontal ? '8px' : '120px'
    dragImage.style.backgroundColor = isHorizontal ? '#ef4444' : '#3b82f6'
    dragImage.style.borderRadius = '4px'
    dragImage.style.position = 'absolute'
    dragImage.style.top = '-1000px'
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, isHorizontal ? 60 : 4, isHorizontal ? 4 : 60)
    setTimeout(() => document.body.removeChild(dragImage), 0)
    
    onDragStart(type)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    onTouchStart(type, e)
  }

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      className={`stick-in-toolbox ${type} ${disabled ? 'used' : ''}`}
      style={{
        width: stickWidth,
        height: stickHeight,
        backgroundColor: disabled 
          ? '#cbd5e1' 
          : isHorizontal ? '#ef4444' : '#3b82f6',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'grab',
        boxShadow: disabled ? 'none' : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.3 : 1,
        touchAction: 'none', // Prevent scroll on touch
        minWidth: isHorizontal ? '44px' : '10px', // Touch-friendly minimum
        minHeight: isHorizontal ? '10px' : '44px',
      }}
      title={disabled ? 'Tashmë e përdorur' : `Tërhiq ${isHorizontal ? 'shkopirin e kuq' : 'shkopirin blu'}`}
    />
  )
}

// Main Component
export default function VisualMultiplication({
  num1,
  num2,
  onComplete
}: VisualMultiplicationProps) {
  // State
  const [placedSticks, setPlacedSticks] = useState<PlacedStick[]>([])
  const [availableHorizontal, setAvailableHorizontal] = useState(num1)
  const [availableVertical, setAvailableVertical] = useState(num2)
  const [intersections, setIntersections] = useState<Intersection[]>([])
  const [clickedCount, setClickedCount] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [dragOverRow, setDragOverRow] = useState<number | null>(null)
  const [dragOverCol, setDragOverCol] = useState<number | null>(null)
  const [currentDragType, setCurrentDragType] = useState<'horizontal' | 'vertical' | null>(null)
  const [gamePhase, setGamePhase] = useState<'placing' | 'counting' | 'answering' | 'complete'>('placing')
  const [touchDragging, setTouchDragging] = useState<'horizontal' | 'vertical' | null>(null)
  const [screenSize, setScreenSize] = useState<'small' | 'medium' | 'large'>('large')
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const result = num1 * num2

  // Responsive cell size calculation
  const CELL_SIZE = screenSize === 'small' ? 35 : screenSize === 'medium' ? 42 : BASE_CELL_SIZE
  const GRID_PADDING = screenSize === 'small' ? 25 : screenSize === 'medium' ? 32 : BASE_GRID_PADDING

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 480) {
        setScreenSize('small')
      } else if (width < 768) {
        setScreenSize('medium')
      } else {
        setScreenSize('large')
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Reset when numbers change
  useEffect(() => {
    setPlacedSticks([])
    setAvailableHorizontal(num1)
    setAvailableVertical(num2)
    setIntersections([])
    setClickedCount(0)
    setUserAnswer('')
    setIsChecked(false)
    setIsCorrect(false)
    setGamePhase('placing')
  }, [num1, num2])

  // Calculate intersections when sticks change
  useEffect(() => {
    const horizontalSticks = placedSticks.filter(s => s.type === 'horizontal')
    const verticalSticks = placedSticks.filter(s => s.type === 'vertical')
    
    const newIntersections: Intersection[] = []
    
    horizontalSticks.forEach(hStick => {
      verticalSticks.forEach(vStick => {
        const x = GRID_PADDING + vStick.position * CELL_SIZE + CELL_SIZE / 2
        const y = GRID_PADDING + hStick.position * CELL_SIZE + CELL_SIZE / 2
        
        newIntersections.push({
          id: `${hStick.id}-${vStick.id}`,
          x,
          y,
          row: hStick.position,
          col: vStick.position,
          clicked: false
        })
      })
    })
    
    setIntersections(newIntersections)
    setClickedCount(0)
    
    // Check if all sticks are placed
    if (availableHorizontal === 0 && availableVertical === 0 && placedSticks.length > 0) {
      setGamePhase('counting')
    }
  }, [placedSticks, availableHorizontal, availableVertical])

  // Check if all intersections are counted
  useEffect(() => {
    if (gamePhase === 'counting' && intersections.length > 0 && clickedCount === intersections.length) {
      setGamePhase('answering')
    }
  }, [clickedCount, intersections.length, gamePhase])

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (!canvasRef.current || !currentDragType) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    if (currentDragType === 'horizontal') {
      // Calculate which row to snap to
      const row = Math.floor((y - GRID_PADDING) / CELL_SIZE)
      if (row >= 0 && row < GRID_ROWS) {
        // Check if row is already occupied
        const isOccupied = placedSticks.some(s => s.type === 'horizontal' && s.position === row)
        setDragOverRow(isOccupied ? null : row)
      } else {
        setDragOverRow(null)
      }
      setDragOverCol(null)
    } else {
      // Calculate which column to snap to
      const col = Math.floor((x - GRID_PADDING) / CELL_SIZE)
      if (col >= 0 && col < GRID_COLS) {
        // Check if column is already occupied
        const isOccupied = placedSticks.some(s => s.type === 'vertical' && s.position === col)
        setDragOverCol(isOccupied ? null : col)
      } else {
        setDragOverCol(null)
      }
      setDragOverRow(null)
    }
  }, [currentDragType, placedSticks])

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setDragOverRow(null)
    setDragOverCol(null)
  }, [])

  // Touch event handlers for mobile drag & drop
  const handleTouchStart = useCallback((type: 'horizontal' | 'vertical', e: React.TouchEvent) => {
    e.preventDefault()
    setTouchDragging(type)
    setCurrentDragType(type)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchDragging || !canvasRef.current) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const rect = canvasRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    
    if (touchDragging === 'horizontal') {
      const row = Math.floor((y - GRID_PADDING) / CELL_SIZE)
      if (row >= 0 && row < GRID_ROWS) {
        const isOccupied = placedSticks.some(s => s.type === 'horizontal' && s.position === row)
        setDragOverRow(isOccupied ? null : row)
      } else {
        setDragOverRow(null)
      }
      setDragOverCol(null)
    } else {
      const col = Math.floor((x - GRID_PADDING) / CELL_SIZE)
      if (col >= 0 && col < GRID_COLS) {
        const isOccupied = placedSticks.some(s => s.type === 'vertical' && s.position === col)
        setDragOverCol(isOccupied ? null : col)
      } else {
        setDragOverCol(null)
      }
      setDragOverRow(null)
    }
  }, [touchDragging, placedSticks, CELL_SIZE, GRID_PADDING])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchDragging) return
    e.preventDefault()
    
    let position: number | null = null
    
    if (touchDragging === 'horizontal' && dragOverRow !== null) {
      position = dragOverRow
      setAvailableHorizontal(prev => prev - 1)
    } else if (touchDragging === 'vertical' && dragOverCol !== null) {
      position = dragOverCol
      setAvailableVertical(prev => prev - 1)
    }
    
    if (position !== null) {
      const newStick: PlacedStick = {
        id: `${touchDragging}-${Date.now()}`,
        type: touchDragging,
        position
      }
      setPlacedSticks(prev => [...prev, newStick])
    }
    
    setDragOverRow(null)
    setDragOverCol(null)
    setTouchDragging(null)
    setCurrentDragType(null)
  }, [touchDragging, dragOverRow, dragOverCol])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    const stickType = e.dataTransfer.getData('stickType') as 'horizontal' | 'vertical'
    
    if (!stickType) return
    
    let position: number | null = null
    
    if (stickType === 'horizontal' && dragOverRow !== null) {
      position = dragOverRow
      setAvailableHorizontal(prev => prev - 1)
    } else if (stickType === 'vertical' && dragOverCol !== null) {
      position = dragOverCol
      setAvailableVertical(prev => prev - 1)
    }
    
    if (position !== null) {
      const newStick: PlacedStick = {
        id: `${stickType}-${Date.now()}`,
        type: stickType,
        position
      }
      setPlacedSticks(prev => [...prev, newStick])
    }
    
    setDragOverRow(null)
    setDragOverCol(null)
    setCurrentDragType(null)
  }, [dragOverRow, dragOverCol])

  // Handle intersection click
  const handleIntersectionClick = (intersectionId: string) => {
    if (gamePhase !== 'counting') return
    
    setIntersections(prev => 
      prev.map(i => {
        if (i.id === intersectionId && !i.clicked) {
          setClickedCount(c => c + 1)
          return { ...i, clicked: true }
        }
        return i
      })
    )
  }

  // Check answer
  const handleCheckAnswer = () => {
    const answer = parseInt(userAnswer, 10)
    const correct = answer === result
    setIsCorrect(correct)
    setIsChecked(true)
    setGamePhase('complete')
    onComplete?.(correct)
  }

  // Reset game
  const handleReset = () => {
    setPlacedSticks([])
    setAvailableHorizontal(num1)
    setAvailableVertical(num2)
    setIntersections([])
    setClickedCount(0)
    setUserAnswer('')
    setIsChecked(false)
    setIsCorrect(false)
    setGamePhase('placing')
  }

  // Calculate canvas dimensions
  const canvasWidth = GRID_COLS * CELL_SIZE + GRID_PADDING * 2
  const canvasHeight = GRID_ROWS * CELL_SIZE + GRID_PADDING * 2

  // Get phase instructions
  const getPhaseInstruction = () => {
    switch (gamePhase) {
      case 'placing':
        return `📦 Tërhiq shkopinjët nga kutia dhe vendosi në tabelë!`
      case 'counting':
        return `👆 Kliko çdo kryqëzim për ta numëruar!`
      case 'answering':
        return `✏️ Shkruaj sa kryqëzime ke numëruar!`
      case 'complete':
        return isCorrect ? `🎉 Saktë! Bravo!` : `❌ Jo saktë. Përgjigja ishte ${result}.`
    }
  }

  return (
    <div className="visual-mult-game bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            📐 Shumëzimi me Shkopinj
          </h3>
          <div className="flex items-center gap-2 text-2xl font-mono">
            <span className="text-red-200">{num1}</span>
            <span>×</span>
            <span className="text-blue-200">{num2}</span>
            {isChecked && (
              <>
                <span>=</span>
                <span className={isCorrect ? 'text-green-300' : 'text-red-300'}>{result}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Instruction Bar */}
      <div className={`p-4 text-center font-bold text-lg ${
        gamePhase === 'complete' 
          ? isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {getPhaseInstruction()}
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Toolbox */}
        <div className="lg:w-48 p-4 bg-slate-100 border-b lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 mb-4 font-bold text-slate-700">
            <Package className="w-5 h-5" />
            <span>Kutia e Shkopinjve</span>
          </div>

          {/* Horizontal Sticks (Red - Number 1) */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-red-600">
              <div className="w-4 h-2 bg-red-500 rounded" />
              <span>Numri {num1}</span>
              <span className="ml-auto bg-red-100 px-2 py-0.5 rounded-full text-xs">
                {availableHorizontal} / {num1}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-white rounded-lg border-2 border-dashed border-red-200">
              {Array.from({ length: num1 }).map((_, i) => (
                <DraggableStick
                  key={`h-${i}`}
                  type="horizontal"
                  index={i}
                  onDragStart={setCurrentDragType}
                  onTouchStart={handleTouchStart}
                  disabled={i >= availableHorizontal}
                  isSmallScreen={screenSize === 'small'}
                />
              ))}
            </div>
          </div>

          {/* Vertical Sticks (Blue - Number 2) */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-blue-600">
              <div className="w-2 h-4 bg-blue-500 rounded" />
              <span>Numri {num2}</span>
              <span className="ml-auto bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                {availableVertical} / {num2}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[80px] p-2 bg-white rounded-lg border-2 border-dashed border-blue-200">
              {Array.from({ length: num2 }).map((_, i) => (
                <DraggableStick
                  key={`v-${i}`}
                  type="vertical"
                  index={i}
                  onDragStart={setCurrentDragType}
                  onTouchStart={handleTouchStart}
                  disabled={i >= availableVertical}
                  isSmallScreen={screenSize === 'small'}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-3 bg-white rounded-lg text-sm">
            <div className="font-bold text-slate-600 mb-2">Si të luash:</div>
            <ol className="space-y-1 text-slate-500 text-xs list-decimal list-inside">
              <li>Tërhiq shkopinjt në tabelë</li>
              <li>Kliko çdo pikë kryqëzimi</li>
              <li>Shkruaj numrin total</li>
            </ol>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-6 flex flex-col items-center">
          {/* Drop Zone Canvas */}
          <div
            ref={canvasRef}
            className="relative bg-slate-50 rounded-xl border-4 border-slate-200 overflow-hidden"
            style={{ width: canvasWidth, height: canvasHeight, maxWidth: '100%', touchAction: 'none' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Grid background */}
            <svg width={canvasWidth} height={canvasHeight} className="absolute inset-0">
              {/* Grid lines */}
              {Array.from({ length: GRID_ROWS + 1 }).map((_, i) => (
                <line
                  key={`h-grid-${i}`}
                  x1={GRID_PADDING}
                  y1={GRID_PADDING + i * CELL_SIZE}
                  x2={canvasWidth - GRID_PADDING}
                  y2={GRID_PADDING + i * CELL_SIZE}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: GRID_COLS + 1 }).map((_, i) => (
                <line
                  key={`v-grid-${i}`}
                  x1={GRID_PADDING + i * CELL_SIZE}
                  y1={GRID_PADDING}
                  x2={GRID_PADDING + i * CELL_SIZE}
                  y2={canvasHeight - GRID_PADDING}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
            </svg>

            {/* Ghost line preview while dragging */}
            {dragOverRow !== null && (
              <div
                className="absolute bg-red-300 rounded-full animate-pulse"
                style={{
                  left: GRID_PADDING,
                  top: GRID_PADDING + dragOverRow * CELL_SIZE + CELL_SIZE / 2 - 4,
                  width: (GRID_COLS * CELL_SIZE),
                  height: 8,
                  opacity: 0.7
                }}
              />
            )}
            {dragOverCol !== null && (
              <div
                className="absolute bg-blue-300 rounded-full animate-pulse"
                style={{
                  left: GRID_PADDING + dragOverCol * CELL_SIZE + CELL_SIZE / 2 - 4,
                  top: GRID_PADDING,
                  width: 8,
                  height: (GRID_ROWS * CELL_SIZE),
                  opacity: 0.7
                }}
              />
            )}

            {/* Placed horizontal sticks */}
            {placedSticks.filter(s => s.type === 'horizontal').map(stick => (
              <div
                key={stick.id}
                className="absolute bg-red-500 rounded-full shadow-lg stick-placed"
                style={{
                  left: GRID_PADDING,
                  top: GRID_PADDING + stick.position * CELL_SIZE + CELL_SIZE / 2 - 4,
                  width: (GRID_COLS * CELL_SIZE),
                  height: 8
                }}
              />
            ))}

            {/* Placed vertical sticks */}
            {placedSticks.filter(s => s.type === 'vertical').map(stick => (
              <div
                key={stick.id}
                className="absolute bg-blue-500 rounded-full shadow-lg stick-placed"
                style={{
                  left: GRID_PADDING + stick.position * CELL_SIZE + CELL_SIZE / 2 - 4,
                  top: GRID_PADDING,
                  width: 8,
                  height: (GRID_ROWS * CELL_SIZE)
                }}
              />
            ))}

            {/* Intersections */}
            {intersections.map(intersection => (
              <button
                key={intersection.id}
                onClick={() => handleIntersectionClick(intersection.id)}
                disabled={intersection.clicked || gamePhase !== 'counting'}
                className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 
                          transition-all duration-200 ${
                  intersection.clicked
                    ? 'bg-green-500 scale-125 shadow-lg cursor-default'
                    : gamePhase === 'counting'
                      ? 'bg-slate-300 hover:bg-yellow-400 hover:scale-150 cursor-pointer shadow-md'
                      : 'bg-slate-300 opacity-50 cursor-default'
                }`}
                style={{
                  left: intersection.x,
                  top: intersection.y,
                  width: intersection.clicked ? 20 : 16,
                  height: intersection.clicked ? 20 : 16
                }}
              >
                {intersection.clicked && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </button>
            ))}

            {/* Empty state hint */}
            {placedSticks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-slate-400">
                  <ArrowRight className="w-12 h-12 mx-auto mb-2 animate-bounce-x" />
                  <p className="font-bold">Tërhiq shkopinjët këtu!</p>
                </div>
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="mt-4 flex items-center justify-center gap-6 p-4 bg-slate-100 rounded-xl w-full max-w-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{clickedCount}</div>
              <div className="text-sm text-slate-500">Numërove</div>
            </div>
            <div className="text-2xl text-slate-300">/</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-400">{intersections.length || '?'}</div>
              <div className="text-sm text-slate-500">Kryqëzime</div>
            </div>
          </div>

          {/* Answer Input */}
          {(gamePhase === 'answering' || gamePhase === 'complete') && (
            <div className="mt-6 p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200 w-full max-w-md">
              <label className="block text-lg font-bold text-indigo-800 mb-3 text-center">
                Sa kryqëzime ke numëruar?
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex-1 px-4 py-4 text-3xl text-center font-bold border-4 border-indigo-300 
                           rounded-xl focus:border-indigo-500 outline-none disabled:bg-slate-100"
                  placeholder="?"
                  disabled={isChecked}
                />
                {!isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!userAnswer.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold 
                             text-lg rounded-xl shadow-lg disabled:opacity-50 hover:scale-105 transition-all
                             disabled:hover:scale-100"
                  >
                    <CheckCircle className="w-8 h-8" />
                  </button>
                ) : (
                  <div className={`px-6 py-4 rounded-xl flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <Sparkles className="w-8 h-8 text-white" />
                    ) : (
                      <span className="text-white text-2xl font-bold">{result}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="mt-6 px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl 
                     hover:bg-slate-300 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Fillo përsëri
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="p-4 bg-slate-50 border-t">
        <details className="text-sm text-slate-600">
          <summary className="font-bold cursor-pointer flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Si funksionon shumëzimi me shkopinj?
          </summary>
          <div className="mt-3 p-4 bg-white rounded-lg">
            <ol className="space-y-2 list-decimal list-inside">
              <li><strong className="text-red-600">{num1} shkopinj të kuq</strong> = numri i parë ({num1})</li>
              <li><strong className="text-blue-600">{num2} shkopinj blu</strong> = numri i dytë ({num2})</li>
              <li>Vendosi shkopinjët në tabelë</li>
              <li>Numëro <strong className="text-green-600">kryqëzimet</strong> (pikat ku takohen)</li>
              <li>Numri i kryqëzimeve = <strong>{num1} × {num2} = {result}</strong></li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  )
}

// Practice mode component
export function VisualMultiplicationPractice({
  onComplete
}: {
  onComplete?: (score: number) => void
}) {
  const [problems] = useState(() => {
    const probs: [number, number][] = []
    // Simple single-digit multiplication for drag and drop
    for (let i = 0; i < 5; i++) {
      const a = Math.floor(Math.random() * 3) + 2 // 2-4
      const b = Math.floor(Math.random() * 3) + 2 // 2-4
      probs.push([a, b])
    }
    return probs
  })
  const [currentProblem, setCurrentProblem] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const handleComplete = (correct: boolean) => {
    if (correct) {
      setScore(s => s + 20)
    }
    
    setTimeout(() => {
      if (currentProblem < problems.length - 1) {
        setCurrentProblem(p => p + 1)
      } else {
        setFinished(true)
        onComplete?.(score + (correct ? 20 : 0))
      }
    }, 2000)
  }

  if (finished) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Praktika Përfundoi!</h2>
        <p className="text-4xl font-bold text-green-600 mb-6">{score} pikë</p>
        <button
          onClick={() => {
            setCurrentProblem(0)
            setScore(0)
            setFinished(false)
          }}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold 
                   text-lg rounded-xl hover:scale-105 transition-all"
        >
          Luaj përsëri
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-4 py-2 bg-slate-100 rounded-xl">
        <span className="font-bold text-slate-700">
          Problemi {currentProblem + 1} / {problems.length}
        </span>
        <span className="font-bold text-green-600">Pikë: {score}</span>
      </div>
      
      <VisualMultiplication
        key={currentProblem}
        num1={problems[currentProblem][0]}
        num2={problems[currentProblem][1]}
        onComplete={handleComplete}
      />
    </div>
  )
}
