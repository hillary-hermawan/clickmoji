# CLICKMOJI

**An emoji quiz game disguised as a prestige newspaper.**

Match AI-generated emoji sequences to their original headlines before the timer runs out. One wrong answer and you're fired.

## How to Play

1. **Review the emojis** — The AI's attempt at translating a headline
2. **Match the headline** — Pick the correct one from four candidates
3. **Beat the deadline** — Timer kicks in and gets shorter each round

Press or click 1–4 to answer. One mistake and it's game over.

## Features

- Single-file HTML/CSS/JS — no build tools, no dependencies
- Prestige newspaper parody aesthetic (Playfair Display, Libre Baskerville, Space Mono)
- Employee badge with randomized fake names
- Progressive difficulty: more same-category distractors + countdown timer at higher rounds
- Employee advancement ranks: Intern → Junior Associate → Mid-Level Translator → Senior Emoji Correspondent → VP of Translation → Chief Emoji Officer
- Emoji Mode (BETA): toggle all newspaper chrome to emoji equivalents via the masthead language switcher
- Fake stock ticker, satirical dispatches, absurd advertisements
- Keyboard and click support
- Responsive layout

## Running Locally

Serve the file with any static server:

```bash
# Python
python3 -m http.server 8765

# Ruby
ruby -run -e httpd . -p 8765

# Node
npx serve -p 8765
```

Then open `http://localhost:8765/clickmoji.html`.

## Stack

- **HTML/CSS/JS** — single file, zero dependencies
- **Google Fonts** — Playfair Display, Libre Baskerville, Space Mono
- 48 headlines across 8 categories, each with hand-crafted emoji translations
