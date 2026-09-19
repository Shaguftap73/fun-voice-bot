// BRAIN: GPT-4o-mini (with CC-SC-R system prompts) — text -> AI response
import { NextResponse } from "next/server";
import { getOpenAI } from "../../../lib/openai";
import { getCharacter } from "../../../lib/characters";

export const runtime = "nodejs";

const MAX_HISTORY_TURNS = 12;

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, characterId, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing 'message' string in request body." },
        { status: 400 }
      );
    }

    const character = getCharacter(characterId);
    const openai = getOpenAI();

    const trimmedHistory = Array.isArray(history)
      ? history.slice(-MAX_HISTORY_TURNS)
      : [];

    const messages = [
      { role: "system", content: character.systemPrompt },
      ...trimmedHistory.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: character.temperature ?? 0.7,
      max_tokens: 300,
      messages,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({
      reply,
      characterId: character.id,
      characterName: character.name,
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: err.message || "Chat completion failed." },
      { status: 500 }
    );
  }
}