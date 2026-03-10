# CLAUDE.md

## Project Overview

CLICKMOJI is a Next.js browser game where players match emoji sequences to satirical headlines. It's styled as a prestige newspaper parody with an AI employee training concept. Supports both solo and real-time multiplayer modes.

## Architecture

**Next.js 14** (App Router) + TypeScript + Tailwind CSS + Firebase.

**CSS Custom Properties** (`:root`): `--bg`, `--tx`, `--mt`, `--bd`, `--green`, `--red`, `--gold`, `--orange`, `--game-bg`, `--game-bd`, `--game-tx`.

**Google Fonts** (via `next/font/google`): Playfair Display (headlines), Libre Baskerville (body), Space Mono (monospace/UI).

## File Structure

- `app/page.tsx` — Home (solo game, full newspaper layout)
- `app/lobby/page.tsx` — Multiplayer lobby (create/join room)
- `app/room/[roomId]/page.tsx` — Multiplayer game room
- `app/api/` — API routes (rooms CRUD, scores)
- `components/game/` — SoloGame state machine, StartScreen, GameScreen, GameOverScreen
- `components/newspaper/` — Masthead, Ticker, TopAd, SectionsNav, Columns
- `components/multiplayer/` — Lobby, WaitingRoom, MultiplayerGame
- `lib/game-data.ts` — All content arrays (headlines, ads, stocks, names, weather, etc.)
- `lib/game-logic.ts` — Difficulty fns, seeded PRNG (mulberry32), question picker
- `lib/firebase.ts` — Firebase client init (lazy, build-safe)
- `lib/emoji-react.ts` — Floating emoji + confetti effects
- `types/game.ts` — TypeScript interfaces

## Game Structure

### State Machine
Three screens in `SoloGame.tsx`: `"start"` | `"game"` | `"gameover"`, managed via React state.

### Core Components
- `SoloGame` — Full state machine, orchestrates question generation and scoring
- `GameScreen` — Timer, emoji display, 4 answer buttons, keyboard handler
- `StartScreen` — Employee badge, name input, shuffle button
- `GameOverScreen` — Results with randomized newspaper-style headline

### Difficulty Scaling (`lib/game-logic.ts`)
- `getSC(q)` — Same-category distractor count (0 at round 1-5, up to 3 at round 5+)
- `getTL(q)` — Timer length in seconds (none for rounds 1-10, decreasing from 20s to 9s)
- `getRL(q)` — Employee rank title (INTERN → CHIEF EMOJI OFFICER)

### Question Data (`lib/game-data.ts`)
`CL` array: 8 categories, ~12-13 `{h, e}` entries each. 100+ total headlines.

### Seeded PRNG (Multiplayer)
`mulberry32` in `lib/game-logic.ts` — ensures all players in a room get identical questions from the same seed.

### Emoji Toggle System
Managed as React state in `Masthead.tsx` (`emojiMode` boolean), passed down to all newspaper chrome components. Game content is never affected.

### Newspaper Chrome (components/newspaper/)
- `Masthead` — Lang toggle, date, weather, edition
- `Ticker` — Scrolling stocks ticker
- `TopAd` — Ad with emoji react spawner, refreshes on each question
- `SectionsNav` — Nav links
- `Columns` — "Most Read" right column dispatches

## Multiplayer

### Firebase Data Model
- `rooms/{roomId}` — code, status, hostSessionId, seed, maxPlayers, timestamps
- `rooms/{roomId}/players/{uid}` — playerName, isHost, currentRound, isAlive
- `scores/{scoreId}` — global leaderboard (append-only)

### Real-time Flow
1. Host creates room via `POST /api/rooms`
2. Players join with code via `POST /api/rooms/[roomId]/join`
3. All clients subscribe via Firestore `onSnapshot`
4. Host starts game → all clients receive seed → identical questions
5. Players write their own progress to their player doc
6. Live scoreboard via `onSnapshot` on players subcollection

## Key Design Decisions

- **Fixed game container** (510px) prevents layout shifts between states
- **Keyboard guard**: 1-4 keys ignored when `<input>` is focused
- **Auto-advance**: 1.2s delay after correct answer, skippable after 350ms
- **Lazy Firebase init**: `getDb()` / `getFirebaseAuth()` prevent build-time crashes without env vars
- **Solo game is fully offline** — no Firebase calls needed
- **API routes handle room creation/start** (server-side writes prevent cheating)
- **Players write their own docs** (Firestore rules scoped to UID)

## Testing

### Commands
- `npm test` — Run all unit tests (Vitest)
- `npm run test:watch` — Run unit tests in watch mode
- `npm run test:e2e` — Run E2E tests (Playwright, auto-starts dev server)
- `npm run test:e2e:ui` — Run E2E tests with Playwright UI
- `npm run typecheck` — TypeScript type checking (`tsc --noEmit`)

### Test Structure
```
tests/
  setup.ts                        # Vitest setup (@testing-library/jest-dom)
  unit/
    game-logic.test.ts             # Pure function tests (mulberry32, shuffle, getSC, getTL, etc.)
    game-data.test.ts              # Data integrity tests (headlines, ads, stocks, names)
  e2e/
    solo-game-flow.spec.ts         # Start → play → game over → restart
    keyboard-navigation.spec.ts    # Keys 1-4, Enter, input focus guard
    timer-behavior.spec.ts         # Timer at round 11+, expiry
    game-over-states.spec.ts       # Win/loss/timeout display
    newspaper-chrome.spec.ts       # Masthead, ticker, nav, columns, ads
    emoji-mode.spec.ts             # Toggle, chrome changes, game unaffected
    edge-cases.spec.ts             # Empty name, rapid clicks, maxLength, restart
```

### Conventions
- Unit tests use Vitest + jsdom + @testing-library/jest-dom
- E2E tests use Playwright (Chromium only)
- Answer buttons have `data-testid="correct-option"` or `data-testid="option"` for E2E targeting
- E2E tests auto-start the dev server via `playwright.config.ts` `webServer`

### Pre-commit Hooks
Husky + lint-staged runs on every commit:
- ESLint on staged `*.{ts,tsx}` files
- E2E tests are NOT in pre-commit (too slow); run manually or in CI

## Running Locally

```bash
npm install
npm run dev
```

Requires `.env.local` with Firebase config (see `.env.local.example`).
