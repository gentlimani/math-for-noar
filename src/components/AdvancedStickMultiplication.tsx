'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { speak } from '@/lib/audioNarrator'
import { Play, Pause, RotateCcw, ChevronRight, Volume2, HelpCircle, X, Zap } from 'lucide-react'

interface AdvancedStickMultiplicationProps {
  num1: number
  num2: number
  autoPlay?: boolean
  onComplete?: () => void
  audioEnabled?: boolean
  hardMode?: boolean
}

interface AnimationStep {
  type: 'intro' | 'draw_group' | 'intersections' | 'count_zone' | 'carry' | 'result'
  text: string
  highlight?: {
    groupIndex?: number
    zoneIndex?: number
    isHorizontal?: boolean
  }
}

// Color scheme for place values
const COLORS = {
  hundreds: '#22c55e',  // Green
  tens: '#ef4444',      // Red  
  units: '#3b82f6',     // Blue
  intersection: '#f59e0b', // Amber for dots
  zone: {
    units: 'rgba(59, 130, 246, 0.1)',      // Blue
    tens: 'rgba(239, 68, 68, 0.1)',         // Red
    hundreds: 'rgba(34, 197, 94, 0.1)',     // Green
    thousands: 'rgba(168, 85, 247, 0.1)',   // Purple
    tenThousands: 'rgba(236, 72, 153, 0.1)', // Pink
  }
}

export default function AdvancedStickMultiplication({
  num1,
  num2,
  autoPlay = false,
  onComplete,
  audioEnabled = true,
  hardMode = false
}: AdvancedStickMultiplicationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [showResult, setShowResult] = useState(false)
  const [showTutorial, setShowTutorial] = useState(hardMode)
  const [highlightedZone, setHighlightedZone] = useState<number | null>(null)
  
  const result = num1 * num2
  
  // Parse digits and group them by place value
  const parseNumber = (num: number) => {
    const str = num.toString()
    const digits = str.split('').map(Number)
    const length = digits.length
    
    return digits.map((digit, idx) => {
      const placeValue = length - idx - 1
      let color: string
      let name: string
      
      if (placeValue >= 2) {
        color = COLORS.hundreds
        name = 'Qindëshe'
      } else if (placeValue === 1) {
        color = COLORS.tens
        name = 'Dhjetëshe'
      } else {
        color = COLORS.units
        name = 'Njëshe'
      }
      
      return { digit, placeValue, color, name }
    })
  }
  
  const digits1 = parseNumber(num1)
  const digits2 = parseNumber(num2)
  
  // Generate animation steps
  const generateSteps = useCallback((): AnimationStep[] => {
    const steps: AnimationStep[] = []
    
    steps.push({
      type: 'intro',
      text: `Le të shumëzojmë ${num1} × ${num2} me metodën e shkopinjve!`
    })
    
    // Draw horizontal lines for num1 (grouped by place value)
    digits1.forEach((d, idx) => {
      const placeNames = ['qindëshe', 'dhjetëshe', 'njëshe']
      const actualPlaceName = d.placeValue >= 2 ? placeNames[0] : placeNames[d.placeValue === 1 ? 1 : 2]
      
      steps.push({
        type: 'draw_group',
        text: `Vizatojmë ${d.digit} vija ${d.name} (${d.digit} × ${actualPlaceName})`,
        highlight: { groupIndex: idx, isHorizontal: true }
      })
    })
    
    // Draw vertical lines for num2 (grouped by place value)
    digits2.forEach((d, idx) => {
      const placeNames = ['qindëshe', 'dhjetëshe', 'njëshe']
      const actualPlaceName = d.placeValue >= 2 ? placeNames[0] : placeNames[d.placeValue === 1 ? 1 : 2]
      
      steps.push({
        type: 'draw_group',
        text: `Vizatojmë ${d.digit} vija ${d.name} (${d.digit} × ${actualPlaceName})`,
        highlight: { groupIndex: idx, isHorizontal: false }
      })
    })
    
    // Count intersections in zones
    steps.push({
      type: 'intersections',
      text: 'Tani numërojmë kryqëzimet në çdo zonë diagonale!'
    })
    
    // Explain zones
    const numZones = digits1.length + digits2.length - 1
    for (let i = 0; i < numZones; i++) {
      const zoneNames = ['Njëshe', 'Dhjetëshe', 'Qindëshe', 'Mijëshe', 'Dhjetëmijëshe']
      steps.push({
        type: 'count_zone',
        text: `Zona ${i + 1}: ${zoneNames[i] || `Zona ${i + 1}`} - numëro pikat!`,
        highlight: { zoneIndex: i }
      })
    }
    
    // Show carry process if needed
    steps.push({
      type: 'carry',
      text: 'Mblidh numrat duke mbartë nëse nevojitet...'
    })
    
    steps.push({
      type: 'result',
      text: `Produkti është ${result}! 🎉`
    })
    
    return steps
  }, [num1, num2, digits1, digits2, result])
  
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
    
    // Background with grid
    ctx.fillStyle = '#fefce8' // Light yellow
    ctx.fillRect(0, 0, width, height)
    
    // Draw subtle grid
    ctx.strokeStyle = '#fef08a'
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
    
    // Calculate layout
    const margin = 60
    const lineSpacing = 15
    const groupGap = 30
    
    // Calculate total width/height needed for lines
    const calcGroupPositions = (digits: typeof digits1, isHorizontal: boolean) => {
      const positions: { start: number; lines: number[]; color: string }[] = []
      let offset = margin
      
      digits.forEach((d) => {
        const lines: number[] = []
        for (let i = 0; i < d.digit; i++) {
          lines.push(offset + i * lineSpacing)
        }
        positions.push({ start: offset, lines, color: d.color })
        offset += d.digit * lineSpacing + groupGap
      })
      
      return positions
    }
    
    const hPositions = calcGroupPositions(digits1, true)
    const vPositions = calcGroupPositions(digits2, false)
    
    // Draw diagonal zone overlays (if showing intersections)
    if (step >= digits1.length + digits2.length + 2) {
      const numZones = digits1.length + digits2.length - 1
      const zoneColors = [
        COLORS.zone.units,
        COLORS.zone.tens,
        COLORS.zone.hundreds,
        COLORS.zone.thousands,
        COLORS.zone.tenThousands,
      ]
      
      // Calculate zone boundaries
      const allH = hPositions.flatMap(p => p.lines)
      const allV = vPositions.flatMap(p => p.lines)
      
      for (let z = 0; z < numZones; z++) {
        if (highlightedZone !== null && highlightedZone !== z) continue
        
        ctx.fillStyle = highlightedZone === z ? 'rgba(251, 191, 36, 0.3)' : zoneColors[z] || 'rgba(0,0,0,0.05)'
        
        // Draw zone diagonal band
        const zoneWidth = 60
        const startX = z < digits2.length ? margin + z * (groupGap + lineSpacing * (digits2[Math.min(z, digits2.length - 1)]?.digit || 3)) : margin
        const startY = z < digits1.length ? margin + z * (groupGap + lineSpacing * (digits1[Math.min(z, digits1.length - 1)]?.digit || 3)) : margin
        
        // Simplified zone visualization
        ctx.beginPath()
        ctx.rect(startX - 10, startY - 10, 80, 80)
        ctx.fill()
      }
    }
    
    // Draw horizontal lines (num1) - grouped
    const drawStep = Math.max(0, step - 1)
    
    hPositions.forEach((group, groupIdx) => {
      if (drawStep <= groupIdx) return
      
      ctx.strokeStyle = group.color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      
      group.lines.forEach(y => {
        ctx.beginPath()
        ctx.moveTo(margin, y)
        ctx.lineTo(width - margin, y)
        ctx.stroke()
      })
      
      // Draw group label
      ctx.fillStyle = group.color
      ctx.font = 'bold 14px Comic Neue, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(digits1[groupIdx].digit.toString(), 10, group.lines[Math.floor(group.lines.length / 2)] + 5)
    })
    
    // Draw vertical lines (num2) - grouped
    const vDrawStep = Math.max(0, step - 1 - digits1.length)
    
    vPositions.forEach((group, groupIdx) => {
      if (vDrawStep <= groupIdx) return
      
      ctx.strokeStyle = group.color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      
      group.lines.forEach(x => {
        ctx.beginPath()
        ctx.moveTo(x, margin)
        ctx.lineTo(x, height - margin)
        ctx.stroke()
      })
      
      // Draw group label
      ctx.fillStyle = group.color
      ctx.font = 'bold 14px Comic Neue, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(digits2[groupIdx].digit.toString(), group.lines[Math.floor(group.lines.length / 2)], height - 15)
    })
    
    // Draw intersections
    if (step >= digits1.length + digits2.length + 2) {
      ctx.fillStyle = COLORS.intersection
      
      hPositions.forEach(hGroup => {
        hGroup.lines.forEach(y => {
          vPositions.forEach(vGroup => {
            vGroup.lines.forEach(x => {
              ctx.beginPath()
              ctx.arc(x, y, 5, 0, Math.PI * 2)
              ctx.fill()
            })
          })
        })
      })
    }
    
    // Draw result overlay
    if (showResult) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      const resultBoxWidth = 180
      const resultBoxHeight = 70
      const resultX = width / 2 - resultBoxWidth / 2
      const resultY = height / 2 - resultBoxHeight / 2
      
      // Rounded rectangle
      ctx.beginPath()
      ctx.roundRect(resultX, resultY, resultBoxWidth, resultBoxHeight, 16)
      ctx.fill()
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 36px Comic Neue, cursive'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`= ${result}`, width / 2, height / 2)
    }
    
  }, [step, digits1, digits2, showResult, result, highlightedZone])
  
  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return
    if (step >= steps.length) {
      setIsPlaying(false)
      setShowResult(true)
      onComplete?.()
      return
    }
    
    // Update highlighted zone
    const currentStep = steps[step]
    if (currentStep?.highlight?.zoneIndex !== undefined) {
      setHighlightedZone(currentStep.highlight.zoneIndex)
    } else {
      setHighlightedZone(null)
    }
    
    // Speak current step
    if (audioEnabled && steps[step]) {
      speak(steps[step].text)
    }
    
    const timer = setTimeout(() => {
      setStep(s => s + 1)
    }, 2500)
    
    return () => clearTimeout(timer)
  }, [step, isPlaying, steps, audioEnabled, onComplete])
  
  // Reset
  const handleReset = () => {
    setStep(0)
    setIsPlaying(false)
    setShowResult(false)
    setHighlightedZone(null)
  }
  
  // Manual step forward
  const handleNextStep = () => {
    if (step < steps.length) {
      const currentStep = steps[step]
      if (currentStep?.highlight?.zoneIndex !== undefined) {
        setHighlightedZone(currentStep.highlight.zoneIndex)
      } else {
        setHighlightedZone(null)
      }
      
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
    <div className="advanced-stick-container">
      {/* Tutorial Overlay (Hard Mode) */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <button 
              onClick={() => setShowTutorial(false)}
              className="tutorial-close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="tutorial-title">
              <Zap className="w-6 h-6 text-yellow-500" />
              Modaliteti i Vështirë
            </h3>
            
            <div className="tutorial-body">
              <p className="tutorial-intro">
                Për shumëzime të mëdha si <strong>{num1} × {num2}</strong>, 
                vizatojmë vijat të grupuara sipas vlerës:
              </p>
              
              <div className="color-guide">
                <div className="color-item">
                  <div className="color-box" style={{ background: COLORS.hundreds }} />
                  <span>Qindëshe (e gjelbër)</span>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ background: COLORS.tens }} />
                  <span>Dhjetëshe (e kuqe)</span>
                </div>
                <div className="color-item">
                  <div className="color-box" style={{ background: COLORS.units }} />
                  <span>Njëshe (blu)</span>
                </div>
              </div>
              
              <div className="tutorial-steps">
                <h4>Hapat:</h4>
                <ol>
                  <li>Vizato vijat horizontale për numrin e parë ({num1})</li>
                  <li>Vizato vijat vertikale për numrin e dytë ({num2})</li>
                  <li>Numëro pikat në çdo zonë diagonale</li>
                  <li><strong>Fillo nga ana e djathtë</strong> (njëshet)</li>
                  <li>Mbart numrat nëse zona ka më shumë se 9</li>
                </ol>
              </div>
              
              <button 
                onClick={() => setShowTutorial(false)}
                className="tutorial-start-btn"
              >
                <Play className="w-5 h-5" />
                Fillo!
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="stick-header">
        <h3 className="stick-title">
          📐 Shumëzimi me Shkopinj
          {hardMode && (
            <span className="hard-mode-badge">
              <Zap className="w-4 h-4" />
              Modalitet i Vështirë
            </span>
          )}
        </h3>
        
        <div className="problem-display">
          <span className="num num1">{num1}</span>
          <span className="operator">×</span>
          <span className="num num2">{num2}</span>
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
          width={450}
          height={350}
          className="stick-canvas"
        />
        
        {/* Legend */}
        <div className="stick-legend">
          {digits1.map((d, i) => (
            <div key={`h-${i}`} className="legend-item">
              <div className="legend-line" style={{ background: d.color }} />
              <span>{d.name}: {d.digit}</span>
            </div>
          ))}
          <div className="legend-separator">×</div>
          {digits2.map((d, i) => (
            <div key={`v-${i}`} className="legend-item">
              <div className="legend-line vertical" style={{ background: d.color }} />
              <span>{d.name}: {d.digit}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current step text */}
      <div className="step-display">
        <p className="step-text">
          {steps[Math.min(step, steps.length - 1)]?.text || 'Kliko "Luaj" për të filluar!'}
        </p>
        <div className="step-progress">
          Hapi {Math.min(step + 1, steps.length)} / {steps.length}
        </div>
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
        
        {hardMode && (
          <button 
            onClick={() => setShowTutorial(true)} 
            className="control-btn help"
          >
            <HelpCircle className="w-5 h-5" />
            Ndihmë
          </button>
        )}
      </div>
      
      {/* Zone explanation */}
      <div className="zone-explanation">
        <h4>Zonat Diagonale:</h4>
        <p>
          Fillo numërimin nga <strong>djathtas</strong> (njëshet) dhe ec majtas.
          Nëse një zonë ka më shumë se 9 pika, mbart shifrat në zonën tjetër.
        </p>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .advanced-stick-container {
          position: relative;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 1.5rem;
          padding: 1.5rem;
          border: 2px solid #86efac;
        }
        
        .tutorial-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }
        
        .tutorial-content {
          position: relative;
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          max-height: 90%;
          overflow-y: auto;
        }
        
        .tutorial-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }
        
        .tutorial-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        
        .tutorial-intro {
          color: #475569;
          margin-bottom: 1rem;
        }
        
        .color-guide {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
        }
        
        .color-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .color-box {
          width: 2rem;
          height: 0.5rem;
          border-radius: 2px;
        }
        
        .tutorial-steps {
          margin-bottom: 1.5rem;
        }
        
        .tutorial-steps h4 {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .tutorial-steps ol {
          padding-left: 1.5rem;
          color: #475569;
        }
        
        .tutorial-steps li {
          margin-bottom: 0.25rem;
        }
        
        .tutorial-start-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
        }
        
        .stick-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .stick-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          color: #1e293b;
          flex-wrap: wrap;
        }
        
        .hard-mode-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 9999px;
        }
        
        .problem-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          font-size: 1.75rem;
          font-weight: bold;
        }
        
        .num {
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
        }
        
        .num1 {
          background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
          color: #166534;
        }
        
        .num2 {
          background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
          color: #1e40af;
        }
        
        .operator, .equals {
          color: #64748b;
        }
        
        .result-value {
          color: #f59e0b;
          animation: pulse 1s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .stick-canvas-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .stick-canvas {
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .stick-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 0.75rem;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: #475569;
        }
        
        .legend-line {
          width: 1.5rem;
          height: 4px;
          border-radius: 2px;
        }
        
        .legend-line.vertical {
          width: 4px;
          height: 1.5rem;
        }
        
        .legend-separator {
          color: #94a3b8;
          font-weight: bold;
        }
        
        .step-display {
          text-align: center;
          margin-bottom: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 0.75rem;
        }
        
        .step-text {
          font-size: 1rem;
          color: #1e293b;
          font-weight: 500;
        }
        
        .step-progress {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .stick-controls {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        
        .control-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.625rem 1rem;
          border: none;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
        }
        
        .control-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .control-btn.primary {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
        }
        
        .control-btn.help {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }
        
        .zone-explanation {
          padding: 1rem;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-radius: 0.75rem;
          border: 2px solid #fde68a;
        }
        
        .zone-explanation h4 {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.5rem;
        }
        
        .zone-explanation p {
          font-size: 0.875rem;
          color: #78350f;
        }
        
        @media (max-width: 480px) {
          .stick-canvas {
            width: 100%;
            max-width: 350px;
            height: auto;
          }
          
          .problem-display {
            font-size: 1.25rem;
          }
          
          .stick-controls {
            flex-direction: column;
          }
          
          .control-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

// Practice component for hard problems
export function AdvancedStickPractice({
  onComplete
}: {
  onComplete?: (score: number) => void
}) {
  const [problems] = useState<[number, number][]>([
    [139, 15],
    [123, 12],
    [145, 13],
    [167, 14],
    [234, 11],
  ])
  const [currentProblem, setCurrentProblem] = useState(0)
  const [score, setScore] = useState(0)
  
  const handleComplete = () => {
    setScore(s => s + 20)
    
    if (currentProblem < problems.length - 1) {
      setTimeout(() => {
        setCurrentProblem(p => p + 1)
      }, 2000)
    } else {
      onComplete?.(score + 20)
    }
  }
  
  return (
    <div className="practice-container">
      <div className="practice-header">
        <span>Problemi {currentProblem + 1} / {problems.length}</span>
        <span className="practice-score">Pikë: {score}</span>
      </div>
      
      <AdvancedStickMultiplication
        key={currentProblem}
        num1={problems[currentProblem][0]}
        num2={problems[currentProblem][1]}
        onComplete={handleComplete}
        hardMode={true}
      />
      
      <style jsx>{`
        .practice-container {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .practice-header {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background: white;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .practice-score {
          color: #22c55e;
        }
      `}</style>
    </div>
  )
}
