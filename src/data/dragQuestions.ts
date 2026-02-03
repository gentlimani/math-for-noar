// Drag and Drop Questions for interactive learning

export interface DragFillQuestion {
  id: string
  type: 'drag_fill'
  topicId: string
  questionAl: string
  equation: string // Uses [BLANK] as placeholder
  options: number[]
  correctAnswer: number
  hints: string[]
  difficulty: 1 | 2 | 3
}

export interface DragMatchQuestion {
  id: string
  type: 'drag_match'
  topicId: string
  questionAl: string
  pairs: { equation: string; answer: number }[]
  hints: string[]
  difficulty: 1 | 2 | 3
}

export type DragQuestion = DragFillQuestion | DragMatchQuestion

export const dragQuestions: DragQuestion[] = [
  // Addition fill-in-blank
  {
    id: 'drag-add-001',
    type: 'drag_fill',
    topicId: 'mbledhja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '5 + [BLANK] = 12',
    options: [7, 5, 8, 6],
    correctAnswer: 7,
    hints: ['Mendo: 5 + ? = 12', '12 - 5 = ?', 'Përgjigja: 7'],
    difficulty: 1,
  },
  {
    id: 'drag-add-002',
    type: 'drag_fill',
    topicId: 'mbledhja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '[BLANK] + 8 = 15',
    options: [7, 6, 8, 9],
    correctAnswer: 7,
    hints: ['Mendo: ? + 8 = 15', '15 - 8 = ?', 'Përgjigja: 7'],
    difficulty: 1,
  },
  {
    id: 'drag-add-003',
    type: 'drag_fill',
    topicId: 'mbledhja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '24 + [BLANK] = 50',
    options: [26, 24, 30, 16],
    correctAnswer: 26,
    hints: ['Mendo: 24 + ? = 50', '50 - 24 = ?', 'Përgjigja: 26'],
    difficulty: 2,
  },
  {
    id: 'drag-add-004',
    type: 'drag_fill',
    topicId: 'mbledhja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '45 + [BLANK] = 100',
    options: [55, 45, 65, 50],
    correctAnswer: 55,
    hints: ['Mendo: 45 + ? = 100', '100 - 45 = ?', 'Përgjigja: 55'],
    difficulty: 2,
  },
  
  // Subtraction fill-in-blank
  {
    id: 'drag-sub-001',
    type: 'drag_fill',
    topicId: 'zbritja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '15 - [BLANK] = 8',
    options: [7, 8, 6, 5],
    correctAnswer: 7,
    hints: ['Mendo: 15 - ? = 8', '15 - 8 = ?', 'Përgjigja: 7'],
    difficulty: 1,
  },
  {
    id: 'drag-sub-002',
    type: 'drag_fill',
    topicId: 'zbritja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '[BLANK] - 9 = 6',
    options: [15, 14, 16, 13],
    correctAnswer: 15,
    hints: ['Mendo: ? - 9 = 6', '6 + 9 = ?', 'Përgjigja: 15'],
    difficulty: 1,
  },
  {
    id: 'drag-sub-003',
    type: 'drag_fill',
    topicId: 'zbritja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '50 - [BLANK] = 23',
    options: [27, 23, 37, 17],
    correctAnswer: 27,
    hints: ['Mendo: 50 - ? = 23', '50 - 23 = ?', 'Përgjigja: 27'],
    difficulty: 2,
  },
  {
    id: 'drag-sub-004',
    type: 'drag_fill',
    topicId: 'zbritja',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '100 - [BLANK] = 45',
    options: [55, 45, 65, 35],
    correctAnswer: 55,
    hints: ['Mendo: 100 - ? = 45', '100 - 45 = ?', 'Përgjigja: 55'],
    difficulty: 2,
  },

  // Multiplication fill-in-blank
  {
    id: 'drag-mul-001',
    type: 'drag_fill',
    topicId: 'shumezimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '3 × [BLANK] = 12',
    options: [4, 3, 5, 6],
    correctAnswer: 4,
    hints: ['Mendo: 3 × ? = 12', 'Sa herë 3 hyn në 12?', 'Përgjigja: 4'],
    difficulty: 1,
  },
  {
    id: 'drag-mul-002',
    type: 'drag_fill',
    topicId: 'shumezimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '[BLANK] × 5 = 35',
    options: [7, 6, 8, 5],
    correctAnswer: 7,
    hints: ['Mendo: ? × 5 = 35', 'Sa 5-sha bëjnë 35?', 'Përgjigja: 7'],
    difficulty: 1,
  },
  {
    id: 'drag-mul-003',
    type: 'drag_fill',
    topicId: 'shumezimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '8 × [BLANK] = 56',
    options: [7, 6, 8, 9],
    correctAnswer: 7,
    hints: ['Mendo tabelën e 8', '8 × 7 = ?', 'Përgjigja: 7'],
    difficulty: 2,
  },
  {
    id: 'drag-mul-004',
    type: 'drag_fill',
    topicId: 'shumezimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '9 × [BLANK] = 81',
    options: [9, 8, 7, 10],
    correctAnswer: 9,
    hints: ['81 është katrori i cilit numër?', '9 × 9 = ?', 'Përgjigja: 9'],
    difficulty: 2,
  },

  // Division fill-in-blank
  {
    id: 'drag-div-001',
    type: 'drag_fill',
    topicId: 'pjestimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '20 ÷ [BLANK] = 4',
    options: [5, 4, 6, 10],
    correctAnswer: 5,
    hints: ['Mendo: 20 ÷ ? = 4', '4 × ? = 20', 'Përgjigja: 5'],
    difficulty: 1,
  },
  {
    id: 'drag-div-002',
    type: 'drag_fill',
    topicId: 'pjestimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '[BLANK] ÷ 6 = 7',
    options: [42, 36, 48, 35],
    correctAnswer: 42,
    hints: ['Mendo: ? ÷ 6 = 7', '6 × 7 = ?', 'Përgjigja: 42'],
    difficulty: 1,
  },
  {
    id: 'drag-div-003',
    type: 'drag_fill',
    topicId: 'pjestimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '72 ÷ [BLANK] = 8',
    options: [9, 8, 7, 6],
    correctAnswer: 9,
    hints: ['Mendo: 72 ÷ ? = 8', '8 × ? = 72', 'Përgjigja: 9'],
    difficulty: 2,
  },
  {
    id: 'drag-div-004',
    type: 'drag_fill',
    topicId: 'pjestimi',
    questionAl: 'Plotëso numrin që mungon:',
    equation: '[BLANK] ÷ 9 = 9',
    options: [81, 72, 90, 63],
    correctAnswer: 81,
    hints: ['Mendo: ? ÷ 9 = 9', '9 × 9 = ?', 'Përgjigja: 81'],
    difficulty: 2,
  },

  // Matching questions
  {
    id: 'drag-match-add-001',
    type: 'drag_match',
    topicId: 'mbledhja',
    questionAl: 'Lidh çdo mbledhje me përgjigjen e saktë:',
    pairs: [
      { equation: '5 + 7', answer: 12 },
      { equation: '8 + 6', answer: 14 },
      { equation: '9 + 4', answer: 13 },
      { equation: '7 + 8', answer: 15 },
    ],
    hints: ['Mblidh njëshat së pari', 'Kontrollo çdo rezultat', 'Përdor gishtat nëse duhet'],
    difficulty: 1,
  },
  {
    id: 'drag-match-sub-001',
    type: 'drag_match',
    topicId: 'zbritja',
    questionAl: 'Lidh çdo zbritje me përgjigjen e saktë:',
    pairs: [
      { equation: '15 - 7', answer: 8 },
      { equation: '18 - 9', answer: 9 },
      { equation: '14 - 6', answer: 8 },
      { equation: '17 - 8', answer: 9 },
    ],
    hints: ['Numëro mbrapsht', 'Kontrollo me mbledhje', 'Merr kohën tënde'],
    difficulty: 1,
  },
  {
    id: 'drag-match-mul-001',
    type: 'drag_match',
    topicId: 'shumezimi',
    questionAl: 'Lidh çdo shumëzim me përgjigjen e saktë:',
    pairs: [
      { equation: '6 × 7', answer: 42 },
      { equation: '8 × 5', answer: 40 },
      { equation: '9 × 4', answer: 36 },
      { equation: '7 × 7', answer: 49 },
    ],
    hints: ['Mendo tabelën e shumëzimit', 'Çdo përgjigje shkon vetëm një herë', 'Kontrollo llogaritjet'],
    difficulty: 2,
  },
  {
    id: 'drag-match-div-001',
    type: 'drag_match',
    topicId: 'pjestimi',
    questionAl: 'Lidh çdo pjesëtim me përgjigjen e saktë:',
    pairs: [
      { equation: '36 ÷ 6', answer: 6 },
      { equation: '45 ÷ 5', answer: 9 },
      { equation: '56 ÷ 8', answer: 7 },
      { equation: '63 ÷ 9', answer: 7 },
    ],
    hints: ['Mendo shumëzimin', 'Sa herë hyn numri?', 'Kontrollo: rezultat × pjesëtues = numri'],
    difficulty: 2,
  },
]

export function getDragQuestionsForTopic(topicId: string): DragQuestion[] {
  return dragQuestions.filter(q => q.topicId === topicId)
}
