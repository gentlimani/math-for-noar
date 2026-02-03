'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/lib/userSettings'
import { ArrowRight, Sparkles, User } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (name.trim().length < 2) return
    
    setIsAnimating(true)
    
    // Save the name and mark onboarding complete
    completeOnboarding(name)
    
    // Navigate to main app after animation
    setTimeout(() => {
      router.push('/')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Floating decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl opacity-30 animate-float">📐</div>
        <div className="absolute top-40 right-20 text-6xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-40 left-20 text-7xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>🧮</div>
        <div className="absolute bottom-20 right-10 text-8xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute top-1/2 left-5 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.8s' }}>➕</div>
        <div className="absolute top-1/3 right-5 text-5xl opacity-20 animate-float" style={{ animationDelay: '1.2s' }}>✖️</div>
      </div>

      {/* Main content */}
      <div className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-500 ${
        isAnimating ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4">
            <span className="text-5xl">🦉</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Mirë se vjen!
          </h1>
          <p className="text-slate-600">
            Matematika për Klasën e 3
          </p>
        </div>

        {/* Name input form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-slate-700 mb-3 text-center">
              Si të thërrasim?
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shkruaj emrin tënd..."
                className="w-full pl-14 pr-4 py-5 text-xl font-medium text-center border-4 border-slate-200 
                         rounded-2xl focus:border-indigo-400 focus:outline-none transition-colors
                         placeholder:text-slate-400"
                autoFocus
                maxLength={20}
              />
            </div>
            {name.length > 0 && name.length < 2 && (
              <p className="text-sm text-orange-500 text-center mt-2">
                Emri duhet të ketë së paku 2 shkronja
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold 
                     text-xl rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 
                     disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all
                     flex items-center justify-center gap-3"
          >
            <span>Le të fillojmë!</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        {/* Features preview */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center mb-4">Çfarë të pret:</p>
          <div className="flex justify-around text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">📚</span>
              <span className="text-xs text-slate-600">Mësime</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🎮</span>
              <span className="text-xs text-slate-600">Lojëra</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-xs text-slate-600">Sfida</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🏆</span>
              <span className="text-xs text-slate-600">Medalje</span>
            </div>
          </div>
        </div>

        {/* Sparkle decoration */}
        <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-yellow-400" />
      </div>
    </div>
  )
}
