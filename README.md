# CLICKMOJI

**An emoji quiz game disguised as a prestige newspaper.**

Match AI-generated emoji sequences to their original headlines before the timer runs out. One wrong answer and you're fired.

## How to Play

1. **Review the emojis** — The AI's attempt at translating a headline
2. **Match the headline** — Pick the correct one from four candidates
3. **Beat the deadline** — Timer kicks in and gets shorter each round

Press or click 1–4 to answer. One mistake and it's game over.

## Features

- Prestige newspaper parody aesthetic (Playfair Display, Libre Baskerville, Space Mono)
- Employee badge with randomized fake names
- Progressive difficulty: more same-category distractors + countdown timer at higher rounds
- Employee advancement ranks: Intern → Chief Emoji Officer
- Emoji Mode (BETA): toggle all newspaper chrome to emoji equivalents
- Fake stock ticker, satirical dispatches, absurd advertisements
- **Multiplayer** — Real-time competitive mode with shared rooms, seeded question sync, and live scoreboards
- Keyboard and click support
- Responsive layout

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + CSS custom properties (newspaper aesthetic)
- **Firebase Firestore** — real-time rooms + leaderboard
- **Firebase Anonymous Auth** — frictionless session identity
- **Google Fonts** — Playfair Display, Libre Baskerville, Space Mono
- 100+ headlines across 8 categories, each with hand-crafted emoji translations

## Setup

### Prerequisites

- Node.js 18+
- A Firebase project (free Spark plan works)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Anonymous Authentication** in Firebase Auth
3. Create a **Firestore Database**
4. Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.local.example .env.local
```

### 3. Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npx vercel
```

Set the same `NEXT_PUBLIC_FIREBASE_*` environment variables in your Vercel project settings.

## Testing

```bash
# Unit tests
npm test

# Unit tests in watch mode
npm run test:watch

# E2E tests (auto-starts dev server)
npm run test:e2e

# E2E tests with Playwright UI
npm run test:e2e:ui

# TypeScript type checking
npm run typecheck
```

Pre-commit hooks (Husky + lint-staged) automatically run ESLint on staged files.

## Project Structure

```
app/                     # Next.js App Router pages
  page.tsx               # Home (solo game)
  lobby/page.tsx         # Multiplayer lobby
  room/[roomId]/page.tsx # Multiplayer game room
  api/                   # API routes (rooms, scores)
components/
  game/                  # Solo game components (state machine)
  newspaper/             # Newspaper chrome (masthead, ticker, ads, columns)
  multiplayer/           # Multiplayer UI (lobby, waiting room, live game)
lib/
  game-data.ts           # All content arrays
  game-logic.ts          # Difficulty scaling, seeded PRNG, question picker
  firebase.ts            # Firebase client config
  emoji-react.ts         # Floating emoji + confetti effects
types/
  game.ts                # TypeScript interfaces
```
