'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { X, Trash2, Minus, Plus } from 'lucide-react'
import { al } from '@/lib/i18n'

interface ScratchPadProps {
  isOpen: boolean
  onClose: () => void
}

interface Point {
  x: number
  y: number
}

const COLORS = [
  { name: 'E zezë', value: '#1e293b' },
  { name: 'Blu', value: '#3b82f6' },
  { name: 'E kuqe', value: '#ef4444' },
  { name: 'Jeshile', value: '#22c55e' },
]

export default function ScratchPad({ isOpen, onClose }: ScratchPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState(COLORS[0].value)
  const [penSize, setPenSize] = useState(3)
  const [lastPoint, setLastPoint] = useState<Point | null>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match display size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Fill with white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, rect.width, rect.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [isOpen])

  // Get point from event (works for mouse and touch)
  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  // Draw line between two points
  const drawLine = useCallback((from: Point, to: Point) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.strokeStyle = penColor
    ctx.lineWidth = penSize
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }, [penColor, penSize])

  // Start drawing
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const point = getPoint(e)
    setLastPoint(point)
    
    // Draw a dot for single taps
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.fillStyle = penColor
      ctx.arc(point.x, point.y, penSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [getPoint, penColor, penSize])

  // Continue drawing
  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return
    e.preventDefault()
    
    const point = getPoint(e)
    drawLine(lastPoint, point)
    setLastPoint(point)
  }, [isDrawing, lastPoint, getPoint, drawLine])

  // Stop drawing
  const handleEnd = useCallback(() => {
    setIsDrawing(false)
    setLastPoint(null)
  }, [])

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
  }

  // Adjust pen size
  const adjustPenSize = (delta: number) => {
    setPenSize(prev => Math.max(1, Math.min(20, prev + delta)))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {al.scratchPad}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            aria-label={al.closeScratchPad}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 p-3 border-b bg-slate-50 flex-wrap">
          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{al.penColor}:</span>
            {COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => setPenColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  penColor === color.value 
                    ? 'border-slate-800 scale-110' 
                    : 'border-slate-300'
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={color.name}
              />
            ))}
          </div>

          <div className="h-8 w-px bg-slate-300" />

          {/* Pen size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{al.penSize}:</span>
            <button
              onClick={() => adjustPenSize(-1)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
              aria-label="Zvogëlo"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-8 text-center font-medium">{penSize}</span>
            <button
              onClick={() => adjustPenSize(1)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
              aria-label="Zmadho"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-300" />

          {/* Clear button */}
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 
                       text-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {al.clearCanvas}
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 bg-slate-100">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white rounded-lg shadow-inner scratch-canvas"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
          />
        </div>

        {/* Footer hint */}
        <div className="p-3 bg-blue-50 text-center text-sm text-blue-700 border-t">
          {al.useApplePencil}
        </div>
      </div>
    </div>
  )
}
