"use client";

import { useRef, useState } from "react";
import CharacterPicker from "./CharacterPicker";
import MicButton from "./MicButton";
import ConversationLog from "./ConversationLog";

const STAGES = {
  IDLE: "idle",
  TRANSCRIBING: "Transcribing…",
  THINKING: "Thinking…",
  SPEAKING: "Speaking…",
};

export default function VoiceApp() {
  const [characterId, setCharacterId] = useState("gabbar");
  const [messages, setMessages] = useState([]);
  const [stage, setStage] = useState(STAGES.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const audioRef = useRef(null);

  const busy = stage !== STAGES.IDLE;

  async function handleRecordingComplete(blob) {
    setErrorMsg("");
    try {
      setStage(STAGES.TRANSCRIBING);
      const form = new FormData();
      form.append("audio", blob, "input.webm");
      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
      });
      const transcribeData = await transcribeRes.json();
      if (!transcribeRes.ok) throw new Error(transcribeData.error || "Transcription failed.");

      const userText = (transcribeData.text || "").trim();
      if (!userText) {
        setStage(STAGES.IDLE);
        setErrorMsg("Didn't catch that — try speaking again.");
        return;
      }

      const nextHistory = [...messages, { role: "user", content: userText }];
      setMessages(nextHistory);

      setStage(STAGES.THINKING);
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          characterId,
          history: messages,
        }),
      });
      const chatData = await chatRes.json();
      if (!chatRes.ok) throw new Error(chatData.error || "Chat failed.");

      const replyText = chatData.reply || "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText, characterName: chatData.characterName },
      ]);

      setStage(STAGES.SPEAKING);
      const speakRes = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText, characterId }),
      });
      if (!speakRes.ok) {
        const errData = await speakRes.json().catch(() => ({}));
        throw new Error(errData.error || "Speech synthesis failed.");
      }
      const audioBlob = await speakRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        audioRef.current.onended = () => setStage(STAGES.IDLE);
      } else {
        setStage(STAGES.IDLE);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
      setStage(STAGES.IDLE);
    }
  }

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-white">Voice Personas</h1>
        <p className="text-white/40 text-sm mt-1">
          Whisper → GPT-4o-mini → OpenAI TTS
        </p>
      </header>

      <CharacterPicker
        selected={characterId}
        onSelect={setCharacterId}
        disabled={busy}
      />

      <div className="w-full bg-panel/50 border border-white/10 rounded-2xl p-4 h-80 overflow-y-auto flex flex-col">
        <ConversationLog messages={messages} />
      </div>

      <MicButton
        onRecordingComplete={handleRecordingComplete}
        disabled={busy}
        status={stage !== STAGES.IDLE ? stage : null}
      />

      {errorMsg && (
        <p className="text-red-400 text-sm text-center max-w-md">{errorMsg}</p>
      )}

      <audio ref={audioRef} hidden />
    </div>
  );
}