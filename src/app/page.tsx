'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { al } from '@/lib/i18n'
import { 
  loadGameState, 
  GameState, 
  MASTERY_THRESHOLD, 
  getLevelProgress,
  getLevelName,
  getLast7DaysActivity
} from '@/lib/gameState'
import { loadUserSettings, isOnboardingComplete, UserSettings } from '@/lib/userSettings'
import { topics } from '@/data/questions'
import Mascot from '@/components/Mascot'
import XPToast from '@/components/XPToast'
import { 
  Trophy, 
  Star, 
  Flame, 
  Lock, 
  CheckCircle, 
  BookOpen, 
  Play, 
  Sparkles,
  Zap,
  Calendar,
  TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [showXPToast, setShowXPToast] = useState(false)
  const [xpGained, setXpGained] = useState(0)

  useEffect(() => {
    // Check if onboarding is complete
    if (!isOnboardingComplete()) {
      router.push('/welcome')
      return
    }
    
    setUserSettings(loadUserSettings())
    setGameState(loadGameState())
    
    // Check for XP gained from PowerUp (stored temporarily)
    const pendingXP = sessionStorage.getItem('pending-xp-toast')
    if (pendingXP) {
      const xp = parseInt(pendingXP, 10)
      if (xp > 0) {
        setXpGained(xp)
        setShowXPToast(true)
        sessionStorage.removeItem('pending-xp-toast')
      }
    }
  }, [router])

  if (!gameState || !userSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-fun-gradient">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦉</div>
          <div className="text-2xl text-slate-600 font-medium">Duke ngarkuar...</div>
        </div>
      </div>
    )
  }

  const levelProgress = getLevelProgress(gameState.xp)
  const levelName = getLevelName(gameState.level)
  const last7Days = getLast7DaysActivity(gameState)
  const dayLabels = ['H', 'M', 'M', 'E', 'P', 'Sh', 'D']
  
  // Dynamic user name
  const userName = userSettings.name || 'Mik'

  return (
    <div className="min-h-screen bg-fun-gradient pb-8">
      {/* XP Toast notification */}
      {showXPToast && (
        <XPToast xp={xpGained} onComplete={() => setShowXPToast(false)} />
      )}

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 text-6xl opacity-20 animate-float">✨</div>
      <div className="fixed top-40 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="fixed bottom-20 left-20 text-6xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🌟</div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Header - Updated title */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <Mascot mood="happy" size="lg" showBubble={false} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Matematika për Klasën e 3
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Mirë se vjen, <span className="font-bold text-indigo-600">{userName}</span>! 👋
          </p>
        </header>

        {/* Level & XP Progress */}
        <div className="card-fun mb-6 !p-4">
          <div className="flex items-center gap-4">
            {/* Level badge */}
            <div className="flex-shrink-0">
              <div className="level-badge text-lg">
                <TrendingUp className="w-5 h-5" />
                <span>Niv. {gameState.level}</span>
              </div>
              <p className="text-xs text-center text-slate-500 mt-1">{levelName}</p>
            </div>
            
            {/* XP progress bar */}
            <div className="flex-1">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span className="font-medium">{al.xp}</span>
                <span>{levelProgress.current} / {levelProgress.needed}</span>
              </div>
              <div className="xp-bar">
                <div 
                  className="xp-fill"
                  style={{ width: `${levelProgress.percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="card-fun mb-6 !p-4">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-7 h-7 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800">{gameState.totalPoints}</div>
              <div className="text-sm text-slate-500">{al.points}</div>
            </div>
            
            <div className="h-16 w-px bg-slate-200" />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className={`w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center ${
                  gameState.currentStreak > 0 ? 'animate-pulse-glow' : ''
                }`}>
                  <Flame className="w-7 h-7 text-orange-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800">{gameState.currentStreak}</div>
              <div className="text-sm text-slate-500">{al.currentStreak}</div>
            </div>
            
            <div className="h-16 w-px bg-slate-200" />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-green-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800">{gameState.dailyStreak}</div>
              <div className="text-sm text-slate-500">{al.dailyStreak}</div>
            </div>
            
            <div className="h-16 w-px bg-slate-200" />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-purple-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800">{gameState.badges.length}</div>
              <div className="text-sm text-slate-500">Medalje</div>
            </div>
          </div>
          
          {/* 7-day activity calendar */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-center items-center gap-2">
              <span className="text-xs text-slate-500 mr-2">7 ditët e fundit:</span>
              <div className="daily-streak-calendar">
                {last7Days.map((day, idx) => (
                  <div 
                    key={idx}
                    className={`day-cell ${day && day.questionsAnswered > 0 ? 'active' : 'inactive'} ${idx === 6 ? 'today' : ''}`}
                    title={day ? `${day.questionsAnswered} pyetje, ${day.pointsEarned} pikë` : 'Asnjë aktivitet'}
                  >
                    {dayLabels[(new Date().getDay() - 6 + idx + 7) % 7]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Power Up Section */}
        <Link href="/power-up" className="block mb-8">
          <div className="card-fun !p-6 hover:scale-[1.02] transition-transform bg-gradient-to-r from-yellow-50 to-orange-50 !border-yellow-300">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {al.powerUp.title}
                  <span className="text-xs px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full">I RI!</span>
                </h3>
                <p className="text-slate-600">{al.powerUp.subtitle}</p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">🧮 Soroban</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">📐 Shkopinj</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">⏱️ Sfidë</span>
            </div>
          </div>
        </Link>

        {/* Topic Selection */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-yellow-500" />
            {al.selectTopic}
          </h2>
          
          <div className="grid gap-5 sm:grid-cols-2">
            {topics.map((topic, index) => {
              const progress = gameState.topicProgress[topic.id]
              const isUnlocked = progress?.unlocked ?? (index === 0)
              const mastery = progress?.mastery ?? 0
              const isMastered = mastery >= MASTERY_THRESHOLD
              const previousTopic = index > 0 ? topics[index - 1] : null
              
              // Topic-specific gradient colors
              const gradients: Record<string, string> = {
                mbledhja: 'from-green-400 to-emerald-500',
                zbritja: 'from-pink-400 to-rose-500',
                shumezimi: 'from-blue-400 to-indigo-500',
                pjestimi: 'from-purple-400 to-violet-500',
              }
              
              return (
                <div key={topic.id} className="relative">
                  {isUnlocked ? (
                    <div className={`card-topic ${isMastered ? 'ring-4 ring-yellow-400' : ''}`}>
                      {/* Mastery badge */}
                      {isMastered && (
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce-fun">
                          <CheckCircle className="w-6 h-6 text-yellow-900" />
                        </div>
                      )}
                      
                      {/* Topic header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[topic.id] || 'from-slate-400 to-slate-500'} 
                                        flex items-center justify-center text-3xl shadow-lg`}>
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800">
                            {topic.titleAl}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {topic.descriptionAl}
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span className="font-medium">{al.mastery}</span>
                          <span className="font-bold">{mastery}%</span>
                        </div>
                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full progress-fill rounded-full bg-gradient-to-r ${
                              isMastered 
                                ? 'from-yellow-400 to-yellow-500' 
                                : gradients[topic.id] || 'from-slate-400 to-slate-500'
                            }`}
                            style={{ width: `${mastery}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                        <span>{progress?.completed ?? 0} pyetje</span>
                        {(progress?.bestStreak ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-orange-500">
                            <Flame className="w-4 h-4" />
                            {progress.bestStreak} seria
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <Link 
                          href={`/learn/${topic.id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl 
                                     bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                        >
                          <BookOpen className="w-5 h-5" />
                          Mëso
                        </Link>
                        <Link 
                          href={`/quiz/${topic.id}`}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl 
                                     text-white font-bold transition-all hover:scale-105 bg-gradient-to-r ${gradients[topic.id]}`}
                        >
                          <Play className="w-5 h-5" />
                          Luaj
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="card-topic locked">
                      {/* Lock icon */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center shadow">
                        <Lock className="w-5 h-5 text-slate-500" />
                      </div>
                      
                      {/* Topic header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-3xl grayscale">
                          {topic.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-500">
                            {topic.titleAl}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {topic.descriptionAl}
                          </p>
                        </div>
                      </div>
                      
                      {/* Unlock hint */}
                      <div className="p-4 bg-slate-100 rounded-xl text-center">
                        <Lock className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500">
                          Arrij {MASTERY_THRESHOLD}% në <strong>{previousTopic?.titleAl}</strong> për ta hapur
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Badges Section */}
        {gameState.badges.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <Trophy className="w-7 h-7 text-yellow-500" />
              Medaljet e Tua
            </h2>
            <div className="card-fun">
              <div className="flex flex-wrap gap-3">
                {gameState.badges.map((badge) => (
                  <span key={badge.id} className="badge-fun">
                    🏆 {al.badges[badge.id as keyof typeof al.badges] || badge.id}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* How to play */}
        <section className="mt-8">
          <div className="card-fun bg-gradient-to-br from-indigo-50 to-purple-50 !border-indigo-200">
            <div className="flex items-start gap-4">
              <Mascot mood="thinking" size="sm" showBubble={false} />
              <div>
                <h3 className="font-bold text-indigo-800 mb-3 text-lg">Si të luash?</h3>
                <ul className="space-y-2 text-indigo-700">
                  <li className="flex items-center gap-2">
                    <span className="text-xl">📚</span> Kliko "Mëso" për të parë mësimin me animacione
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">🎮</span> Kliko "Luaj" për të filluar kuizin
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">✏️</span> Përdor hapësirën për shkrim me Apple Pencil
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">⚡</span> Provo "Power Up" për teknika të reja!
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">⭐</span> Arrij {MASTERY_THRESHOLD}% për të hapur temën tjetër
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
