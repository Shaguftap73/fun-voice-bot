"use client";

export default function ConversationLog({ messages }) {
  if (!messages.length) {
    return (
      <div className="text-white/30 text-sm text-center py-10">
        Pick a character, tap the mic, and start talking.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {messages.map((m, i) => (
        <div
          key={i}
          className={[
            "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
            m.role === "user"
              ? "self-end bg-accent/20 text-white"
              : "self-start bg-panel text-white/90 border border-white/10",
          ].join(" ")}
        >
          {m.role === "assistant" && m.characterName && (
            <div className="text-[11px] uppercase tracking-wide text-accent mb-1">
              {m.characterName}
            </div>
          )}
          {m.content}
        </div>
      ))}
    </div>
  );
}