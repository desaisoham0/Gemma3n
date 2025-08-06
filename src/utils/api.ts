import type { Message } from "../types";

// const OLLAMA_URL = "http://localhost:11434/api/chat"; // Uncomment this line for local development
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL; // Use the environment variable for the Ollama URL
const MODEL = "gemma3n:e4b";

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
