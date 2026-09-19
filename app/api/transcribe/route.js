// EARS: Whisper API (Speech-to-Text) — voice (audio blob) -> text
import { NextResponse } from "next/server";
import { getOpenAI } from "../../../lib/openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided under field name 'audio'." },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const arrayBuffer = await audioFile.arrayBuffer();
    const file = new File([arrayBuffer], audioFile.name || "audio.webm", {
      type: audioFile.type || "audio/webm",
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      // language: "en", // optional: uncomment to force a language
    });

    return NextResponse.json({ text: transcription.text });
  } catch (err) {
    console.error("Transcription error:", err);
    return NextResponse.json(
      { error: err.message || "Transcription failed." },
      { status: 500 }
    );
  }
}