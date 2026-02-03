'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { al } from '@/lib/i18n'
import { 
  loadGameState, 
  saveGameState, 
  updateAfterAnswer,
  updateAfterTriangle,
  checkBadges,
  GameState 
} from '@/lib/gameState'
import { getQuestionsForTopic, getTopicById, Question } from '@/data/questions'
import { getDragQuestionsForTopic, DragQuestion } from '@/data/dragQuestions'
import { getTriangleQuestionsForTopic, TriangleQuestion } from '@/data/triangleQuestions'
import SideScratchPad from '@/components/SideScratchPad'
import DragFillQuestion from '@/components/DragFillQuestion'
import TriangleProblem from '@/components/TriangleProblem'
import Mascot, { MascotReaction } from '@/components/Mascot'
import { 
  ArrowLeft, 
  Lightbulb, 
  Star, 
  Flame,
  ChevronRight,
  CheckCircle,
  XCircle,
  BookOpen,
  Grab,
  Triangle
} from 'lucide-react'

const QUESTIONS_PER_QUIZ = 10

// Combined question type
type QuizQuestion = 
  | (Question & { questionType: 'regular' })
  | (DragQuestion & { questionType: 'drag' })
  | (TriangleQuestion & { questionType: 'triangle' })

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topic as string

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [quizStats, setQuizStats] = useState({ correct: 0, points: 0 })
  const [isCorrect, setIsCorrect] = useState(false)
  const [newBadge, setNewBadge] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [triangleAnswered, setTriangleAnswered] = useState(false)

  const topic = getTopicById(topicId)
  const currentQuestion = questions[currentIndex]

  // Initialize quiz with mixed question types
  useEffect(() => {
    const state = loadGameState()
    setGameState(state)
    
    // Check if topic is unlocked
    if (!state.topicProgress[topicId]?.unlocked && topicId !== 'mbledhja') {
      router.push('/')
      return
    }
    
    // Get regular questions (reduced count to make room for triangles)
    const regularQuestions = getQuestionsForTopic(topicId, QUESTIONS_PER_QUIZ - 4)
      .map(q => ({ ...q, questionType: 'regular' as const }))
    
    // Get drag questions for variety
    const dragQs = getDragQuestionsForTopic(topicId)
    const selectedDragQuestions = dragQs
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(q => ({ ...q, questionType: 'drag' as const }))
    
    // Get triangle questions (2 per quiz)
    const triangleQs = getTriangleQuestionsForTopic(topicId, 2)
      .map(q => ({ ...q, questionType: 'triangle' as const }))
    
    // Mix them together
    const allQuestions = [...regularQuestions, ...selectedDragQuestions, ...triangleQs]
      .sort(() => Math.random() - 0.5)
    
    setQuestions(allQuestions)
  }, [topicId, router])

  // Create confetti
  const createConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  // Handle answer selection for regular questions
  const handleSelectAnswer = (answer: number) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  // Handle answer for regular and drag question types
  const handleAnswer = useCallback((correct: boolean, hintsUsed: number) => {
    if (!gameState) return

    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      createConfetti()
    }

    // Update game state
    const newState = updateAfterAnswer(gameState, topicId, correct, hintsUsed)
    
    // Check for new badges
    const { state: stateWithBadges, newBadges } = checkBadges(newState)
    
    if (newBadges.length > 0) {
      setNewBadge(newBadges[0])
      setTimeout(() => setNewBadge(null), 3000)
    }

    setGameState(stateWithBadges)
    saveGameState(stateWithBadges)

    // Update quiz stats
    if (correct) {
      let points = 10 - (hintsUsed * 2)
      points = Math.max(points, 1)
      setQuizStats(prev => ({
        correct: prev.correct + 1,
        points: prev.points + points
      }))
    }
  }, [gameState, topicId])

  // Handle triangle problem answer
  const handleTriangleAnswer = useCallback((answer: number, correct: boolean) => {
    if (!gameState || triangleAnswered) return

    setTriangleAnswered(true)
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      createConfetti()
    }

    // Update game state specifically for triangles (includes topic progress update)
    // Note: We only call updateAfterTriangle, NOT updateAfterAnswer, to avoid double points
    const newState = updateAfterTriangle(gameState, correct)
    
    // Check for new badges
    const { state: stateWithBadges, newBadges } = checkBadges(newState)
    
    if (newBadges.length > 0) {
      setNewBadge(newBadges[0])
      setTimeout(() => setNewBadge(null), 3000)
    }

    setGameState(stateWithBadges)
    saveGameState(stateWithBadges)

    // Update quiz stats
    if (correct) {
      setQuizStats(prev => ({
        correct: prev.correct + 1,
        points: prev.points + 15 // Triangle bonus
      }))
    }
  }, [gameState, topicId, triangleAnswered])

  // Check answer for regular questions
  const handleCheckAnswer = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion || currentQuestion.questionType !== 'regular') return
    const correct = selectedAnswer === currentQuestion.correctAnswer
    handleAnswer(correct, hintsRevealed)
  }, [selectedAnswer, currentQuestion, hintsRevealed, handleAnswer])

  // Move to next question
  const handleNextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      router.push(`/results?topic=${topicId}&correct=${quizStats.correct}&total=${questions.length}&points=${quizStats.points}`)
      return
    }

    setCurrentIndex(prev => prev + 1)
    setSelectedAnswer(null)
    setShowResult(false)
    setHintsRevealed(0)
    setIsCorrect(false)
    setTriangleAnswered(false)
  }

  // Reveal next hint
  const handleRevealHint = () => {
    if (!currentQuestion) return
    const maxHints = currentQuestion.hints.length
    if (hintsRevealed >= maxHints) return
    setHintsRevealed(prev => prev + 1)
  }

  // Loading state
  if (!gameState || questions.length === 0 || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-fun-gradient">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦉</div>
          <div className="text-2xl text-slate-600 font-medium">Duke ngarkuar...</div>
        </div>
      </div>
    )
  }

  const isDragQuestion = currentQuestion.questionType === 'drag'
  const isTriangleQuestion = currentQuestion.questionType === 'triangle'

  return (
    <div className="min-h-screen bg-fun-gradient">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#6366f1', '#f472b6', '#fbbf24', '#34d399', '#60a5fa'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Kthehu</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-3xl">{topic?.icon}</span>
              <span className="text-lg font-bold text-slate-800 hidden sm:inline">{topic?.titleAl}</span>
              {isDragQuestion && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <Grab className="w-3 h-3" /> Tërhiq
                </span>
              )}
              {isTriangleQuestion && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <Triangle className="w-3 h-3" /> Trekëndësh
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="star-counter">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-bold">{gameState.totalPoints}</span>
              </div>
              {gameState.currentStreak > 0 && (
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-5 h-5 streak-fire" />
                  <span className="font-bold">{gameState.currentStreak}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>{al.question} {currentIndex + 1} / {questions.length}</span>
              <span className="text-green-600 font-medium">{quizStats.correct} ✓</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 progress-fill rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Side by side layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="quiz-layout">
          {/* Question section */}
          <div className="quiz-content space-y-4">
            {/* Triangle Question */}
            {isTriangleQuestion ? (
              <div className={`card-fun transition-all duration-300 ${
                showResult ? (isCorrect ? 'animate-celebrate' : 'animate-shake') : ''
              }`}>
                <div className="text-xl font-bold text-slate-800 mb-4 text-center flex items-center justify-center gap-2">
                  <Triangle className="w-6 h-6 text-indigo-500" />
                  Gjej numrin që mungon!
                </div>
                
                <TriangleProblem
                  values={currentQuestion.values}
                  operation={currentQuestion.operation}
                  onAnswer={handleTriangleAnswer}
                  showHints={true}
                />
              </div>
            ) : (
              /* Regular Question Card */
              <div className={`card-fun transition-all duration-300 ${
                showResult ? (isCorrect ? 'animate-celebrate' : 'animate-shake') : ''
              }`}>
                {/* Question text */}
                <div className={`text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center leading-relaxed ${
                  currentQuestion.questionType === 'regular' && (currentQuestion as any).type === 'visual' 
                    ? 'visual-question question-visual-text' 
                    : ''
                }`}>
                  {currentQuestion.questionAl}
                </div>

                {/* Render based on question type */}
                {isDragQuestion && currentQuestion.type === 'drag_fill' ? (
                  <DragFillQuestion
                    equation={currentQuestion.equation}
                    options={currentQuestion.options}
                    correctAnswer={currentQuestion.correctAnswer}
                    hints={currentQuestion.hints}
                    onAnswer={handleAnswer}
                    showResult={showResult}
                    isCorrect={isCorrect}
                  />
                ) : currentQuestion.questionType === 'regular' ? (
                  <>
                    {/* Regular multiple choice options */}
                    <div className="grid grid-cols-2 gap-4">
                      {currentQuestion.options?.map((option, index) => {
                        let className = 'option-btn-fun'
                        
                        if (showResult) {
                          if (option === currentQuestion.correctAnswer) {
                            className += ' correct'
                          } else if (option === selectedAnswer && !isCorrect) {
                            className += ' incorrect'
                          }
                        } else if (option === selectedAnswer) {
                          className += ' selected'
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handleSelectAnswer(option)}
                            disabled={showResult}
                            className={className}
                          >
                            <span className="text-2xl">{option}</span>
                            {showResult && option === currentQuestion.correctAnswer && (
                              <CheckCircle className="inline ml-3 w-6 h-6 text-green-600" />
                            )}
                            {showResult && option === selectedAnswer && !isCorrect && (
                              <XCircle className="inline ml-3 w-6 h-6 text-red-600" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {/* Hints Section for regular questions */}
            {currentQuestion.questionType === 'regular' && hintsRevealed > 0 && (
              <div className="space-y-3">
                {currentQuestion.hints.slice(0, hintsRevealed).map((hint, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl animate-hint-reveal"
                  >
                    <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800 font-medium">{hint}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Result message with mascot for regular questions */}
            {showResult && currentQuestion.questionType === 'regular' && (
              <div className={`p-6 rounded-2xl text-center ${
                isCorrect 
                  ? 'bg-green-100 border-2 border-green-300' 
                  : 'bg-red-100 border-2 border-red-300'
              }`}>
                <MascotReaction type={isCorrect ? 'correct' : 'incorrect'} />
                {isCorrect && hintsRevealed === 0 && (
                  <p className="text-green-700 font-medium mt-2">+10 {al.points}! ⭐</p>
                )}
              </div>
            )}

            {/* New Badge notification */}
            {newBadge && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 
                              text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce-fun z-50">
                <p className="font-bold text-lg">🏆 {al.newBadge}</p>
                <p>{al.badges[newBadge as keyof typeof al.badges] || newBadge}</p>
              </div>
            )}

            {/* Action Buttons for regular questions */}
            {currentQuestion.questionType === 'regular' && (
              <div className="flex gap-4 pt-4">
                {!showResult && hintsRevealed < currentQuestion.hints.length && (
                  <button
                    onClick={handleRevealHint}
                    className="btn-secondary-fun flex items-center gap-2 flex-1"
                  >
                    <Lightbulb className="w-5 h-5" />
                    Ndihmë ({currentQuestion.hints.length - hintsRevealed})
                  </button>
                )}

                {!showResult ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                    className="btn-fun flex items-center justify-center gap-2 flex-1"
                  >
                    Kontrollo
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="btn-success flex items-center justify-center gap-2 flex-1"
                  >
                    {currentIndex >= questions.length - 1 ? 'Shiko Rezultatin' : 'Vazhdo'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Next button for drag questions after result */}
            {isDragQuestion && showResult && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleNextQuestion}
                  className="btn-success flex items-center justify-center gap-2"
                >
                  {currentIndex >= questions.length - 1 ? 'Shiko Rezultatin' : 'Vazhdo'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Next button for triangle questions after result */}
            {isTriangleQuestion && showResult && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleNextQuestion}
                  className="btn-success flex items-center justify-center gap-2"
                >
                  {currentIndex >= questions.length - 1 ? 'Shiko Rezultatin' : 'Vazhdo'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Learn mode link */}
            <Link 
              href={`/learn/${topicId}`}
              className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 py-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Shiko mësimin</span>
            </Link>
          </div>

          {/* Scratch Pad - Always visible on side */}
          <div className="scratch-panel">
            <SideScratchPad className="h-full min-h-[300px] lg:min-h-[500px]" />
          </div>
        </div>
      </main>
    </div>
  )
}
