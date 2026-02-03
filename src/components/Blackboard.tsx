'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

interface BlackboardProps {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division'
  numbers: [number, number]
  autoPlay?: boolean
  onComplete?: () => void
}

interface Step {
  text: string
  bubbleText?: string
  bubblePosition?: 'top' | 'units' | 'tens' | 'hundreds' | 'result' | 'center'
  highlight?: string
  action?: 'carry' | 'borrow' | 'result' | 'multiply' | 'divide'
  position?: { row: number; col: number }
  value?: number | string
}

// Speech bubble component that appears next to numbers
function SpeechBubble({ 
  text, 
  position,
  show,
  color = 'yellow'
}: { 
  text: string
  position: 'top' | 'units' | 'tens' | 'hundreds' | 'result' | 'center'
  show: boolean
  color?: 'yellow' | 'green' | 'orange' | 'blue'
}) {
  const positionClasses = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
    units: 'right-0 top-1/4',
    tens: 'right-0 top-1/2',
    hundreds: 'right-0 top-3/4',
    result: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }
  
  const colorClasses = {
    yellow: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    green: 'bg-green-100 border-green-400 text-green-800',
    orange: 'bg-orange-100 border-orange-400 text-orange-800',
    blue: 'bg-blue-100 border-blue-400 text-blue-800'
  }

  return (
    <div 
      className={`absolute z-20 transition-all duration-500 ${positionClasses[position]} ${
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <div className={`speech-bubble-mini ${colorClasses[color]} px-4 py-2 rounded-xl border-2 font-bold text-base max-w-[200px] whitespace-nowrap shadow-lg`}>
        {text}
      </div>
    </div>
  )
}

// Animated carry number that floats up
function CarryAnimation({ show, fromCol }: { show: boolean; fromCol: number }) {
  return (
    <div 
      className={`absolute transition-all duration-700 ease-out ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        right: `${fromCol * 45 + 5}px`,
        top: show ? '-30px' : '20px'
      }}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold flex items-center justify-center text-lg shadow-lg animate-bounce">
          +1
        </div>
        <span className="text-xs text-orange-600 font-bold mt-1">↑ bartim</span>
      </div>
    </div>
  )
}

// Borrow animation that shows crossing out and adding 10
function BorrowAnimation({ show, atCol }: { show: boolean; atCol: number }) {
  return (
    <div 
      className={`absolute transition-all duration-500 ${
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}
      style={{
        right: `${atCol * 45 + 5}px`,
        top: '-35px'
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-red-500 text-xl font-bold line-through">−1</span>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-lg">
          +10
        </div>
        <span className="text-xs text-blue-600 font-bold">huazim</span>
      </div>
    </div>
  )
}

// Main Blackboard component - NO AUDIO, uses speech bubbles
export default function Blackboard({ 
  type, 
  numbers, 
  autoPlay = false, 
  onComplete
}: BlackboardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [carries, setCarries] = useState<number[]>([])
  const [borrows, setBorrows] = useState<number[]>([])
  const [showFinalResult, setShowFinalResult] = useState(false)
  const [currentBubble, setCurrentBubble] = useState<{ text: string; position: string; color: string } | null>(null)

  const [a, b] = numbers
  
  // Generate steps based on operation type
  const generateSteps = useCallback((): Step[] => {
    const steps: Step[] = []
    
    if (type === 'addition') {
      const sum = a + b
      
      steps.push({ 
        text: `Le të mbledhim ${a} + ${b}`,
        bubbleText: `${a} + ${b} = ?`,
        bubblePosition: 'top'
      })
      
      // Units
      const unitsA = a % 10
      const unitsB = b % 10
      const unitsSum = unitsA + unitsB
      
      steps.push({ 
        text: `Njëshat: ${unitsA} + ${unitsB} = ${unitsSum}`,
        bubbleText: `${unitsA} + ${unitsB} = ${unitsSum}`,
        bubblePosition: 'units',
        highlight: 'units'
      })
      
      if (unitsSum >= 10) {
        steps.push({ 
          text: `E bartim 1-shin lart!`,
          bubbleText: `E bartim 1-shin lart! ↑`,
          bubblePosition: 'units',
          action: 'carry',
          position: { row: 0, col: 0 }
        })
      }
      
      // Tens
      const tensA = Math.floor((a % 100) / 10)
      const tensB = Math.floor((b % 100) / 10)
      const carry1 = unitsSum >= 10 ? 1 : 0
      const tensSum = tensA + tensB + carry1
      
      if (tensA > 0 || tensB > 0 || carry1 > 0) {
        steps.push({ 
          text: `Dhjetëshat: ${tensA} + ${tensB}${carry1 ? ' + 1' : ''} = ${tensSum}`,
          bubbleText: `${tensA} + ${tensB}${carry1 ? ' + 1' : ''} = ${tensSum}`,
          bubblePosition: 'tens',
          highlight: 'tens'
        })
        
        if (tensSum >= 10) {
          steps.push({ 
            text: `E bartim 1-shin lart!`,
            bubbleText: `Mbartim 1! ↑`,
            bubblePosition: 'tens',
            action: 'carry',
            position: { row: 0, col: 1 }
          })
        }
      }
      
      // Hundreds
      const hundredsA = Math.floor(a / 100)
      const hundredsB = Math.floor(b / 100)
      const carry2 = tensSum >= 10 ? 1 : 0
      const hundredsSum = hundredsA + hundredsB + carry2
      
      if (hundredsA > 0 || hundredsB > 0 || carry2 > 0) {
        steps.push({ 
          text: `Qindëshat: ${hundredsA} + ${hundredsB}${carry2 ? ' + 1' : ''} = ${hundredsSum}`,
          bubbleText: `${hundredsSum}`,
          bubblePosition: 'hundreds',
          highlight: 'hundreds'
        })
      }
      
      steps.push({ 
        text: `Përgjigja: ${sum}`,
        bubbleText: `= ${sum} 🎉`,
        bubblePosition: 'result',
        action: 'result'
      })
      
    } else if (type === 'subtraction') {
      const diff = a - b
      
      steps.push({ 
        text: `Le të zbresim ${a} - ${b}`,
        bubbleText: `${a} - ${b} = ?`,
        bubblePosition: 'top'
      })
      
      // Units
      const unitsA = a % 10
      const unitsB = b % 10
      
      steps.push({ 
        text: `Njëshat: ${unitsA} - ${unitsB}`,
        bubbleText: `${unitsA} - ${unitsB} = ?`,
        bubblePosition: 'units',
        highlight: 'units'
      })
      
      if (unitsA < unitsB) {
        steps.push({ 
          text: `${unitsA} < ${unitsB}, huazojmë 10!`,
          bubbleText: `Huazojmë 10! ↓`,
          bubblePosition: 'tens',
          action: 'borrow',
          position: { row: 0, col: 1 }
        })
        steps.push({ 
          text: `${unitsA + 10} - ${unitsB} = ${unitsA + 10 - unitsB}`,
          bubbleText: `${unitsA + 10} - ${unitsB} = ${unitsA + 10 - unitsB}`,
          bubblePosition: 'units'
        })
      } else {
        steps.push({
          text: `${unitsA} - ${unitsB} = ${unitsA - unitsB}`,
          bubbleText: `= ${unitsA - unitsB}`,
          bubblePosition: 'units'
        })
      }
      
      // Tens
      const tensA = Math.floor((a % 100) / 10)
      const tensB = Math.floor((b % 100) / 10)
      const borrowed = unitsA < unitsB ? 1 : 0
      const newTensA = tensA - borrowed
      
      if (tensA > 0 || tensB > 0) {
        steps.push({ 
          text: `Dhjetëshat: ${newTensA} - ${tensB} = ${newTensA - tensB}`,
          bubbleText: `${newTensA} - ${tensB} = ${newTensA - tensB}`,
          bubblePosition: 'tens',
          highlight: 'tens'
        })
      }
      
      steps.push({ 
        text: `Përgjigja: ${diff}`,
        bubbleText: `= ${diff} 🎉`,
        bubblePosition: 'result',
        action: 'result'
      })
      
    } else if (type === 'multiplication') {
      const product = a * b
      
      steps.push({ 
        text: `Le të shumëzojmë ${a} × ${b}`,
        bubbleText: `${a} × ${b} = ?`,
        bubblePosition: 'top'
      })
      
      steps.push({ 
        text: `${a} grupe me nga ${b}`,
        bubbleText: `${a} grupe × ${b}`,
        bubblePosition: 'center',
        highlight: 'groups'
      })
      
      if (a <= 5 && b <= 10) {
        const additionStr = Array(a).fill(b).join(' + ')
        steps.push({ 
          text: `${additionStr} = ${product}`,
          bubbleText: `${additionStr}`,
          bubblePosition: 'center'
        })
      }
      
      steps.push({ 
        text: `Përgjigja: ${product}`,
        bubbleText: `= ${product} 🎉`,
        bubblePosition: 'result',
        action: 'result'
      })
      
    } else if (type === 'division') {
      const quotient = Math.floor(a / b)
      const remainder = a % b
      
      steps.push({ 
        text: `Le të pjesëtojmë ${a} ÷ ${b}`,
        bubbleText: `${a} ÷ ${b} = ?`,
        bubblePosition: 'top'
      })
      
      steps.push({ 
        text: `Sa herë hyn ${b} në ${a}?`,
        bubbleText: `${b} × ? = ${a}`,
        bubblePosition: 'center'
      })
      
      steps.push({ 
        text: `${b} × ${quotient} = ${b * quotient}`,
        bubbleText: `${b} × ${quotient} = ${b * quotient}`,
        bubblePosition: 'center',
        highlight: 'quotient'
      })
      
      if (remainder > 0) {
        steps.push({ 
          text: `Mbetja: ${a} - ${b * quotient} = ${remainder}`,
          bubbleText: `Mbetja = ${remainder}`,
          bubblePosition: 'result'
        })
        steps.push({ 
          text: `Përgjigja: ${quotient} mbetje ${remainder}`,
          bubbleText: `= ${quotient} mb. ${remainder} 🎉`,
          bubblePosition: 'result',
          action: 'result'
        })
      } else {
        steps.push({ 
          text: `Përgjigja: ${quotient}`,
          bubbleText: `= ${quotient} 🎉`,
          bubblePosition: 'result',
          action: 'result'
        })
      }
    }
    
    return steps
  }, [type, a, b])

  const steps = generateSteps()

  // Update bubble when step changes
  useEffect(() => {
    const step = steps[currentStep]
    if (step?.bubbleText) {
      setCurrentBubble({
        text: step.bubbleText,
        position: step.bubblePosition || 'center',
        color: step.action === 'carry' ? 'orange' : step.action === 'borrow' ? 'blue' : step.action === 'result' ? 'green' : 'yellow'
      })
    }
  }, [currentStep, steps])

  // Auto-play steps
  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= steps.length) {
      setIsPlaying(false)
      setShowFinalResult(true)
      onComplete?.()
      return
    }

    const step = steps[currentStep]

    // Handle step actions
    if (step.action === 'carry' && step.position) {
      setTimeout(() => {
        setCarries(prev => [...prev, step.position!.col])
      }, 300)
    }
    
    if (step.action === 'borrow' && step.position) {
      setTimeout(() => {
        setBorrows(prev => [...prev, step.position!.col])
      }, 300)
    }

    // Move to next step
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, 2500)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, steps, onComplete])

  // Reset function
  const handleReset = () => {
    setCurrentStep(0)
    setCarries([])
    setBorrows([])
    setShowFinalResult(false)
    setIsPlaying(false)
    setCurrentBubble(null)
  }

  // Next step
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setShowFinalResult(true)
      onComplete?.()
    }
    
    const step = steps[currentStep]
    if (step?.action === 'carry' && step.position) {
      setCarries(prev => [...prev, step.position!.col])
    }
    if (step?.action === 'borrow' && step.position) {
      setBorrows(prev => [...prev, step.position!.col])
    }
  }

  // Calculate result
  const getResult = () => {
    switch (type) {
      case 'addition': return a + b
      case 'subtraction': return a - b
      case 'multiplication': return a * b
      case 'division': return `${Math.floor(a / b)}${a % b ? ` mb. ${a % b}` : ''}`
    }
  }

  const getOperator = () => {
    switch (type) {
      case 'addition': return '+'
      case 'subtraction': return '-'
      case 'multiplication': return '×'
      case 'division': return '÷'
    }
  }

  return (
    <div className="blackboard-container">
      {/* Notebook paper background */}
      <div className="notebook-paper relative">
        {/* Red margin line */}
        <div className="margin-line" />
        
        {/* Content area */}
        <div className="notebook-content">
          {/* Title */}
          <h3 className="text-2xl font-handwriting text-blue-800 mb-6 text-center">
            {type === 'addition' && 'Mbledhja'}
            {type === 'subtraction' && 'Zbritja'}
            {type === 'multiplication' && 'Shumëzimi'}
            {type === 'division' && 'Pjesëtimi'}
          </h3>

          {/* Math problem display */}
          <div className="math-problem-display relative">
            <div className="vertical-problem relative">
              {/* Carry animations */}
              {carries.map((col, idx) => (
                <CarryAnimation key={idx} show={true} fromCol={col} />
              ))}
              
              {/* Borrow animations */}
              {borrows.map((col, idx) => (
                <BorrowAnimation key={idx} show={true} atCol={col} />
              ))}

              <div className="problem-row number-row">
                <span className="number text-4xl">{a}</span>
              </div>
              <div className="problem-row number-row">
                <span className="operator text-4xl">{getOperator()}</span>
                <span className="number text-4xl">{b}</span>
              </div>
              <div className="problem-line" />
              <div className={`problem-row result-row ${showFinalResult ? 'show' : ''}`}>
                <span className="result-number text-4xl">{getResult()}</span>
              </div>
            </div>

            {/* Speech bubble */}
            {currentBubble && (
              <SpeechBubble 
                text={currentBubble.text}
                position={currentBubble.position as any}
                show={true}
                color={currentBubble.color as any}
              />
            )}
          </div>

          {/* Current step explanation - BIG TEXT */}
          <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl">
            <p className="text-xl font-bold text-center text-slate-700">
              {steps[Math.min(currentStep, steps.length - 1)]?.text}
            </p>
          </div>

          {/* Visual representation for multiplication */}
          {type === 'multiplication' && currentStep > 0 && a <= 5 && b <= 10 && (
            <div className="visual-groups mt-6">
              {Array.from({ length: a }).map((_, groupIdx) => (
                <div key={groupIdx} className="group-box">
                  {Array.from({ length: b }).map((_, itemIdx) => (
                    <span key={itemIdx} className="group-item text-2xl">⭐</span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Visual representation for division */}
          {type === 'division' && currentStep > 0 && a <= 20 && (
            <div className="division-visual mt-6">
              <div className="items-to-divide">
                {Array.from({ length: a }).map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`divide-item text-2xl ${idx < Math.floor(a / b) * b ? 'distributed' : 'remainder'}`}
                  >
                    🍬
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls - LARGE BUTTONS */}
        <div className="blackboard-controls flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="control-btn play-btn px-6 py-4 text-lg"
            disabled={currentStep >= steps.length && showFinalResult}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span className="ml-2">{isPlaying ? 'Ndalo' : 'Luaj'}</span>
          </button>
          
          <button
            onClick={handleNextStep}
            className="control-btn px-6 py-4 text-lg bg-blue-500 text-white hover:bg-blue-600"
            disabled={isPlaying || (currentStep >= steps.length - 1 && showFinalResult)}
          >
            <ChevronRight className="w-6 h-6" />
            <span className="ml-2">Hapi tjetër</span>
          </button>
          
          <button
            onClick={handleReset}
            className="control-btn reset-btn px-6 py-4 text-lg"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="ml-2">Fillo përsëri</span>
          </button>
        </div>
      </div>

      {/* Celebration when complete */}
      {showFinalResult && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <span className="celebration-emoji text-7xl">🎉</span>
            <p className="celebration-text text-3xl">Shkëlqyeshëm!</p>
          </div>
        </div>
      )}
    </div>
  )
}
