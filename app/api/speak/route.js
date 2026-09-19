// MOUTH: OpenAI TTS (Text-to-Speech) — AI response (text) -> spoken audio
import { NextResponse } from "next/server";
import { getOpenAI } from "../../../lib/openai";
import { getCharacter } from "../../../lib/characters";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, characterId, voice } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing 'text' string in request body." },
        { status: 400 }
      );
    }

    const character = getCharacter(characterId);
    const openai = getOpenAI();
    const selectedVoice = voice || character.ttsVoice || "alloy";

    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: selectedVoice,
      input: text,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json(
      { error: err.message || "Speech synthesis failed." },
      { status: 500 }
    );
  }
}