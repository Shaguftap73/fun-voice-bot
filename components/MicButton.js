"use client";

import { useRef, useState } from "react";

export default function MicButton({ onRecordingComplete, disabled, status }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());
        onRecordingComplete(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert(
        "Could not access the microphone. Please check your browser permissions."
      );
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function handleClick() {
    if (disabled) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const label = isRecording
    ? "Listening… tap to stop"
    : status || "Tap to talk";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={[
          "w-24 h-24 rounded-full flex items-center justify-center text-3xl transition",
          isRecording ? "bg-red-500 pulse-ring" : "bg-accent",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:brightness-110",
        ].join(" ")}
      >
        {isRecording ? "⏹" : "🎙️"}
      </button>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}