// Quiz Data Loader - Loads and manages the expanded quiz question pool
import quizData from './quiz_data.json'

export interface QuizQuestion {
  id: string
  type: 'standard' | 'challenge'
  subtype?: 'word_problem' | 'logic' | 'pattern' | 'pyramid' | 'magic_table'
  difficulty: 1 | 2 | 3
  questionAl: string
  options: number[]
  correctAnswer: number
  hints: string[]
}

export interface MagicSquareQuestion {
  id: string
  type: 'magic_square'
  questionAl: string
  config: {
    grid_size: number
    target_value: number
    operation: 'sum' | 'multiply'
    cells: {
      index: number
      value: number
      is_fixed: boolean
    }[]
  }
  hints: string[]
}

export interface Subject {
  titleAl: string
  icon: string
  questions: QuizQuestion[]
}

// Typed quiz data
const typedQuizData = quizData as {
  version: string
  lastUpdated: string
  subjects: {
    [key: string]: Subject
  }
  magicSquares: MagicSquareQuestion[]
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get questions for a specific topic with configurable selection
 * @param topicId - The topic ID (mbledhja, zbritja, shumezimi, pjestimi)
 * @param count - Number of questions to return (default: 15)
 * @param options - Configuration options
 */
export function getQuizQuestions(
  topicId: string,
  count: number = 15,
  options: {
    difficultyMix?: { easy: number; medium: number; hard: number }
    includeChallenge?: boolean
    shuffleOptions?: boolean
  } = {}
): QuizQuestion[] {
  const {
    difficultyMix = { easy: 0.4, medium: 0.4, hard: 0.2 }, // 40% easy, 40% medium, 20% hard
    includeChallenge = true,
    shuffleOptions = true
  } = options

  const subject = typedQuizData.subjects[topicId]
  if (!subject) {
    console.warn(`Topic ${topicId} not found in quiz data`)
    return []
  }

  const allQuestions = subject.questions

  // Filter by type if needed
  const filteredQuestions = includeChallenge 
    ? allQuestions 
    : allQuestions.filter(q => q.type === 'standard')

  // Separate by difficulty
  const easyQuestions = shuffleArray(filteredQuestions.filter(q => q.difficulty === 1))
  const mediumQuestions = shuffleArray(filteredQuestions.filter(q => q.difficulty === 2))
  const hardQuestions = shuffleArray(filteredQuestions.filter(q => q.difficulty === 3))

  // Calculate counts based on mix
  const easyCount = Math.round(count * difficultyMix.easy)
  const mediumCount = Math.round(count * difficultyMix.medium)
  const hardCount = count - easyCount - mediumCount

  // Select questions
  const selected: QuizQuestion[] = [
    ...easyQuestions.slice(0, easyCount),
    ...mediumQuestions.slice(0, mediumCount),
    ...hardQuestions.slice(0, hardCount)
  ]

  // Fill remaining slots if we don't have enough of a difficulty
  const remaining = count - selected.length
  if (remaining > 0) {
    const unused = shuffleArray([...easyQuestions, ...mediumQuestions, ...hardQuestions]
      .filter(q => !selected.includes(q)))
    selected.push(...unused.slice(0, remaining))
  }

  // Shuffle final selection
  const shuffledSelection = shuffleArray(selected)

  // Shuffle options for each question if enabled
  if (shuffleOptions) {
    return shuffledSelection.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }))
  }

  return shuffledSelection
}

/**
 * Get a mix of standard (60%) and challenge (40%) questions
 * @param topicId - The topic ID
 * @param count - Number of questions (default: 15)
 */
export function getMixedQuizQuestions(
  topicId: string,
  count: number = 15
): QuizQuestion[] {
  const subject = typedQuizData.subjects[topicId]
  if (!subject) return []

  const allQuestions = subject.questions
  
  // Separate standard and challenge
  const standardQuestions = allQuestions.filter(q => q.type === 'standard')
  const challengeQuestions = allQuestions.filter(q => q.type === 'challenge')

  // Calculate counts: 60% standard, 40% challenge
  const standardCount = Math.round(count * 0.6)
  const challengeCount = count - standardCount

  // Shuffle and select
  const selectedStandard = shuffleArray(standardQuestions).slice(0, standardCount)
  const selectedChallenge = shuffleArray(challengeQuestions).slice(0, challengeCount)

  // Combine and shuffle
  const combined = shuffleArray([...selectedStandard, ...selectedChallenge])

  // Shuffle options
  return combined.map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }))
}

/**
 * Get magic square questions
 * @param count - Number of magic squares to return
 */
export function getMagicSquareQuestions(count: number = 3): MagicSquareQuestion[] {
  const squares = typedQuizData.magicSquares
  return shuffleArray(squares).slice(0, count)
}

/**
 * Get all subjects
 */
export function getSubjects(): { id: string; titleAl: string; icon: string }[] {
  return Object.entries(typedQuizData.subjects).map(([id, subject]) => ({
    id,
    titleAl: subject.titleAl,
    icon: subject.icon
  }))
}

/**
 * Get subject by ID
 */
export function getSubjectById(topicId: string): Subject | undefined {
  return typedQuizData.subjects[topicId]
}

/**
 * Get question count for a topic
 */
export function getQuestionCount(topicId: string): number {
  const subject = typedQuizData.subjects[topicId]
  return subject ? subject.questions.length : 0
}

/**
 * Get statistics for a topic's question pool
 */
export function getTopicStats(topicId: string): {
  total: number
  standard: number
  challenge: number
  byDifficulty: { easy: number; medium: number; hard: number }
} {
  const subject = typedQuizData.subjects[topicId]
  if (!subject) {
    return { total: 0, standard: 0, challenge: 0, byDifficulty: { easy: 0, medium: 0, hard: 0 } }
  }

  const questions = subject.questions
  return {
    total: questions.length,
    standard: questions.filter(q => q.type === 'standard').length,
    challenge: questions.filter(q => q.type === 'challenge').length,
    byDifficulty: {
      easy: questions.filter(q => q.difficulty === 1).length,
      medium: questions.filter(q => q.difficulty === 2).length,
      hard: questions.filter(q => q.difficulty === 3).length
    }
  }
}
