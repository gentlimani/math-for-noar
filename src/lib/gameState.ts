'use client'

// Types for game state management
export interface TopicProgress {
  completed: number
  correct: number
  total: number
  mastery: number // 0-100
  unlocked: boolean
  bestStreak: number
}

export interface Badge {
  id: string
  earnedAt?: string
}

export interface DailyActivity {
  date: string // YYYY-MM-DD
  questionsAnswered: number
  correctAnswers: number
  pointsEarned: number
}

export interface GameState {
  totalPoints: number
  currentStreak: number
  bestStreak: number
  badges: Badge[]
  topicProgress: Record<string, TopicProgress>
  soundEnabled: boolean
  // New fields for enhanced gamification
  level: number
  xp: number
  dailyStreak: number
  lastPlayDate: string | null
  dailyActivity: DailyActivity[]
  trianglesSolved: number
  speedMathBestScore: number
  sorobanCompleted: boolean
  sticksCompleted: boolean
}

const STORAGE_KEY = 'noar-math-game-state'

const DEFAULT_STATE: GameState = {
  totalPoints: 0,
  currentStreak: 0,
  bestStreak: 0,
  badges: [],
  topicProgress: {
    mbledhja: { completed: 0, correct: 0, total: 20, mastery: 0, unlocked: true, bestStreak: 0 },
    zbritja: { completed: 0, correct: 0, total: 20, mastery: 0, unlocked: false, bestStreak: 0 },
    shumezimi: { completed: 0, correct: 0, total: 20, mastery: 0, unlocked: false, bestStreak: 0 },
    pjestimi: { completed: 0, correct: 0, total: 20, mastery: 0, unlocked: false, bestStreak: 0 },
  },
  soundEnabled: true,
  // New defaults
  level: 1,
  xp: 0,
  dailyStreak: 0,
  lastPlayDate: null,
  dailyActivity: [],
  trianglesSolved: 0,
  speedMathBestScore: 0,
  sorobanCompleted: false,
  sticksCompleted: false,
}

// Points system
export const POINTS = {
  CORRECT_ANSWER: 10,
  HINT_PENALTY: -2,
  STREAK_BONUS_5: 25,
  STREAK_BONUS_10: 50,
  PERFECT_QUIZ: 100,
  TRIANGLE_SOLVED: 15,
  SPEED_MATH_BASE: 5,
}

// Level thresholds (XP needed for each level)
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  800,    // Level 5
  1200,   // Level 6
  1700,   // Level 7
  2300,   // Level 8
  3000,   // Level 9
  4000,   // Level 10
]

// Mastery threshold to unlock next topic
export const MASTERY_THRESHOLD = 80

// Calculate level from XP
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

// Get XP progress within current level
export function getLevelProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = calculateLevel(xp)
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  
  const current = xp - currentThreshold
  const needed = nextThreshold - currentThreshold
  const percent = Math.min(100, Math.round((current / needed) * 100))
  
  return { current, needed, percent }
}

// Get today's date string
function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

// Load state from localStorage
export function loadGameState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle new fields
      return { ...DEFAULT_STATE, ...parsed }
    }
  } catch (e) {
    console.error('Failed to load game state:', e)
  }
  
  return DEFAULT_STATE
}

// Save state to localStorage
export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save game state:', e)
  }
}

// Calculate mastery percentage for a topic
export function calculateMastery(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

// Check if a topic should be unlocked
export function checkTopicUnlock(state: GameState, topicId: string): boolean {
  const topicOrder = ['mbledhja', 'zbritja', 'shumezimi', 'pjestimi']
  const index = topicOrder.indexOf(topicId)
  
  if (index === 0) return true // First topic always unlocked
  
  const previousTopic = topicOrder[index - 1]
  const previousProgress = state.topicProgress[previousTopic]
  
  return previousProgress ? previousProgress.mastery >= MASTERY_THRESHOLD : false
}

// Update daily streak
export function updateDailyStreak(state: GameState): GameState {
  const today = getTodayString()
  const newState = { ...state }
  
  if (!state.lastPlayDate) {
    // First time playing
    newState.dailyStreak = 1
    newState.lastPlayDate = today
  } else if (state.lastPlayDate === today) {
    // Already played today, no change
  } else {
    const lastDate = new Date(state.lastPlayDate)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      // Consecutive day
      newState.dailyStreak = state.dailyStreak + 1
    } else {
      // Streak broken
      newState.dailyStreak = 1
    }
    newState.lastPlayDate = today
  }
  
  return newState
}

// Record daily activity
export function recordDailyActivity(
  state: GameState, 
  questionsAnswered: number = 1, 
  correctAnswers: number = 0, 
  pointsEarned: number = 0
): GameState {
  const today = getTodayString()
  const newState = { ...state }
  
  // Find or create today's activity
  const existingIndex = newState.dailyActivity.findIndex(a => a.date === today)
  
  if (existingIndex >= 0) {
    newState.dailyActivity[existingIndex] = {
      ...newState.dailyActivity[existingIndex],
      questionsAnswered: newState.dailyActivity[existingIndex].questionsAnswered + questionsAnswered,
      correctAnswers: newState.dailyActivity[existingIndex].correctAnswers + correctAnswers,
      pointsEarned: newState.dailyActivity[existingIndex].pointsEarned + pointsEarned,
    }
  } else {
    newState.dailyActivity.push({
      date: today,
      questionsAnswered,
      correctAnswers,
      pointsEarned,
    })
  }
  
  // Keep only last 30 days
  newState.dailyActivity = newState.dailyActivity
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30)
  
  return newState
}

// Get last 7 days activity for display
export function getLast7DaysActivity(state: GameState): (DailyActivity | null)[] {
  const result: (DailyActivity | null)[] = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const activity = state.dailyActivity.find(a => a.date === dateStr)
    result.push(activity || null)
  }
  
  return result
}

// Update state after answering a question
export function updateAfterAnswer(
  state: GameState,
  topicId: string,
  correct: boolean,
  hintsUsed: number
): GameState {
  let newState = { ...state }
  const topicProgress = { ...newState.topicProgress[topicId] }
  
  // Update daily streak
  newState = updateDailyStreak(newState)
  
  // Update topic progress
  topicProgress.completed++
  let pointsEarned = 0
  
  if (correct) {
    topicProgress.correct++
    
    // Update streaks
    newState.currentStreak++
    if (newState.currentStreak > newState.bestStreak) {
      newState.bestStreak = newState.currentStreak
    }
    if (newState.currentStreak > topicProgress.bestStreak) {
      topicProgress.bestStreak = newState.currentStreak
    }
    
    // Add points
    let points = POINTS.CORRECT_ANSWER + (hintsUsed * POINTS.HINT_PENALTY)
    points = Math.max(points, 1) // Minimum 1 point
    
    // Streak bonuses
    if (newState.currentStreak === 5) points += POINTS.STREAK_BONUS_5
    if (newState.currentStreak === 10) points += POINTS.STREAK_BONUS_10
    
    newState.totalPoints += points
    newState.xp += points
    pointsEarned = points
    
    // Update level
    newState.level = calculateLevel(newState.xp)
  } else {
    // Reset streak on wrong answer
    newState.currentStreak = 0
  }
  
  // Recalculate mastery
  topicProgress.mastery = calculateMastery(topicProgress.correct, topicProgress.completed)
  
  newState.topicProgress[topicId] = topicProgress
  
  // Record daily activity
  newState = recordDailyActivity(newState, 1, correct ? 1 : 0, pointsEarned)
  
  // Check if next topic should be unlocked
  const topicOrder = ['mbledhja', 'zbritja', 'shumezimi', 'pjestimi']
  const currentIndex = topicOrder.indexOf(topicId)
  if (currentIndex < topicOrder.length - 1 && topicProgress.mastery >= MASTERY_THRESHOLD) {
    const nextTopic = topicOrder[currentIndex + 1]
    newState.topicProgress[nextTopic] = {
      ...newState.topicProgress[nextTopic],
      unlocked: true,
    }
  }
  
  return newState
}

// Update after solving a triangle problem
export function updateAfterTriangle(state: GameState, correct: boolean): GameState {
  let newState = { ...state }
  
  if (correct) {
    newState.trianglesSolved++
    newState.totalPoints += POINTS.TRIANGLE_SOLVED
    newState.xp += POINTS.TRIANGLE_SOLVED
    newState.level = calculateLevel(newState.xp)
    newState = recordDailyActivity(newState, 1, 1, POINTS.TRIANGLE_SOLVED)
  }
  
  return newState
}

// Update speed math score
export function updateSpeedMathScore(state: GameState, score: number): GameState {
  const newState = { ...state }
  
  if (score > newState.speedMathBestScore) {
    newState.speedMathBestScore = score
  }
  
  newState.totalPoints += score
  newState.xp += score
  newState.level = calculateLevel(newState.xp)
  
  return recordDailyActivity(newState, 0, 0, score)
}

// Check and award badges
export function checkBadges(state: GameState): { state: GameState; newBadges: string[] } {
  const newState = { ...state }
  const newBadges: string[] = []
  const existingBadgeIds = new Set(state.badges.map(b => b.id))
  
  const badgeChecks: { id: string; condition: boolean }[] = [
    // Original badges
    { id: 'firstQuiz', condition: Object.values(state.topicProgress).some(t => t.completed > 0) },
    { id: 'streak5', condition: state.bestStreak >= 5 },
    { id: 'streak10', condition: state.bestStreak >= 10 },
    { id: 'additionMaster', condition: state.topicProgress.mbledhja?.mastery >= 80 },
    { id: 'subtractionMaster', condition: state.topicProgress.zbritja?.mastery >= 80 },
    { id: 'multiplicationMaster', condition: state.topicProgress.shumezimi?.mastery >= 80 },
    { id: 'divisionMaster', condition: state.topicProgress.pjestimi?.mastery >= 80 },
    
    // New badges
    { id: 'dailyStreak3', condition: state.dailyStreak >= 3 },
    { id: 'dailyStreak7', condition: state.dailyStreak >= 7 },
    { id: 'dailyStreak14', condition: state.dailyStreak >= 14 },
    { id: 'level5', condition: state.level >= 5 },
    { id: 'level10', condition: state.level >= 10 },
    { id: 'triangleSolver', condition: state.trianglesSolved >= 10 },
    { id: 'triangleMaster', condition: state.trianglesSolved >= 50 },
    { id: 'speedDemon', condition: state.speedMathBestScore >= 100 },
    { id: 'speedMaster', condition: state.speedMathBestScore >= 200 },
    { id: 'sorobanLearner', condition: state.sorobanCompleted },
    { id: 'sticksLearner', condition: state.sticksCompleted },
    { id: 'points500', condition: state.totalPoints >= 500 },
    { id: 'points1000', condition: state.totalPoints >= 1000 },
    { id: 'points2500', condition: state.totalPoints >= 2500 },
  ]
  
  for (const check of badgeChecks) {
    if (check.condition && !existingBadgeIds.has(check.id)) {
      newState.badges.push({ id: check.id, earnedAt: new Date().toISOString() })
      newBadges.push(check.id)
    }
  }
  
  return { state: newState, newBadges }
}

// Get level name in Albanian
export function getLevelName(level: number): string {
  const names = [
    'Fillestar',      // Level 1
    'Nxënës',         // Level 2
    'Praktikant',     // Level 3
    'I Zoti',         // Level 4
    'Ekspert',        // Level 5
    'Mjeshtër',       // Level 6
    'Guru',           // Level 7
    'Matematik',      // Level 8
    'Gjenial',        // Level 9
    'Legjendë',       // Level 10
  ]
  return names[Math.min(level - 1, names.length - 1)] || 'Fillestar'
}

// Reset progress (for testing)
export function resetGameState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
