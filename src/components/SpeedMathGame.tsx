'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Timer, 
  Zap, 
  Trophy, 
  Play, 
  RotateCcw,
  Star,
  Flame
} from 'lucide-react'

interface SpeedMathGameProps {
  duration?: 30 | 60 | 90
  difficulty?: 'easy' | 'medium' | 'hard'
  operations?: ('addition' | 'subtraction' | 'multiplication' | 'division')[]
  onComplete?: (score: number, correctAnswers: number, streak: number) => void
}

interface Problem {
  a: number
  b: number
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division'
  answer: number
}

interface LeaderboardEntry {
  score: number
  correct: number
  date: string
  duration: number
}

// Generate a random problem
function generateProblem(
  difficulty: 'easy' | 'medium' | 'hard',
  operations: ('addition' | 'subtraction' | 'multiplication' | 'division')[]
): Problem {
  const operation = operations[Math.floor(Math.random() * operations.length)]
  
  let a: number, b: number, answer: number
  
  const ranges = {
    easy: { add: 20, sub: 15, mul: 5, div: 20 },
    medium: { add: 100, sub: 50, mul: 10, div: 50 },
    hard: { add: 500, sub: 200, mul: 12, div: 100 }
  }
  
  const range = ranges[difficulty]
  
  switch (operation) {
    case 'addition':
      a = Math.floor(Math.random() * range.add) + 1
      b = Math.floor(Math.random() * range.add) + 1
      answer = a + b
      break
    case 'subtraction':
      a = Math.floor(Math.random() * range.sub) + 10
      b = Math.floor(Math.random() * Math.min(a, range.sub)) + 1
      answer = a - b
      break
    case 'multiplication':
      a = Math.floor(Math.random() * range.mul) + 1
      b = Math.floor(Math.random() * range.mul) + 1
      answer = a * b
      break
    case 'division':
      b = Math.floor(Math.random() * 9) + 2 // divisor 2-10
      answer = Math.floor(Math.random() * 10) + 1 // quotient 1-10
      a = b * answer // dividend
      break
  }
  
  return { a, b, operation, answer }
}

// Get operation symbol
function getOperationSymbol(op: 'addition' | 'subtraction' | 'multiplication' | 'division'): string {
  switch (op) {
    case 'addition': return '+'
    case 'subtraction': return '-'
    case 'multiplication': return '×'
    case 'division': return '÷'
  }
}

// Load leaderboard from localStorage
function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('speed-math-leaderboard')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Save to leaderboard
function saveToLeaderboard(entry: LeaderboardEntry): void {
  if (typeof window === 'undefined') return
  try {
    const leaderboard = loadLeaderboard()
    leaderboard.push(entry)
    leaderboard.sort((a, b) => b.score - a.score)
    const top10 = leaderboard.slice(0, 10)
    localStorage.setItem('speed-math-leaderboard', JSON.stringify(top10))
  } catch {
    // Ignore errors
  }
}

// NO AUDIO - Silent Speed Math Game
export default function SpeedMathGame({
  duration = 60,
  difficulty = 'easy',
  operations = ['addition', 'subtraction'],
  onComplete
}: SpeedMathGameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready')
  const [timeLeft, setTimeLeft] = useState<number>(duration)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isNewHighScore, setIsNewHighScore] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)

  // Load leaderboard
  useEffect(() => {
    setLeaderboard(loadLeaderboard())
  }, [])

  // Generate new problem
  const nextProblem = useCallback(() => {
    setProblem(generateProblem(difficulty, operations))
    setUserAnswer('')
    setFeedback(null)
    inputRef.current?.focus()
  }, [difficulty, operations])

  // Start game
  const startGame = () => {
    setGameState('playing')
    setTimeLeft(duration)
    setScore(0)
    setCorrectAnswers(0)
    setStreak(0)
    setBestStreak(0)
    setIsNewHighScore(false)
    nextProblem()
  }

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return
    
    if (timeLeft <= 0) {
      // Check for high score BEFORE saving (compare with existing leaderboard)
      const existingTopScore = loadLeaderboard()[0]?.score || 0
      const isHighScore = score > existingTopScore && score > 0
      
      setGameState('finished')
      
      // Save to leaderboard
      const entry: LeaderboardEntry = {
        score,
        correct: correctAnswers,
        date: new Date().toISOString(),
        duration
      }
      saveToLeaderboard(entry)
      setLeaderboard(loadLeaderboard())
      
      // Set high score flag
      if (isHighScore) {
        setIsNewHighScore(true)
      }
      
      onComplete?.(score, correctAnswers, bestStreak)
      return
    }
    
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameState, timeLeft, score, correctAnswers, bestStreak, duration, onComplete])

  // Check answer
  const checkAnswer = useCallback(() => {
    if (!problem || !userAnswer.trim()) return
    
    const userNum = parseInt(userAnswer, 10)
    const isCorrect = userNum === problem.answer
    
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    
    if (isCorrect) {
      // Calculate points (base + streak bonus + time bonus)
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30
      const streakBonus = Math.floor(streak / 3) * 5
      const timeBonus = Math.floor(timeLeft / 10)
      const points = basePoints + streakBonus + timeBonus
      
      setScore(s => s + points)
      setCorrectAnswers(c => c + 1)
      setStreak(s => s + 1)
      setBestStreak(b => Math.max(b, streak + 1))
      
      // Quick move to next problem
      setTimeout(nextProblem, 300)
    } else {
      setStreak(0)
      
      // Show correct answer briefly
      setTimeout(() => {
        nextProblem()
      }, 1000)
    }
  }, [problem, userAnswer, difficulty, streak, timeLeft, nextProblem])

  // Handle key down (replaces deprecated onKeyPress)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer()
    }
  }

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Timer color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-500'
    if (timeLeft <= 30) return 'text-orange-500'
    return 'text-green-500'
  }

  return (
    <div className="speed-math-container">
      {/* Header - No audio toggle */}
      <div className="speed-math-header">
        <h2 className="speed-math-title">
          <Zap className="w-6 h-6 text-yellow-500" />
          Matematikë e Shpejtë
        </h2>
      </div>

      {/* Ready state */}
      {gameState === 'ready' && (
        <div className="speed-math-ready">
          <div className="ready-content">
            <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Gati për sfidë?</h3>
            <p className="text-slate-600 mb-6">
              Zgjidh sa më shumë probleme brenda {duration} sekondave!
            </p>
            
            <div className="difficulty-badges mb-6">
              <span className={`difficulty-badge ${difficulty}`}>
                {difficulty === 'easy' ? 'I Lehtë' : difficulty === 'medium' ? 'Mesatar' : 'I Vështirë'}
              </span>
              <span className="operation-badges">
                {operations.map(op => (
                  <span key={op} className="operation-badge">
                    {getOperationSymbol(op)}
                  </span>
                ))}
              </span>
            </div>
            
            <button onClick={startGame} className="start-btn">
              <Play className="w-6 h-6" />
              Fillo!
            </button>
          </div>
          
          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div className="leaderboard-preview">
              <h4 className="leaderboard-title">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Rezultatet më të mira
              </h4>
              <div className="leaderboard-list">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="leaderboard-entry">
                    <span className="rank">#{idx + 1}</span>
                    <span className="score">{entry.score} pikë</span>
                    <span className="correct">{entry.correct} ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Playing state */}
      {gameState === 'playing' && problem && (
        <div className="speed-math-playing">
          {/* Stats bar */}
          <div className="stats-bar">
            <div className={`timer ${getTimerColor()}`}>
              <Timer className="w-5 h-5" />
              <span className="timer-value">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="score-display">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>{score}</span>
            </div>
            
            {streak >= 3 && (
              <div className="streak-display">
                <Flame className="w-5 h-5 text-orange-500 streak-fire" />
                <span>×{streak}</span>
              </div>
            )}
          </div>

          {/* Problem display */}
          <div className={`problem-card ${feedback ? feedback : ''}`}>
            <div className="problem-equation">
              <span className="num">{problem.a}</span>
              <span className="op">{getOperationSymbol(problem.operation)}</span>
              <span className="num">{problem.b}</span>
              <span className="equals">=</span>
              <span className="answer-box">
                {feedback === 'incorrect' ? (
                  <span className="correct-answer">{problem.answer}</span>
                ) : (
                  '?'
                )}
              </span>
            </div>
            
            {feedback && (
              <div className={`feedback-icon ${feedback}`}>
                {feedback === 'correct' ? '✓' : '✗'}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="answer-input-container">
            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              className="answer-input"
              placeholder="Shkruaj përgjigjen..."
              autoFocus
              disabled={feedback !== null}
            />
            <button 
              onClick={checkAnswer}
              className="submit-btn"
              disabled={!userAnswer.trim() || feedback !== null}
            >
              OK
            </button>
          </div>

          {/* Progress indicator */}
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(timeLeft / duration) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Finished state */}
      {gameState === 'finished' && (
        <div className="speed-math-finished">
          <div className={`result-card ${isNewHighScore ? 'high-score' : ''}`}>
            {isNewHighScore && (
              <div className="high-score-banner">
                <Trophy className="w-8 h-8" />
                Rekord i ri!
              </div>
            )}
            
            <h3 className="result-title">Koha mbaroi!</h3>
            
            <div className="result-stats">
              <div className="stat">
                <Star className="w-8 h-8 text-yellow-500" />
                <span className="stat-value">{score}</span>
                <span className="stat-label">Pikë</span>
              </div>
              
              <div className="stat">
                <span className="stat-icon">✓</span>
                <span className="stat-value">{correctAnswers}</span>
                <span className="stat-label">Saktë</span>
              </div>
              
              <div className="stat">
                <Flame className="w-8 h-8 text-orange-500" />
                <span className="stat-value">{bestStreak}</span>
                <span className="stat-label">Seria më e mirë</span>
              </div>
            </div>
            
            <button onClick={startGame} className="play-again-btn">
              <RotateCcw className="w-5 h-5" />
              Luaj përsëri
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Quick game modes
export function QuickAddition() {
  return <SpeedMathGame duration={30} difficulty="easy" operations={['addition']} />
}

export function QuickSubtraction() {
  return <SpeedMathGame duration={30} difficulty="easy" operations={['subtraction']} />
}

export function QuickMixed() {
  return <SpeedMathGame duration={60} difficulty="medium" operations={['addition', 'subtraction', 'multiplication']} />
}

export function SpeedMathChallenge() {
  return <SpeedMathGame duration={90} difficulty="hard" operations={['addition', 'subtraction', 'multiplication', 'division']} />
}
