# CLAUDE.md

## Project Overview

CLICKMOJI is a single-file browser game (`clickmoji.html`) where players match emoji sequences to satirical headlines. It's styled as a prestige newspaper parody with an AI employee training concept.

## Architecture

**Single file**: All HTML, CSS, and JavaScript live in `clickmoji.html`. No build step, no bundler, no framework.

**CSS Custom Properties** (`:root`): `--bg`, `--tx`, `--mt`, `--bd`, `--green`, `--red`, `--gold`, `--orange`, `--game-bg`, `--game-bd`, `--game-tx`.

**Google Fonts**: Playfair Display (headlines), Libre Baskerville (body), Space Mono (monospace/UI).

## Game Structure

### State Machine
Three screens managed by toggling `.hidden` class on `#ss` (start), `#ga` (game), `#go` (game over). All are children of `.game-wrap` (fixed 640px height).

### Core Functions
- `rq()` — Render next question (pick headline, generate emoji, build options, start timer)
- `pick(i)` — Handle answer selection (correct → auto-advance after 1.2s, wrong → game over)
- `startGame()` / `resetGame()` / `confirmRestart()` — State transitions
- `gameOver()` — Display results with randomized newspaper-style headline
- `bar()` — Update score/round display in card header

### Difficulty Scaling
- `getSC(q)` — Same-category distractor count (0 at round 1-2, up to 3 at round 5+)
- `getTL(q)` — Timer length in seconds (none for rounds 1-4, decreasing from 20s to 8s)
- `getRL(q)` — Employee rank title (INTERN → CHIEF EMOJI OFFICER)

### Question Data
`HEADLINES` object: 8 categories, each with 6 `{text, emoji}` entries. 48 total headlines.

Categories: lifestyle, tech, food, health, travel, relationships, finance, culture.

### Emoji Toggle System
- `setLangMode(mode)` — Switches between English and Emoji modes via masthead toggle
- `applyEmojiMode()` — Converts newspaper chrome (masthead, nav, dispatches, ticker, ads, weather, date) to emoji equivalents using `data-orig` attributes for storage
- `restoreTextMode()` — Restores all elements with `data-orig` to their original text/HTML
- Game content (emoji displays, answer options, score) is never touched by emoji mode

### Newspaper Chrome
- `initMasthead()` — Sets date
- `initWeather()` — Random humorous weather from `FAKE_WEATHER` array
- `initTicker()` — Scrolling stock ticker with fake emoji-related symbols
- `initColumns()` — Generates satirical "Most Read" dispatches from `FAKE_DISPATCHES`
- `refreshAds()` — Rotates absurd classified ads from `FAKE_ADS`
- `initBadge()` — Sets random employee name from `FAKE_NAMES`

## Key Design Decisions

- **Fixed game container** (640px) prevents layout shifts between states
- **Keyboard guard**: 1-4 keys are ignored when an `<input>` is focused (prevents accidental answers while typing name)
- **Auto-advance**: 1.2s delay after correct answer, skippable after 350ms via any key press
- **Streak-based scoring**: Consecutive correct answers earn bonus multiplier (tracked internally, not displayed)
- **Employee rank titles** escalate absurdly to match the newspaper satire tone

## Running Locally

```bash
python3 -m http.server 8765
# or
ruby -run -e httpd . -p 8765
```

The `serve.rb` file is a Ruby WEBrick server helper (used during development on macOS).
