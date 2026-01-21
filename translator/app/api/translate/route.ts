import { NextRequest, NextResponse } from "next/server";
import { translate, TranslationDirection } from "@/lib/ollama";

interface TranslateRequest {
  text: string;
  direction: TranslationDirection;
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json();

    if (!body.text || !body.direction) {
      return NextResponse.json(
        { error: "Missing required fields: text and direction" },
        { status: 400 }
      );
    }

    if (body.direction !== "ja-en" && body.direction !== "en-ja") {
      return NextResponse.json(
        { error: "Invalid direction. Use 'ja-en' or 'en-ja'" },
        { status: 400 }
      );
    }

    const result = await translate(body.text, body.direction);

    return NextResponse.json({ translation: result });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}
