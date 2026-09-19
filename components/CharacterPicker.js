"use client";

const CHARACTERS = [
  { id: "gabbar", name: "Gabbar Singh", emoji: "🤠", tagline: "Playful villain" },
  { id: "mogambo", name: "Mogambo", emoji: "👑", tagline: "Grandiose villain" },
  { id: "basanti", name: "Basanti", emoji: "💫", tagline: "Warm & practical" },
  { id: "babu", name: "Babu Bhaiyya", emoji: "🪙", tagline: "Sarcastic uncle" },
];

export default function CharacterPicker({ selected, onSelect, disabled }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
      {CHARACTERS.map((c) => {
        const active = c.id === selected;
        return (
          <button
            key={c.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(c.id)}
            className={[
              "rounded-xl px-3 py-4 flex flex-col items-center gap-1 border transition",
              active
                ? "border-accent bg-accent/10 text-accent"
                : "border-white/10 bg-panel text-white/70 hover:border-white/30",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
          >
            <span className="text-2xl">{c.emoji}</span>
            <span className="text-sm font-semibold">{c.name}</span>
            <span className="text-[11px] text-white/40 text-center leading-tight">
              {c.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}