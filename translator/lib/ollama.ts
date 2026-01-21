const OLLAMA_BASE_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "gpt-oss:20b";

export type TranslationDirection = "ja-en" | "en-ja";

interface OllamaGenerateResponse {
  response: string;
  done: boolean;
}

function buildPrompt(text: string, direction: TranslationDirection): string {
  if (direction === "ja-en") {
    return `Translate the following Japanese text to English. Output only the translation, nothing else.

Japanese: ${text}

English:`;
  } else {
    return `Translate the following English text to Japanese. Output only the translation, nothing else.

English: ${text}

Japanese:`;
  }
}

export async function translate(
  text: string,
  direction: TranslationDirection
): Promise<string> {
  const prompt = buildPrompt(text, direction);

  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data: OllamaGenerateResponse = await response.json();
  return data.response.trim();
}
