# Gemma 3n Chat – talk to an LLM right in your browser

A lightweight chat app that runs Google’s **Gemma 3n** model (or any other supported model) locally via Ollama.  
No internet. No accounts. No one snooping on your data. Every conversation stays local, stored safely in your browser with `sql.js` and `localStorage`.

---

## Features

- **Offline / private** – Powered by [Ollama](https://ollama.com/) and your hardware.
- **Pick your model** – Easily swap in any LLM supported by Ollama.
- **Clean React UI** – Tailwind‑styled chat with markdown, code, and math (via KaTeX).
- **Multiple conversations** – Sidebar to jump between conversations. Titles auto-generate on the fly.
- **Local history** – Everything's saved using SQLite (`sql.js`) and `localStorage`.

---

## Tech Stack

| Layer     | Choice                        |
| --------- | ----------------------------- |
| Framework | Vite + React + TypeScript     |
| Styling   | Tailwind CSS, Heroicons       |
| DB        | sql.js (SQLite → WebAssembly) |
| LLM       | Ollama (any supported model)  |

---

## Quick Start

```bash
# prerequisites
ollama pull gemma3n:e4b   # ≈ 7.5 GB
pnpm install              # or npm i
pnpm add @heroicons/react # or npm i @heroicons/react
pnpm add react-markdown react-syntax-highlighter
pnpm remark-math rehype-katex remark-gfm
pnpm sql.js
pnpm add uuid

# dev server
pnpm dev                  # http://localhost:5173
```

## Changing model

```ts
// src/utils/api.ts

import type { Message } from "../types";

const OLLAMA_URL = "http://localhost:11434/api/chat"; // <--- Change this line with your server
const MODEL = "gemma3n:e4b"; // <---- Change this line with your model

export async function fetchOllamaResponse(
  messages: Message[],
): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.message.content;
}
```
