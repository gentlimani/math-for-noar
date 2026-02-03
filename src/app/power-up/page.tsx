'use client'

import Link from 'next/link'
import { ArrowLeft, Zap, Calculator, Layers, Timer, Trophy, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PowerUpStats {
  sorobanCompleted: boolean
  sticksCompleted: boolean
  bestChallengeScore: number
}

function loadPowerUpStats(): PowerUpStats {
  if (typeof window === 'undefined') {
    return { sorobanCompleted: false, sticksCompleted: false, bestChallengeScore: 0 }
  }
  try {
    const data = localStorage.getItem('power-up-stats')
    return data ? JSON.parse(data) : { sorobanCompleted: false, sticksCompleted: false, bestChallengeScore: 0 }
  } catch {
    return { sorobanCompleted: false, sticksCompleted: false, bestChallengeScore: 0 }
  }
}

export default function PowerUpPage() {
  const [stats, setStats] = useState<PowerUpStats>({ 
    sorobanCompleted: false, 
    sticksCompleted: false, 
    bestChallengeScore: 0 
  })

  useEffect(() => {
    setStats(loadPowerUpStats())
  }, [])

  const modules = [
    {
      id: 'soroban',
      title: 'Soroban',
      subtitle: 'Llogaritësi Japonez',
      description: 'Mëso të llogaritësh me abakunin japonez - metodë e lashtë por shumë efikase!',
      icon: '🧮',
      href: '/power-up/soroban',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      completed: stats.sorobanCompleted,
    },
    {
      id: 'sticks',
      title: 'Shumëzimi me Shkopinj',
      subtitle: 'Metoda Kineze',
      description: 'Vizualizo shumëzimin me vijat - metodë e bukur dhe e qartë!',
      icon: '📐',
      href: '/power-up/sticks',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      completed: stats.sticksCompleted,
    },
    {
      id: 'challenge',
      title: 'Sfida e Shpejtësisë',
      subtitle: 'Testo shpejtësinë tënde!',
      description: 'Sa probleme mund të zgjidhësh brenda 60 sekondave?',
      icon: '⚡',
      href: '/power-up/challenge',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      bestScore: stats.bestChallengeScore,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kthehu</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Power Up!
              </span>
            </div>
            
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Super Fuqitë Matematikore
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto">
            Zbulo teknika të reja për të llogaritur më shpejt dhe më mirë!
          </p>
        </div>

        {/* Module cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className={`${module.bgColor} rounded-2xl p-6 border-2 border-white/50 shadow-lg 
                         hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
            >
              {/* Completed badge */}
              {module.completed && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
              )}
              
              {/* Best score badge */}
              {module.bestScore !== undefined && module.bestScore > 0 && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 rounded-full flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">{module.bestScore}</span>
                </div>
              )}
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} 
                             flex items-center justify-center text-3xl mb-4 shadow-md`}>
                {module.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {module.title}
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-3">
                {module.subtitle}
              </p>
              
              {/* Description */}
              <p className="text-slate-600 text-sm">
                {module.description}
              </p>
              
              {/* Action hint */}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600">
                <span>Fillo</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Info section */}
        <div className="mt-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-500" />
            Pse këto teknika?
          </h3>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 bg-orange-50 rounded-xl">
              <span className="text-2xl mb-2 block">🧮</span>
              <h4 className="font-bold text-slate-800 mb-1">Soroban</h4>
              <p className="text-sm text-slate-600">
                Përdoret në Japoni për mbi 400 vjet. Zhvillon mendjen dhe shpejtësinë!
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl">
              <span className="text-2xl mb-2 block">📐</span>
              <h4 className="font-bold text-slate-800 mb-1">Shkopinjt</h4>
              <p className="text-sm text-slate-600">
                Metodë vizuale nga Kina. E bën shumëzimin të kuptueshëm dhe argëtues!
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-xl">
              <span className="text-2xl mb-2 block">⚡</span>
              <h4 className="font-bold text-slate-800 mb-1">Shpejtësia</h4>
              <p className="text-sm text-slate-600">
                Praktika e shpeshtë ndërton reflekset dhe vetëbesimin matematikor!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
