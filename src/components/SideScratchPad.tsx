'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Trash2, Minus, Plus, Pencil } from 'lucide-react'

// Save drawing periodically for better resize handling
const SAVE_INTERVAL = 2000 // 2 seconds

interface SideScratchPadProps {
  className?: string
}

interface Point {
  x: number
  y: number
}

const COLORS = [
  { name: 'E zezë', value: '#1e293b' },
  { name: 'Blu', value: '#6366f1' },
  { name: 'E kuqe', value: '#ef4444' },
  { name: 'Jeshile', value: '#22c55e' },
  { name: 'Portokalli', value: '#f97316' },
]

export default function SideScratchPad({ className = '' }: SideScratchPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState(COLORS[0].value)
  const [penSize, setPenSize] = useState(4)
  const [lastPoint, setLastPoint] = useState<Point | null>(null)

  // Store drawing data as dataURL for proper restoration across resize
  const [savedDrawing, setSavedDrawing] = useState<string | null>(null)
  
  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      // Store current drawing as dataURL before resize (if canvas has content)
      const ctx = canvas.getContext('2d')
      let dataUrl: string | null = null
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        try {
          dataUrl = canvas.toDataURL('image/png')
        } catch (e) {
          // Canvas might be empty or tainted
        }
      }
      
      const oldWidth = canvas.width / dpr
      const oldHeight = canvas.height / dpr
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      
      const newCtx = canvas.getContext('2d')
      if (newCtx) {
        newCtx.scale(dpr, dpr)
        newCtx.lineCap = 'round'
        newCtx.lineJoin = 'round'
        
        // Fill with white
        newCtx.fillStyle = '#ffffff'
        newCtx.fillRect(0, 0, rect.width, rect.height)
        
        // Restore drawing from dataURL (scales properly)
        const urlToRestore = dataUrl || savedDrawing
        if (urlToRestore && oldWidth > 0 && oldHeight > 0) {
          const img = new Image()
          img.onload = () => {
            // Draw the old content, scaled to new size
            newCtx.drawImage(img, 0, 0, oldWidth, oldHeight, 0, 0, rect.width, rect.height)
            // Save the new state
            try {
              setSavedDrawing(canvas.toDataURL('image/png'))
            } catch (e) {
              // Ignore
            }
          }
          img.src = urlToRestore
        }
      }
    }

    resizeCanvas()
    
    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(container)
    
    return () => observer.disconnect()
  }, [savedDrawing])

  // Get point from event
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

  // Draw line
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
    
    // Draw dot
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
    
    // Save drawing state after stroke ends
    const canvas = canvasRef.current
    if (canvas) {
      try {
        setSavedDrawing(canvas.toDataURL('image/png'))
      } catch (e) {
        // Ignore errors
      }
    }
  }, [])

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !container) return

    const rect = container.getBoundingClientRect()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    
    // Clear saved drawing state
    setSavedDrawing(null)
  }

  return (
    <div className={`scratch-container flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b flex-wrap">
        {/* Colors */}
        <div className="flex items-center gap-1">
          {COLORS.map(color => (
            <button
              key={color.value}
              onClick={() => setPenColor(color.value)}
              className={`w-7 h-7 rounded-full border-3 transition-all ${
                penColor === color.value 
                  ? 'scale-110 ring-2 ring-offset-1 ring-indigo-400' 
                  : 'border-white shadow'
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={color.name}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-slate-300 mx-1" />

        {/* Pen size */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPenSize(prev => Math.max(1, prev - 1))}
            className="p-1.5 hover:bg-white rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-6 h-6 flex items-center justify-center">
            <div 
              className="rounded-full bg-slate-700"
              style={{ width: penSize * 2, height: penSize * 2 }}
            />
          </div>
          <button
            onClick={() => setPenSize(prev => Math.min(20, prev + 1))}
            className="p-1.5 hover:bg-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Clear button */}
        <button
          onClick={clearCanvas}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 
                     text-red-700 rounded-lg transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Pastro
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 bg-white relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 scratch-canvas"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
        />
        
        {/* Watermark */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-slate-300 pointer-events-none">
          <Pencil className="w-4 h-4" />
          <span className="text-xs">Shkruaj këtu</span>
        </div>
      </div>
    </div>
  )
}
