# Gemma 3n Chat – talk to an LLM right in your browser

A lightweight chat app that runs Google’s **Gemma 3n** model locally via Ollama.  
No internet, No cloud calls, no accounts, and every conversation lives in your own browser thanks to _sql.js_ + _localStorage_.

---

## Features

- **Offline / private** – Gemma 3n served by [Ollama](https://ollama.com/).  
- **Clean React UI** – Tailwind‑styled chat with markdown, code, and math (KaTeX).  
- **Multiple conversations** – Sidebar to switch chats; titles generated on first message.  
- **Local history** – SQLite (via `sql.js`) stored in `localStorage`.

---

## Tech Stack

| Layer     | Choice                          |
|-----------|---------------------------------|
| Framework | Vite + React + TypeScript       |
| Styling   | Tailwind CSS, Heroicons         |
| DB        | sql.js (SQLite → WebAssembly)   |
| LLM       | Ollama running `gemma3n:e4b`    |

---

## Quick Start

```bash
# prerequisites
ollama pull gemma3n:e4b   # ≈ 7.5 GB
pnpm install              # or npm i

# dev server
pnpm dev                  # http://localhost:5173
