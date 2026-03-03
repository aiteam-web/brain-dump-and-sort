import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface FloatingDot {
  id: number;
  x: number;
  y: number;
}

interface Props {
  onComplete: (text: string) => void;
}

export const BrainDump = ({ onComplete }: Props) => {
  const [text, setText] = useState("");
  const [dots, setDots] = useState<FloatingDot[]>([]);
  const dotId = useRef(0);
  const maxChars = 2000;

  const progress = Math.min(text.length / 200, 1);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - progress * circumference;

  const handleChange = (val: string) => {
    if (val.length > maxChars) return;
    if (val.length > text.length && val.length % 15 === 0) {
      const newDot: FloatingDot = {
        id: dotId.current++,
        x: 20 + Math.random() * 60,
        y: 50 + Math.random() * 20,
      };
      setDots((prev) => [...prev, newDot]);
      setTimeout(() => setDots((prev) => prev.filter((d) => d.id !== newDot.id)), 2000);
    }
    setText(val);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">Brain Dump & Sort</h1>
        <p className="text-muted-foreground text-sm">Clear your mind by putting everything down.</p>
      </div>

      {/* Instruction */}
      <p className="text-foreground/80 text-sm leading-relaxed mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        What's taking up space in your mind right now?{"\n"}
        Write anything — big, small, messy, unfinished.
      </p>

      {/* Text area with floating dots */}
      <div className="relative flex-1 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-float-up pointer-events-none"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          />
        ))}
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Start writing here... Let it all out, gently."
          className="w-full h-64 p-5 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:glow-border transition-shadow duration-500 text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {text.length} / {maxChars}
          </span>

          {/* Progress ring */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Releasing Mental Load</span>
            <svg width="32" height="32" className="-rotate-90">
              <circle cx="16" cy="16" r="12" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 12}
                strokeDashoffset={2 * Math.PI * 12 - progress * 2 * Math.PI * 12}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => text.trim() && onComplete(text)}
        disabled={!text.trim()}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 transition-all duration-300 hover:shadow-soft active:scale-[0.98] animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        Next → Sort It
      </button>
    </div>
  );
};
