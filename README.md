# Matematika për Noar 🦉

A Progressive Web App (PWA) math quiz for 3rd-grade students, built in Albanian with Apple Pencil support.

**Live App:** https://math-for-noar.vercel.app

## Features

- **Albanian Language**: Full UI and questions in Albanian
- **Apple Pencil Support**: Scratch pad canvas for calculations
- **Khan Academy-style Learning**:
  - Mastery-based progression (80% to unlock next topic)
  - Step-by-step hints
  - Gamification (points, streaks, badges)
- **Topics**:
  - Mbledhja (Addition)
  - Zbritja (Subtraction)
  - Shumëzimi (Multiplication)
  - Pjesëtimi (Division)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: next-pwa for offline support
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Installing on iPad

1. Open the deployed URL in Safari on iPad
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will work offline and support Apple Pencil

## Project Structure

```
/src
  /app                 # Next.js app router pages
    /quiz/[topic]      # Quiz page for each topic
    /results           # Quiz results page
  /components          # React components
    ScratchPad.tsx     # Apple Pencil drawing canvas
  /lib                 # Utilities
    i18n.ts            # Albanian translations
    gameState.ts       # Progress & gamification
  /data
    questions.ts       # Question bank
/public
  /icons               # PWA icons
  manifest.json        # PWA manifest
/pdfs                  # Source textbooks (gitignored)
```

## Adding Questions

Edit `src/data/questions.ts` to add new questions. Each question needs:

```typescript
{
  id: 'unique-id',
  type: 'multiple_choice',
  questionAl: 'Question in Albanian',
  options: [10, 20, 30, 40],
  correctAnswer: 20,
  hints: [
    'First hint',
    'Second hint',
    'Step-by-step solution'
  ],
  difficulty: 1 | 2 | 3
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Deploy automatically

### Manual

```bash
npm run build
# Deploy .next folder to your hosting
```

## License

Private - Built for Noar's education
