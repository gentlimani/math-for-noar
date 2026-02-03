'use client'

import { useState, useEffect, useRef } from 'react'
import { speak } from '@/lib/audioNarrator'
import { Play, Pause, RotateCcw, ChevronRight, Volume2 } from 'lucide-react'

interface StickMultiplicationProps {
  num1: number
  num2: number
  autoPlay?: boolean
  onComplete?: () => void
  audioEnabled?: boolean
}

interface AnimationStep {
  type: 'draw_horizontal' | 'draw_vertical' | 'count' | 'result'
  text: string
  data?: {
    digit?: number
    position?: 'left' | 'right'
    group?: number
  }
}

export default function StickMultiplication({
  num1,
  num2,
  autoPlay = false,
  onComplete,
  audioEnabled = true
}: StickMultiplicationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [showResult, setShowResult] = useState(false)
  
  const result = num1 * num2
  
  // Parse digits
  const digits1 = num1.toString().split('').map(Number)
  const digits2 = num2.toString().split('').map(Number)
  
  // Generate animation steps
  const generateSteps = (): AnimationStep[] => {
    const steps: AnimationStep[] = []
    
    steps.push({
      type: 'draw_horizontal',
      text: `Le të shumëzojmë ${num1} × ${num2} me metodën e shkopinjve!`
    })
    
    // Draw horizontal lines for num1
    digits1.forEach((digit, idx) => {
      steps.push({
        type: 'draw_horizontal',
        text: `Vizatojmë ${digit} vija horizontale për shifrën ${digit}`,
        data: { digit, position: idx === 0 ? 'left' : 'right' }
      })
    })
    
    // Draw vertical lines for num2
    digits2.forEach((digit, idx) => {
      steps.push({
        type: 'draw_vertical',
        text: `Vizatojmë ${digit} vija vertikale për shifrën ${digit}`,
        data: { digit, position: idx === 0 ? 'left' : 'right' }
      })
    })
    
    // Count intersections
    steps.push({
      type: 'count',
      text: 'Tani numërojmë kryqëzimet në çdo grup diagonal!'
    })
    
    steps.push({
      type: 'result',
      text: `Produkti është ${result}! 🎉`
    })
    
    return steps
  }
  
  const steps = generateSteps()
  
  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const width = canvas.width
    const height = canvas.height
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Background
    ctx.fillStyle = '#fef9c3' // Light yellow
    ctx.fillRect(0, 0, width, height)
    
    // Grid pattern
    ctx.strokeStyle = '#fde047'
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }
    
    // Calculate positions
    const margin = 60
    const horizontalSpacing = 25
    const verticalSpacing = 25
    const groupGap = 40
    
    // Draw horizontal lines (num1)
    if (step >= 2) {
      ctx.strokeStyle = '#ef4444' // Red
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      
      let yOffset = margin
      
      digits1.forEach((digit, digitIdx) => {
        for (let i = 0; i < digit; i++) {
          const y = yOffset + i * horizontalSpacing
          const animProgress = Math.min(1, (step - 2 - digitIdx) * 0.3 + 0.7)
          
          if (step > 2 + digitIdx || animProgress > 0) {
            ctx.beginPath()
            ctx.moveTo(margin, y)
            ctx.lineTo(width - margin, y)
            ctx.stroke()
          }
        }
        yOffset += digit * horizontalSpacing + groupGap
      })
    }
    
    // Draw vertical lines (num2)
    if (step >= 2 + digits1.length) {
      ctx.strokeStyle = '#3b82f6' // Blue
      ctx.lineWidth = 3
      
      let xOffset = margin
      
      digits2.forEach((digit, digitIdx) => {
        for (let i = 0; i < digit; i++) {
          const x = xOffset + i * verticalSpacing
          
          if (step > 2 + digits1.length + digitIdx) {
            ctx.beginPath()
            ctx.moveTo(x, margin)
            ctx.lineTo(x, height - margin)
            ctx.stroke()
          }
        }
        xOffset += digit * verticalSpacing + groupGap
      })
    }
    
    // Draw intersections
    if (step >= 2 + digits1.length + digits2.length) {
      ctx.fillStyle = '#22c55e' // Green
      
      let yOffset = margin
      digits1.forEach((d1) => {
        for (let i = 0; i < d1; i++) {
          const y = yOffset + i * horizontalSpacing
          
          let xOffset = margin
          digits2.forEach((d2) => {
            for (let j = 0; j < d2; j++) {
              const x = xOffset + j * verticalSpacing
              
              ctx.beginPath()
              ctx.arc(x, y, 6, 0, Math.PI * 2)
              ctx.fill()
            }
            xOffset += d2 * verticalSpacing + groupGap
          })
        }
        yOffset += d1 * horizontalSpacing + groupGap
      })
    }
    
    // Draw result
    if (showResult) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(width/2 - 80, height/2 - 30, 160, 60)
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 32px Comic Neue, cursive'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`= ${result}`, width/2, height/2)
    }
    
  }, [step, digits1, digits2, showResult, result])
  
  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return
    if (step >= steps.length) {
      setIsPlaying(false)
      setShowResult(true)
      onComplete?.()
      return
    }
    
    // Speak current step
    if (audioEnabled && steps[step]) {
      speak(steps[step].text)
    }
    
    const timer = setTimeout(() => {
      setStep(s => s + 1)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [step, isPlaying, steps, audioEnabled, onComplete])
  
  // Reset
  const handleReset = () => {
    setStep(0)
    setIsPlaying(false)
    setShowResult(false)
  }
  
  // Manual step forward
  const handleNextStep = () => {
    if (step < steps.length) {
      setStep(s => s + 1)
      if (audioEnabled && steps[step]) {
        speak(steps[step].text)
      }
    }
    if (step >= steps.length - 1) {
      setShowResult(true)
      onComplete?.()
    }
  }

  return (
    <div className="stick-multiplication-container">
      {/* Title */}
      <div className="stick-header">
        <h3 className="stick-title">
          📐 Shumëzimi me Shkopinj
          <span className="text-sm font-normal text-slate-500 ml-2">
            (Metoda Kineze)
          </span>
        </h3>
        
        <div className="problem-display">
          <span className="num1">{num1}</span>
          <span className="operator">×</span>
          <span className="num2">{num2}</span>
          {showResult && (
            <>
              <span className="equals">=</span>
              <span className="result-value">{result}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Canvas */}
      <div className="stick-canvas-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="stick-canvas"
        />
        
        {/* Legend */}
        <div className="stick-legend">
          <div className="legend-item">
            <div className="legend-line horizontal" />
            <span>{num1}</span>
          </div>
          <div className="legend-item">
            <div className="legend-line vertical" />
            <span>{num2}</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" />
            <span>Kryqëzim</span>
          </div>
        </div>
      </div>
      
      {/* Current step text */}
      <div className="step-display">
        <p className="step-text">
          {steps[Math.min(step, steps.length - 1)]?.text || 'Kliko "Luaj" për të filluar!'}
        </p>
      </div>
      
      {/* Controls */}
      <div className="stick-controls">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="control-btn primary"
          disabled={step >= steps.length && showResult}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              Ndalo
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Luaj
            </>
          )}
        </button>
        
        <button
          onClick={handleNextStep}
          className="control-btn"
          disabled={isPlaying || (step >= steps.length && showResult)}
        >
          <ChevronRight className="w-5 h-5" />
          Hapi tjetër
        </button>
        
        <button onClick={handleReset} className="control-btn">
          <RotateCcw className="w-5 h-5" />
          Fillo përsëri
        </button>
      </div>
      
      {/* Explanation */}
      <div className="stick-explanation">
        <h4>Si funksionon?</h4>
        <ol>
          <li>Vizato vija horizontale për shifrën e parë (me ngjyrë të kuqe)</li>
          <li>Vizato vija vertikale për shifrën e dytë (me ngjyrë blu)</li>
          <li>Numëro kryqëzimet në çdo grup diagonal</li>
          <li>Mblidh numrat duke mbartë nëse nevojitet</li>
        </ol>
      </div>
    </div>
  )
}

// Interactive practice mode
export function StickMultiplicationPractice({
  onComplete
}: {
  onComplete?: (score: number) => void
}) {
  const [problems, setProblems] = useState<[number, number][]>([])
  const [currentProblem, setCurrentProblem] = useState(0)
  const [score, setScore] = useState(0)
  
  // Generate problems on mount
  useEffect(() => {
    const newProblems: [number, number][] = []
    for (let i = 0; i < 5; i++) {
      const a = Math.floor(Math.random() * 9) + 11 // 11-19
      const b = Math.floor(Math.random() * 9) + 11 // 11-19
      newProblems.push([a, b])
    }
    setProblems(newProblems)
  }, [])
  
  if (problems.length === 0) {
    return <div>Duke ngarkuar...</div>
  }
  
  const handleComplete = () => {
    setScore(s => s + 20)
    
    if (currentProblem < problems.length - 1) {
      setTimeout(() => {
        setCurrentProblem(p => p + 1)
      }, 1500)
    } else {
      onComplete?.(score + 20)
    }
  }
  
  return (
    <div className="stick-practice">
      <div className="practice-header">
        <span>Problemi {currentProblem + 1} / {problems.length}</span>
        <span>Pikë: {score}</span>
      </div>
      
      <StickMultiplication
        key={currentProblem}
        num1={problems[currentProblem][0]}
        num2={problems[currentProblem][1]}
        onComplete={handleComplete}
      />
    </div>
  )
}
