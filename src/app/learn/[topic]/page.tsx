'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getLessonByTopicId, LessonStep } from '@/data/lessons'
import { getTopicById } from '@/data/questions'
import { loadGameState, saveGameState, updateDailyStreak } from '@/lib/gameState'
import Mascot from '@/components/Mascot'
import MathAnimation from '@/components/MathAnimation'
import Blackboard from '@/components/Blackboard'
import { ArrowLeft, ArrowRight, Play, CheckCircle, BookOpen, Sparkles } from 'lucide-react'

type ViewMode = 'visual' | 'blackboard'

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topic as string

  const [currentStep, setCurrentStep] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('blackboard')

  const lesson = getLessonByTopicId(topicId)
  const topic = getTopicById(topicId)

  useEffect(() => {
    // Update daily streak when starting a lesson
    const state = loadGameState()
    const newState = updateDailyStreak(state)
    saveGameState(newState)
  }, [topicId])

  if (!lesson || !topic) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-fun-gradient">
        <div className="text-2xl text-slate-400">Mësimi nuk u gjet...</div>
      </div>
    )
  }

  const step = lesson.steps[currentStep]
  const isLastStep = currentStep === lesson.steps.length - 1
  const isAnimationStep = step.type === 'animation'

  // Get animation type mapping
  const getBlackboardType = (animationType?: string): 'addition' | 'subtraction' | 'multiplication' | 'division' => {
    switch (animationType) {
      case 'addition': return 'addition'
      case 'subtraction': return 'subtraction'
      case 'multiplication': return 'multiplication'
      case 'division': return 'division'
      default: return 'addition'
    }
  }

  const handleNext = () => {
    if (isLastStep) {
      setLessonCompleted(true)
    } else {
      setCurrentStep(prev => prev + 1)
      setAnimationComplete(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setAnimationComplete(false)
    }
  }

  const handleStartQuiz = () => {
    router.push(`/quiz/${topicId}`)
  }

  // Render step content
  const renderStepContent = (step: LessonStep) => {
    switch (step.type) {
      case 'intro':
      case 'summary':
        return (
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-slate-700 text-lg leading-relaxed">
              {step.contentAl.split('\n').map((line, i) => {
                if (line.startsWith('✅') || line.startsWith('🔢') || line.startsWith('📝')) {
                  return (
                    <div key={i} className="flex items-start gap-3 my-3 p-3 bg-white/50 rounded-xl">
                      <span className="text-2xl">{line.slice(0, 2)}</span>
                      <span className="flex-1">{line.slice(2)}</span>
                    </div>
                  )
                }
                return <p key={i} className="my-2">{line}</p>
              })}
            </div>
          </div>
        )

      case 'animation':
        return (
          <div className="space-y-4">
            {/* View mode toggle - NO AUDIO */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setViewMode('blackboard')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-lg font-bold ${
                  viewMode === 'blackboard' 
                    ? 'bg-indigo-500 text-white shadow-lg' 
                    : 'bg-white/60 text-slate-600 hover:bg-white'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                Fletore
              </button>
              <button
                onClick={() => setViewMode('visual')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-lg font-bold ${
                  viewMode === 'visual' 
                    ? 'bg-indigo-500 text-white shadow-lg' 
                    : 'bg-white/60 text-slate-600 hover:bg-white'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Vizuale
              </button>
            </div>

            {/* Animation content - NO AUDIO PROP */}
            <div className="animation-container rounded-2xl overflow-hidden">
              {viewMode === 'blackboard' ? (
                <Blackboard
                  type={getBlackboardType(step.animationType)}
                  numbers={step.animationNumbers || [5, 3]}
                  onComplete={() => setAnimationComplete(true)}
                />
              ) : (
                <MathAnimation
                  type={step.animationType!}
                  numbers={step.animationNumbers}
                  onComplete={() => setAnimationComplete(true)}
                />
              )}
            </div>
          </div>
        )

      case 'example':
        return (
          <div className="space-y-4">
            <div className="prose prose-lg max-w-none">
              {step.contentAl.split('\n').map((line, i) => {
                if (line.includes('**')) {
                  const parts = line.split('**')
                  return (
                    <div key={i} className="my-4 p-4 bg-white rounded-xl shadow">
                      {parts.map((part, j) => 
                        j % 2 === 1 
                          ? <strong key={j} className="text-indigo-600">{part}</strong>
                          : <span key={j}>{part}</span>
                      )}
                    </div>
                  )
                }
                if (line.trim()) {
                  return <p key={i} className="text-slate-700">{line}</p>
                }
                return null
              })}
            </div>
            {step.tipAl && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <span className="text-2xl">💡</span>
                <p className="text-yellow-800 font-medium">{step.tipAl}</p>
              </div>
            )}
          </div>
        )

      default:
        return <p className="text-slate-700">{step.contentAl}</p>
    }
  }

  // Lesson completed view
  if (lessonCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-fun-gradient">
        <div className="card-fun max-w-lg w-full text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Mësimi Përfundoi!
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Tani di gjithçka për {topic.titleAl.toLowerCase()}. 
            Je gati për kuizin?
          </p>
          
          <Mascot 
            mood="celebrating" 
            message="Bravo! Tani le të praktikojmë!"
            size="lg"
          />
          
          <div className="flex flex-col gap-3 mt-8">
            <button onClick={handleStartQuiz} className="btn-fun flex items-center justify-center gap-2 text-xl py-5">
              <Play className="w-6 h-6" />
              Fillo Kuizin
            </button>
            <Link href="/" className="btn-secondary-fun text-center text-lg py-4">
              Kthehu te Temat
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 bg-fun-gradient">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Kthehu</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">{topic.icon}</span>
              <span className="font-bold text-slate-800">{lesson.titleAl}</span>
            </div>
            
            <div className="text-sm text-slate-500">
              {currentStep + 1} / {lesson.steps.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 progress-fill rounded-full"
              style={{ width: `${((currentStep + 1) / lesson.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Step card */}
        <div className="learn-step mb-6">
          {/* Step title */}
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {currentStep + 1}
            </span>
            {step.titleAl}
          </h2>

          {/* Step content */}
          <div className="mb-6">
            {renderStepContent(step)}
          </div>
        </div>

        {/* Mascot with message */}
        {step.mascotMessage && (
          <div className="mb-6 flex justify-center">
            <Mascot 
              mood={step.type === 'summary' ? 'celebrating' : 'happy'}
              message={step.mascotMessage}
              size="md"
            />
          </div>
        )}
      </main>

      {/* Navigation - BIGGER BUTTONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="btn-secondary-fun flex items-center gap-2 disabled:opacity-50 text-lg py-4 px-6"
          >
            <ArrowLeft className="w-6 h-6" />
            Mbrapa
          </button>

          {/* Step indicators */}
          <div className="hidden sm:flex gap-2">
            {lesson.steps.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentStep 
                    ? 'bg-indigo-500 scale-125' 
                    : i < currentStep 
                      ? 'bg-green-400' 
                      : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isAnimationStep && !animationComplete}
            className="btn-fun flex items-center gap-2 text-lg py-4 px-6"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Përfundo
              </>
            ) : (
              <>
                Vazhdo
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
