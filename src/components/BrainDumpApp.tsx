import { useState, useCallback } from "react";
import { BrainDump } from "./BrainDump";
import { SortThoughts } from "./SortThoughts";
import { OneSmallStep } from "./OneSmallStep";
import { Reflection } from "./Reflection";

export interface ThoughtItem {
  id: string;
  text: string;
  bucket?: "action" | "later" | "letgo";
}

const BrainDumpApp = () => {
  const [screen, setScreen] = useState(0);
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([]);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((next: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 400);
  }, []);

  const handleDumpComplete = (text: string) => {
    const lines = text
      .split(/[\n,.;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const items: ThoughtItem[] = lines.map((t, i) => ({
      id: `t-${i}`,
      text: t,
    }));
    setThoughts(items);
    goTo(1);
  };

  const handleSortComplete = (sorted: ThoughtItem[]) => {
    setThoughts(sorted);
    goTo(2);
  };

  const screens = [
    <BrainDump key="dump" onComplete={handleDumpComplete} />,
    <SortThoughts key="sort" thoughts={thoughts} onComplete={handleSortComplete} onBack={() => goTo(0)} />,
    <OneSmallStep key="step" thoughts={thoughts.filter((t) => t.bucket === "action")} onComplete={() => goTo(3)} onBack={() => goTo(1)} />,
    <Reflection key="reflect" onBack={() => goTo(0)} />,
  ];

  return (
    <div className="min-h-screen gradient-calm relative overflow-hidden">
      {/* Breathing background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full bg-primary/5 animate-breathe" />
        <div className="absolute bottom-[-30%] right-[-30%] w-[120%] h-[120%] rounded-full bg-secondary/5 animate-breathe" style={{ animationDelay: "3s" }} />
      </div>

      <div
        className={`relative z-10 transition-all duration-500 ease-in-out ${
          transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {screens[screen]}
      </div>
    </div>
  );
};

export default BrainDumpApp;
