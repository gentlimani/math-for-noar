'use client'

// Albanian Text-to-Speech using Web Speech API

let currentUtterance: SpeechSynthesisUtterance | null = null

/**
 * Check if speech synthesis is available
 */
export function isSpeechAvailable(): boolean {
  if (typeof window === 'undefined') return false
  return 'speechSynthesis' in window
}

/**
 * Get available voices, preferring Albanian
 */
export function getAlbanianVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechAvailable()) return null
  
  const voices = speechSynthesis.getVoices()
  
  // Try to find Albanian voice
  const albanianVoice = voices.find(v => 
    v.lang.startsWith('sq') || 
    v.name.toLowerCase().includes('albanian')
  )
  
  if (albanianVoice) return albanianVoice
  
  // Fallback to a clear voice (Google voices are usually good)
  const googleVoice = voices.find(v => v.name.includes('Google'))
  if (googleVoice) return googleVoice
  
  // Default to first available
  return voices[0] || null
}

/**
 * Speak text in Albanian
 */
export function speak(
  text: string, 
  options: {
    rate?: number
    pitch?: number
    volume?: number
    onEnd?: () => void
    onError?: (error: Error) => void
  } = {}
): void {
  if (!isSpeechAvailable()) {
    console.warn('Speech synthesis not available')
    options.onEnd?.()
    return
  }

  // Stop any current speech
  stopSpeaking()

  const { rate = 0.85, pitch = 1.1, volume = 1, onEnd, onError } = options

  const utterance = new SpeechSynthesisUtterance(text)
  currentUtterance = utterance

  // Set Albanian language
  utterance.lang = 'sq-AL'
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = volume

  // Try to get Albanian voice
  const voice = getAlbanianVoice()
  if (voice) {
    utterance.voice = voice
  }

  // Event handlers
  utterance.onend = () => {
    currentUtterance = null
    onEnd?.()
  }

  utterance.onerror = (event) => {
    currentUtterance = null
    console.error('Speech synthesis error:', event)
    onError?.(new Error(event.error))
  }

  // Speak!
  speechSynthesis.speak(utterance)
}

/**
 * Speak text and return a promise that resolves when done
 */
export function speakAsync(text: string, options: { rate?: number; pitch?: number } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    speak(text, {
      ...options,
      onEnd: resolve,
      onError: reject
    })
  })
}

/**
 * Speak multiple texts in sequence
 */
export async function speakSequence(
  texts: string[], 
  options: { rate?: number; pauseBetween?: number } = {}
): Promise<void> {
  const { pauseBetween = 500 } = options
  
  for (const text of texts) {
    await speakAsync(text, options)
    await new Promise(resolve => setTimeout(resolve, pauseBetween))
  }
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
  if (isSpeechAvailable()) {
    speechSynthesis.cancel()
    currentUtterance = null
  }
}

/**
 * Pause current speech
 */
export function pauseSpeaking(): void {
  if (isSpeechAvailable()) {
    speechSynthesis.pause()
  }
}

/**
 * Resume paused speech
 */
export function resumeSpeaking(): void {
  if (isSpeechAvailable()) {
    speechSynthesis.resume()
  }
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
  if (!isSpeechAvailable()) return false
  return speechSynthesis.speaking
}

// Pre-defined Albanian phrases for the app
export const albanianPhrases = {
  // Encouragement
  correct: [
    'Shumë mirë!',
    'Shkëlqyeshëm!',
    'Bravo!',
    'Të lumtë!',
    'Saktë!',
    'Ashtu është!',
    'Fantastike!',
  ],
  incorrect: [
    'Provo përsëri!',
    'Jo saktë, provo përsëri.',
    'Afër, por jo saktë.',
    'Mendo pak më shumë.',
  ],
  hint: [
    'Ja një ndihmë...',
    'Shiko këtu...',
    'Mendo kështu...',
  ],
  
  // Instructions
  startQuiz: 'Le të fillojmë!',
  nextQuestion: 'Pyetja tjetër...',
  quizComplete: 'Kuizi përfundoi! Bravo!',
  
  // Math operations
  addition: {
    start: 'Le të mbledhim këta numra.',
    carry: 'Mbartim një te dhjetëshat.',
    result: 'Shuma është',
  },
  subtraction: {
    start: 'Le të zbresim.',
    borrow: 'Huazojmë një dhjetëshe.',
    result: 'Ndryshimi është',
  },
  multiplication: {
    start: 'Le të shumëzojmë.',
    groups: 'grupe me nga',
    result: 'Prodhimi është',
  },
  division: {
    start: 'Le të pjesëtojmë.',
    howMany: 'Sa herë hyn',
    result: 'Herësi është',
    remainder: 'Mbetja është',
  },
  
  // Triangle problems
  triangle: {
    question: 'Cili numër mungon?',
    findSum: 'Gjej shumën.',
    findProduct: 'Gjej prodhimin.',
    findPart: 'Gjej numrin që mungon.',
  },
  
  // Speed math
  speedMath: {
    ready: 'Gati?',
    go: 'Fillo!',
    timeUp: 'Koha mbaroi!',
    newRecord: 'Rekord i ri!',
  },
  
  // Soroban
  soroban: {
    intro: 'Kjo është llogaritësi japonez, Sorobani.',
    heavenBead: 'Rruaza e sipërme vlen pesë.',
    earthBeads: 'Rruazat e poshtme vlene një.',
    practice: 'Provo të paraqitësh numrin',
  },
}

/**
 * Speak a random phrase from a category
 */
export function speakRandom(phrases: string[], options?: { rate?: number }): void {
  const phrase = phrases[Math.floor(Math.random() * phrases.length)]
  speak(phrase, options)
}

/**
 * Speak correct answer feedback
 */
export function speakCorrect(): void {
  speakRandom(albanianPhrases.correct)
}

/**
 * Speak incorrect answer feedback
 */
export function speakIncorrect(): void {
  speakRandom(albanianPhrases.incorrect)
}

// Initialize voices on load (Chrome requires this)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    getAlbanianVoice() // Cache the voice selection
  }
}
