'use client'

import { useEffect, useRef, useState } from 'react'

interface MathAnimationProps {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division'
  numbers?: [number, number]
  autoPlay?: boolean
  onComplete?: () => void
}

// Animated blocks for addition
function AdditionAnimation({ numbers = [3, 4], onComplete }: { numbers: [number, number], onComplete?: () => void }) {
  const [step, setStep] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    // Animate step by step
    timers.push(setTimeout(() => setStep(1), 500))
    timers.push(setTimeout(() => setStep(2), 1500))
    timers.push(setTimeout(() => {
      setShowResult(true)
      onComplete?.()
    }, 2500))

    return () => timers.forEach(t => clearTimeout(t))
  }, [numbers, onComplete])

  const [a, b] = numbers
  const result = a + b

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Visual blocks */}
      <div className="flex items-center gap-8">
        {/* First group */}
        <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="flex flex-wrap gap-2 max-w-[150px] justify-center p-4 bg-blue-100 rounded-2xl">
            {Array.from({ length: a }).map((_, i) => (
              <div 
                key={i}
                className="w-10 h-10 bg-blue-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                🔵
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-2xl font-bold text-blue-600">{a}</div>
        </div>

        {/* Plus sign */}
        <div className={`text-5xl font-bold text-indigo-500 transition-all duration-500 ${
          step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          +
        </div>

        {/* Second group */}
        <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="flex flex-wrap gap-2 max-w-[150px] justify-center p-4 bg-green-100 rounded-2xl">
            {Array.from({ length: b }).map((_, i) => (
              <div 
                key={i}
                className="w-10 h-10 bg-green-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold"
                style={{ animationDelay: `${(a + i) * 100}ms` }}
              >
                🟢
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-2xl font-bold text-green-600">{b}</div>
        </div>
      </div>

      {/* Arrow */}
      <div className={`text-4xl transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        ⬇️
      </div>

      {/* Combined result */}
      <div className={`transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="flex flex-wrap gap-2 max-w-[300px] justify-center p-4 bg-purple-100 rounded-2xl border-4 border-purple-300">
          {Array.from({ length: a }).map((_, i) => (
            <div key={`a-${i}`} className="w-10 h-10 bg-blue-500 rounded-lg shadow-md">🔵</div>
          ))}
          {Array.from({ length: b }).map((_, i) => (
            <div key={`b-${i}`} className="w-10 h-10 bg-green-500 rounded-lg shadow-md">🟢</div>
          ))}
        </div>
      </div>

      {/* Equation */}
      <div className={`text-4xl font-bold transition-all duration-500 ${showResult ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <span className="text-blue-600">{a}</span>
        <span className="text-indigo-500"> + </span>
        <span className="text-green-600">{b}</span>
        <span className="text-slate-600"> = </span>
        <span className="text-purple-600 animate-bounce-fun">{result}</span>
      </div>
    </div>
  )
}

// Animated subtraction
function SubtractionAnimation({ numbers = [7, 3], onComplete }: { numbers: [number, number], onComplete?: () => void }) {
  const [step, setStep] = useState(0)
  const [crossedOut, setCrossedOut] = useState<number[]>([])
  const [a, b] = numbers
  const result = a - b

  useEffect(() => {
    // Reset state when numbers change
    setStep(0)
    setCrossedOut([])
    
    const timers: NodeJS.Timeout[] = []
    
    timers.push(setTimeout(() => setStep(1), 500))
    
    // Cross out items one by one - from the END of the array
    for (let i = 0; i < b; i++) {
      timers.push(setTimeout(() => {
        setCrossedOut(prev => [...prev, a - 1 - i]) // Cross from end
      }, 1000 + i * 400))
    }
    
    timers.push(setTimeout(() => {
      setStep(2)
      onComplete?.()
    }, 1000 + b * 400 + 500))

    return () => {
      timers.forEach(t => clearTimeout(t))
    }
  }, [a, b, onComplete])

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Starting items */}
      <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-center text-lg text-slate-600 mb-4">Kemi {a} mollë:</p>
        <div className="flex flex-wrap gap-3 max-w-[350px] justify-center p-4 bg-red-50 rounded-2xl">
          {Array.from({ length: a }).map((_, i) => (
            <div 
              key={i}
              className={`w-14 h-14 text-3xl flex items-center justify-center transition-all duration-300 relative ${
                crossedOut.includes(i) 
                  ? 'opacity-30 scale-75' 
                  : ''
              }`}
            >
              🍎
              {crossedOut.includes(i) && (
                <span className="absolute text-red-500 text-4xl font-bold">✗</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Taking away - show target number, not animated count */}
      {step >= 1 && (
        <div className="text-xl text-slate-600 animate-hint-reveal">
          Heqim {b} mollë... 🚶
          {crossedOut.length > 0 && crossedOut.length < b && (
            <span className="ml-2 text-orange-500">({crossedOut.length}/{b})</span>
          )}
        </div>
      )}

      {/* Result */}
      <div className={`transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <p className="text-center text-lg text-slate-600 mb-2">Na mbeten:</p>
        <div className="flex flex-wrap gap-3 max-w-[300px] justify-center p-4 bg-green-50 rounded-2xl border-4 border-green-300">
          {Array.from({ length: result }).map((_, i) => (
            <div key={i} className="w-14 h-14 text-3xl animate-bounce-fun" style={{ animationDelay: `${i * 100}ms` }}>
              🍎
            </div>
          ))}
        </div>
      </div>

      {/* Equation */}
      <div className={`text-4xl font-bold transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-red-500">{a}</span>
        <span className="text-slate-600"> - </span>
        <span className="text-orange-500">{b}</span>
        <span className="text-slate-600"> = </span>
        <span className="text-green-600 animate-bounce-fun">{result}</span>
      </div>
    </div>
  )
}

// Animated multiplication (groups)
function MultiplicationAnimation({ numbers = [3, 4], onComplete }: { numbers: [number, number], onComplete?: () => void }) {
  const [step, setStep] = useState(0)
  const [visibleGroups, setVisibleGroups] = useState(0)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    const [groups] = numbers
    
    timers.push(setTimeout(() => setStep(1), 500))
    
    // Show groups one by one
    for (let i = 0; i < groups; i++) {
      timers.push(setTimeout(() => {
        setVisibleGroups(i + 1)
      }, 800 + i * 600))
    }
    
    timers.push(setTimeout(() => {
      setStep(2)
      onComplete?.()
    }, 800 + groups * 600 + 500))

    return () => timers.forEach(t => clearTimeout(t))
  }, [numbers, onComplete])

  const [groups, itemsPerGroup] = numbers
  const result = groups * itemsPerGroup

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <p className={`text-xl text-slate-600 transition-all ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        {groups} grupe me nga {itemsPerGroup} yje:
      </p>

      {/* Groups */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Array.from({ length: groups }).map((_, groupIndex) => (
          <div 
            key={groupIndex}
            className={`p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-300 transition-all duration-500 ${
              groupIndex < visibleGroups 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-50'
            }`}
          >
            <div className="flex flex-wrap gap-2 justify-center max-w-[100px]">
              {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
                <span key={itemIndex} className="text-2xl">⭐</span>
              ))}
            </div>
            <div className="text-center mt-2 text-sm font-bold text-yellow-700">
              Grupi {groupIndex + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Counting */}
      {visibleGroups > 0 && (
        <div className="text-lg text-slate-600">
          {Array.from({ length: visibleGroups }).map((_, i) => (
            <span key={i}>
              {itemsPerGroup}
              {i < visibleGroups - 1 && ' + '}
            </span>
          ))}
          {visibleGroups === groups && ` = ${result}`}
        </div>
      )}

      {/* Equation */}
      <div className={`text-4xl font-bold transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-yellow-600">{groups}</span>
        <span className="text-slate-600"> × </span>
        <span className="text-orange-500">{itemsPerGroup}</span>
        <span className="text-slate-600"> = </span>
        <span className="text-green-600 animate-bounce-fun">{result}</span>
      </div>
    </div>
  )
}

// Animated division
function DivisionAnimation({ numbers = [12, 3], onComplete }: { numbers: [number, number], onComplete?: () => void }) {
  const [step, setStep] = useState(0)
  const [distributed, setDistributed] = useState<number[][]>([])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    const [total, groups] = numbers
    const perGroup = total / groups
    
    timers.push(setTimeout(() => setStep(1), 500))
    
    // Distribute items
    for (let round = 0; round < perGroup; round++) {
      timers.push(setTimeout(() => {
        setDistributed(prev => {
          const newDist = [...prev]
          for (let g = 0; g < groups; g++) {
            if (!newDist[g]) newDist[g] = []
            newDist[g] = [...newDist[g], round * groups + g]
          }
          return newDist
        })
      }, 1000 + round * 800))
    }
    
    timers.push(setTimeout(() => {
      setStep(2)
      onComplete?.()
    }, 1000 + perGroup * 800 + 500))

    return () => timers.forEach(t => clearTimeout(t))
  }, [numbers, onComplete])

  const [total, groups] = numbers
  const result = total / groups

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <p className={`text-xl text-slate-600 transition-all ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        Ndajmë {total} bonbone në {groups} qese të barabarta:
      </p>

      {/* Source pile */}
      <div className={`transition-all ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-wrap gap-1 max-w-[200px] justify-center p-3 bg-pink-100 rounded-xl">
          {Array.from({ length: total }).map((_, i) => {
            const isDistributed = distributed.flat().includes(i)
            return (
              <span 
                key={i} 
                className={`text-xl transition-all duration-300 ${isDistributed ? 'opacity-20 scale-50' : ''}`}
              >
                🍬
              </span>
            )
          })}
        </div>
      </div>

      {/* Groups */}
      <div className="flex gap-4 justify-center flex-wrap">
        {Array.from({ length: groups }).map((_, groupIndex) => (
          <div 
            key={groupIndex}
            className="p-4 bg-blue-50 rounded-2xl border-3 border-blue-300 min-w-[80px]"
          >
            <div className="text-2xl mb-2 text-center">🛍️</div>
            <div className="flex flex-wrap gap-1 justify-center min-h-[40px]">
              {(distributed[groupIndex] || []).map((_, i) => (
                <span key={i} className="text-xl animate-bounce-fun">🍬</span>
              ))}
            </div>
            <div className="text-center mt-2 text-sm font-bold text-blue-700">
              Qesja {groupIndex + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Equation */}
      <div className={`text-4xl font-bold transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-pink-600">{total}</span>
        <span className="text-slate-600"> ÷ </span>
        <span className="text-blue-500">{groups}</span>
        <span className="text-slate-600"> = </span>
        <span className="text-green-600 animate-bounce-fun">{result}</span>
      </div>
    </div>
  )
}

// Main component
export default function MathAnimation({ type, numbers, autoPlay = true, onComplete }: MathAnimationProps) {
  const defaultNumbers: Record<string, [number, number]> = {
    addition: [3, 4],
    subtraction: [7, 3],
    multiplication: [3, 4],
    division: [12, 3],
  }

  const nums = numbers || defaultNumbers[type]

  switch (type) {
    case 'addition':
      return <AdditionAnimation numbers={nums} onComplete={onComplete} />
    case 'subtraction':
      return <SubtractionAnimation numbers={nums} onComplete={onComplete} />
    case 'multiplication':
      return <MultiplicationAnimation numbers={nums} onComplete={onComplete} />
    case 'division':
      return <DivisionAnimation numbers={nums} onComplete={onComplete} />
    default:
      return null
  }
}
