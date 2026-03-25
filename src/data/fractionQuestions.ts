// Visual Fraction Questions – drag/click pieces to represent a fraction

export interface FractionVisualQuestion {
  id: string
  type: 'fraction_visual'
  topicId: string
  questionAl: string
  shape: 'circle' | 'square' | 'rectangle'
  numerator: number
  denominator: number
  hints: string[]
  difficulty: 1 | 2 | 3
}

export const fractionVisualQuestions: FractionVisualQuestion[] = [
  // ── EASY (difficulty 1) ───────────────────────────────────────────
  {
    id: 'fv-001',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 1/2 të rrethit duke klikuar mbi pjesët',
    shape: 'circle',
    numerator: 1,
    denominator: 2,
    hints: [
      'Rrethi është i ndarë në 2 pjesë të barabarta',
      'Duhet të zgjedhësh 1 pjesë nga 2',
      'Kliko njërën nga dy gjysmët',
    ],
    difficulty: 1,
  },
  {
    id: 'fv-002',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 1/4 të katrorit duke klikuar mbi pjesët',
    shape: 'square',
    numerator: 1,
    denominator: 4,
    hints: [
      'Katrori është ndarë në 4 pjesë të barabarta',
      'Duhet të zgjedhësh vetëm 1 pjesë',
      'Kliko njërin nga katër katrorrët e vegjël',
    ],
    difficulty: 1,
  },
  {
    id: 'fv-003',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 2/4 të drejtkëndëshit duke klikuar mbi pjesët',
    shape: 'rectangle',
    numerator: 2,
    denominator: 4,
    hints: [
      'Drejtkëndëshi ka 4 pjesë',
      'Duhet të zgjedhësh 2 pjesë nga 4',
      '2/4 = gjysma e figurës',
    ],
    difficulty: 1,
  },
  {
    id: 'fv-004',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 1/3 të rrethit duke klikuar mbi pjesët',
    shape: 'circle',
    numerator: 1,
    denominator: 3,
    hints: [
      'Rrethi është ndarë në 3 pjesë të barabarta',
      'Secila pjesë quhet "një e treta"',
      'Kliko vetëm 1 nga 3 pjesët',
    ],
    difficulty: 1,
  },
  {
    id: 'fv-005',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 3/4 të katrorit duke klikuar mbi pjesët',
    shape: 'square',
    numerator: 3,
    denominator: 4,
    hints: [
      'Katrori ka 4 pjesë gjithsej',
      '3/4 do të thotë 3 pjesë nga 4',
      'Lëre vetëm 1 pjesë pa ngjyrosur',
    ],
    difficulty: 1,
  },
  // ── MEDIUM (difficulty 2) ─────────────────────────────────────────
  {
    id: 'fv-006',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 3/8 të rrethit (pica) duke klikuar mbi fetat',
    shape: 'circle',
    numerator: 3,
    denominator: 8,
    hints: [
      'Pica është e prerë në 8 feta të barabarta',
      '3/8 do të thotë 3 feta nga 8',
      'Kliko saktësisht 3 feta',
    ],
    difficulty: 2,
  },
  {
    id: 'fv-007',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 2/3 të rrethit duke klikuar mbi pjesët',
    shape: 'circle',
    numerator: 2,
    denominator: 3,
    hints: [
      'Rrethi ka 3 pjesë gjithsej',
      '2/3 do të thotë 2 pjesë nga 3',
      'Kliko 2 nga 3 pjesët',
    ],
    difficulty: 2,
  },
  {
    id: 'fv-008',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 5/8 të rrethit (pica) duke klikuar mbi fetat',
    shape: 'circle',
    numerator: 5,
    denominator: 8,
    hints: [
      'Pica ka 8 feta gjithsej',
      '5/8 = 5 feta nga 8',
      'Kliko 5 feta – kjo është më shumë se gjysma!',
    ],
    difficulty: 2,
  },
  {
    id: 'fv-009',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 3/6 të drejtkëndëshit duke klikuar mbi pjesët',
    shape: 'rectangle',
    numerator: 3,
    denominator: 6,
    hints: [
      'Drejtkëndëshi ka 6 pjesë',
      '3/6 është njësoj si 1/2',
      'Kliko 3 nga 6 pjesët',
    ],
    difficulty: 2,
  },
  {
    id: 'fv-010',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 4/6 të rrethit duke klikuar mbi pjesët',
    shape: 'circle',
    numerator: 4,
    denominator: 6,
    hints: [
      'Rrethi ka 6 pjesë gjithsej',
      '4/6 do të thotë 4 pjesë',
      'Mbushe 4 nga 6 pjesët',
    ],
    difficulty: 2,
  },
  {
    id: 'fv-011',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 2/5 të drejtkëndëshit duke klikuar mbi pjesët',
    shape: 'rectangle',
    numerator: 2,
    denominator: 5,
    hints: [
      'Drejtkëndëshi ka 5 pjesë',
      '2/5 do të thotë 2 nga 5 pjesë',
      'Kliko 2 nga 5 kutitë',
    ],
    difficulty: 2,
  },
  {
    id: 'fv-012',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 3/9 të katrorit duke klikuar mbi pjesët',
    shape: 'square',
    numerator: 3,
    denominator: 9,
    hints: [
      'Katrori ka 9 pjesë (si tabelë 3×3)',
      '3/9 do të thotë 3 pjesë nga 9',
      '3/9 = 1/3 e katrorit',
    ],
    difficulty: 2,
  },
  // ── HARD (difficulty 3) ───────────────────────────────────────────
  {
    id: 'fv-013',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 5/6 të rrethit duke klikuar mbi pjesët',
    shape: 'circle',
    numerator: 5,
    denominator: 6,
    hints: [
      'Rrethi ka 6 pjesë gjithsej',
      '5/6 është pothuajse i plotë – mbetet vetëm 1 pjesë bosh',
      'Kliko 5 nga 6 pjesët',
    ],
    difficulty: 3,
  },
  {
    id: 'fv-014',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 7/8 të rrethit (pica) duke klikuar mbi fetat',
    shape: 'circle',
    numerator: 7,
    denominator: 8,
    hints: [
      'Pica ka 8 feta gjithsej',
      '7/8 – mbetet vetëm 1 fetë e pamarrë',
      'Kliko 7 nga 8 fetat',
    ],
    difficulty: 3,
  },
  {
    id: 'fv-015',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 3/5 të drejtkëndëshit duke klikuar mbi pjesët',
    shape: 'rectangle',
    numerator: 3,
    denominator: 5,
    hints: [
      'Drejtkëndëshi ka 5 pjesë',
      '3/5 – kliko 3 nga 5 kutitë',
      'Mbushe 3, lëre 2 bosh',
    ],
    difficulty: 3,
  },
  {
    id: 'fv-016',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 6/8 të rrethit (pica) duke klikuar mbi fetat',
    shape: 'circle',
    numerator: 6,
    denominator: 8,
    hints: [
      'Pica ka 8 feta',
      '6/8 = 3/4 e picës',
      'Kliko 6 feta nga 8',
    ],
    difficulty: 3,
  },
  {
    id: 'fv-017',
    type: 'fraction_visual',
    topicId: 'thyesat',
    questionAl: 'Trego 4/9 të katrorit duke klikuar mbi pjesët',
    shape: 'square',
    numerator: 4,
    denominator: 9,
    hints: [
      'Katrori ka 9 pjesë',
      '4/9 – pak më pak se gjysma',
      'Kliko saktësisht 4 nga 9 katrorrët',
    ],
    difficulty: 3,
  },
]

// Shuffle helper
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getFractionQuestionsForTopic(
  topicId: string,
  count = 5
): FractionVisualQuestion[] {
  const questions = fractionVisualQuestions.filter(q => q.topicId === topicId)
  return shuffleArray(questions).slice(0, count)
}
