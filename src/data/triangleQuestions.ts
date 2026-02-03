// Triangle Fact Family Questions
// Format: [top (sum/product), bottomLeft, bottomRight]
// '?' indicates the unknown value

import { TriangleValue } from '@/components/TriangleProblem'

export interface TriangleQuestion {
  id: string
  values: [TriangleValue, TriangleValue, TriangleValue]
  operation: 'addition' | 'multiplication'
  difficulty: 1 | 2 | 3
  hints: string[]
}

// Addition fact family triangles
export const additionTriangles: TriangleQuestion[] = [
  // Easy (difficulty 1) - sums up to 20
  {
    id: 'add-tri-001',
    values: ['?', 5, 3],
    operation: 'addition',
    difficulty: 1,
    hints: ['Mblidh numrat poshtë', '5 + 3 = ?', 'Shuma është 8']
  },
  {
    id: 'add-tri-002',
    values: [12, '?', 5],
    operation: 'addition',
    difficulty: 1,
    hints: ['Zbrit nga shuma', '12 - 5 = ?', 'Pjesa që mungon është 7']
  },
  {
    id: 'add-tri-003',
    values: [15, 8, '?'],
    operation: 'addition',
    difficulty: 1,
    hints: ['Zbrit nga shuma', '15 - 8 = ?', 'Pjesa që mungon është 7']
  },
  {
    id: 'add-tri-004',
    values: ['?', 9, 6],
    operation: 'addition',
    difficulty: 1,
    hints: ['Mblidh dy numrat', '9 + 6 = ?', 'Shuma është 15']
  },
  {
    id: 'add-tri-005',
    values: [18, '?', 9],
    operation: 'addition',
    difficulty: 1,
    hints: ['Sa duhet shtuar te 9 për të marrë 18?', '18 - 9 = ?', 'Përgjigja është 9']
  },
  {
    id: 'add-tri-006',
    values: [14, 6, '?'],
    operation: 'addition',
    difficulty: 1,
    hints: ['Zbrit 6 nga 14', '14 - 6 = ?', 'Përgjigja është 8']
  },
  {
    id: 'add-tri-007',
    values: ['?', 7, 7],
    operation: 'addition',
    difficulty: 1,
    hints: ['Mblidh dy shtata', '7 + 7 = ?', 'Shuma është 14']
  },
  {
    id: 'add-tri-008',
    values: [20, '?', 11],
    operation: 'addition',
    difficulty: 1,
    hints: ['Zbrit nga 20', '20 - 11 = ?', 'Përgjigja është 9']
  },

  // Medium (difficulty 2) - sums up to 100
  {
    id: 'add-tri-009',
    values: ['?', 25, 17],
    operation: 'addition',
    difficulty: 2,
    hints: ['Mblidh 25 + 17', 'Njëshat: 5+7=12, mbart 1', 'Dhjetëshat: 2+1+1=4, pra 42']
  },
  {
    id: 'add-tri-010',
    values: [58, '?', 23],
    operation: 'addition',
    difficulty: 2,
    hints: ['Zbrit 23 nga 58', '58 - 23 = ?', 'Përgjigja është 35']
  },
  {
    id: 'add-tri-011',
    values: [75, 48, '?'],
    operation: 'addition',
    difficulty: 2,
    hints: ['Zbrit 48 nga 75', '75 - 48 = ?', 'Përgjigja është 27']
  },
  {
    id: 'add-tri-012',
    values: ['?', 36, 44],
    operation: 'addition',
    difficulty: 2,
    hints: ['Mblidh 36 + 44', '6+4=10, mbart 1; 3+4+1=8', 'Shuma është 80']
  },
  {
    id: 'add-tri-013',
    values: [100, '?', 63],
    operation: 'addition',
    difficulty: 2,
    hints: ['Sa plus 63 bën 100?', '100 - 63 = ?', 'Përgjigja është 37']
  },
  {
    id: 'add-tri-014',
    values: [91, 54, '?'],
    operation: 'addition',
    difficulty: 2,
    hints: ['Zbrit 54 nga 91', '91 - 54 = ?', 'Përgjigja është 37']
  },

  // Hard (difficulty 3) - sums up to 1000
  {
    id: 'add-tri-015',
    values: ['?', 156, 244],
    operation: 'addition',
    difficulty: 3,
    hints: ['Mblidh qindëshat, dhjetëshat, njëshat', '156 + 244 = ?', 'Shuma është 400']
  },
  {
    id: 'add-tri-016',
    values: [500, '?', 287],
    operation: 'addition',
    difficulty: 3,
    hints: ['Zbrit 287 nga 500', '500 - 287 = ?', 'Përgjigja është 213']
  },
  {
    id: 'add-tri-017',
    values: [725, 368, '?'],
    operation: 'addition',
    difficulty: 3,
    hints: ['Zbrit 368 nga 725', '725 - 368 = ?', 'Përgjigja është 357']
  },
  {
    id: 'add-tri-018',
    values: ['?', 489, 311],
    operation: 'addition',
    difficulty: 3,
    hints: ['Mblidh 489 + 311', '9+1=10, 8+1+1=10, 4+3+1=8', 'Shuma është 800']
  },
]

// Multiplication fact family triangles
export const multiplicationTriangles: TriangleQuestion[] = [
  // Easy (difficulty 1) - products up to 30
  {
    id: 'mul-tri-001',
    values: ['?', 3, 4],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Shumëzo 3 me 4', '3 × 4 = ?', 'Prodhimi është 12']
  },
  {
    id: 'mul-tri-002',
    values: [15, '?', 5],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Pjesëto 15 me 5', '15 ÷ 5 = ?', 'Faktori është 3']
  },
  {
    id: 'mul-tri-003',
    values: [18, 6, '?'],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Pjesëto 18 me 6', '18 ÷ 6 = ?', 'Faktori është 3']
  },
  {
    id: 'mul-tri-004',
    values: ['?', 5, 5],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Shumëzo 5 me 5', '5 × 5 = ?', 'Prodhimi është 25']
  },
  {
    id: 'mul-tri-005',
    values: [24, '?', 6],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Pjesëto 24 me 6', '24 ÷ 6 = ?', 'Faktori është 4']
  },
  {
    id: 'mul-tri-006',
    values: [21, 7, '?'],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Pjesëto 21 me 7', '21 ÷ 7 = ?', 'Faktori është 3']
  },
  {
    id: 'mul-tri-007',
    values: ['?', 4, 7],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Shumëzo 4 me 7', '4 × 7 = ?', 'Prodhimi është 28']
  },
  {
    id: 'mul-tri-008',
    values: [30, '?', 6],
    operation: 'multiplication',
    difficulty: 1,
    hints: ['Pjesëto 30 me 6', '30 ÷ 6 = ?', 'Faktori është 5']
  },

  // Medium (difficulty 2) - products up to 81
  {
    id: 'mul-tri-009',
    values: ['?', 8, 7],
    operation: 'multiplication',
    difficulty: 2,
    hints: ['Shumëzo 8 me 7', '8 × 7 = ?', 'Prodhimi është 56']
  },
  {
    id: 'mul-tri-010',
    values: [63, '?', 9],
    operation: 'multiplication',
    difficulty: 2,
    hints: ['Pjesëto 63 me 9', '63 ÷ 9 = ?', 'Faktori është 7']
  },
  {
    id: 'mul-tri-011',
    values: [72, 8, '?'],
    operation: 'multiplication',
    difficulty: 2,
    hints: ['Pjesëto 72 me 8', '72 ÷ 8 = ?', 'Faktori është 9']
  },
  {
    id: 'mul-tri-012',
    values: ['?', 9, 9],
    operation: 'multiplication',
    difficulty: 2,
    hints: ['Shumëzo 9 me 9', '9 × 9 = ?', 'Prodhimi është 81']
  },
  {
    id: 'mul-tri-013',
    values: [48, '?', 8],
    operation: 'multiplication',
    difficulty: 2,
    hints: ['Pjesëto 48 me 8', '48 ÷ 8 = ?', 'Faktori është 6']
  },
  {
    id: 'mul-tri-014',
    values: [54, 6, '?'],
    operation: 'multiplication',
    difficulty: 2,
    hints: ['Pjesëto 54 me 6', '54 ÷ 6 = ?', 'Faktori është 9']
  },

  // Hard (difficulty 3) - larger numbers
  {
    id: 'mul-tri-015',
    values: ['?', 12, 8],
    operation: 'multiplication',
    difficulty: 3,
    hints: ['Shumëzo 12 me 8', '12 × 8 = 10×8 + 2×8', 'Prodhimi është 96']
  },
  {
    id: 'mul-tri-016',
    values: [120, '?', 10],
    operation: 'multiplication',
    difficulty: 3,
    hints: ['Pjesëto 120 me 10', '120 ÷ 10 = ?', 'Faktori është 12']
  },
  {
    id: 'mul-tri-017',
    values: [144, 12, '?'],
    operation: 'multiplication',
    difficulty: 3,
    hints: ['Pjesëto 144 me 12', '144 ÷ 12 = ?', 'Faktori është 12']
  },
  {
    id: 'mul-tri-018',
    values: ['?', 15, 6],
    operation: 'multiplication',
    difficulty: 3,
    hints: ['Shumëzo 15 me 6', '15 × 6 = 10×6 + 5×6', 'Prodhimi është 90']
  },
]

// Get triangle questions for a topic
export function getTriangleQuestionsForTopic(
  topicId: string,
  count: number = 5,
  difficulty?: 1 | 2 | 3
): TriangleQuestion[] {
  let questions: TriangleQuestion[] = []
  
  if (topicId === 'mbledhja' || topicId === 'zbritja') {
    questions = [...additionTriangles]
  } else if (topicId === 'shumezimi' || topicId === 'pjestimi') {
    questions = [...multiplicationTriangles]
  } else {
    // Mix both for general
    questions = [...additionTriangles, ...multiplicationTriangles]
  }
  
  // Filter by difficulty if specified
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty)
  }
  
  // Shuffle
  questions.sort(() => Math.random() - 0.5)
  
  return questions.slice(0, count)
}

// Get a single random triangle question
export function getRandomTriangleQuestion(
  operation?: 'addition' | 'multiplication',
  difficulty?: 1 | 2 | 3
): TriangleQuestion {
  let questions = operation === 'addition' 
    ? additionTriangles 
    : operation === 'multiplication'
      ? multiplicationTriangles
      : [...additionTriangles, ...multiplicationTriangles]
  
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty)
  }
  
  return questions[Math.floor(Math.random() * questions.length)]
}

// All triangles combined
export const allTriangleQuestions = [...additionTriangles, ...multiplicationTriangles]
