import { useState } from "react";

const habitList = [
  { key: "water", label: "Drink Water", icon: "💧", desc: "8 glasses / day", color: "#06b6d4", bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.3)" },
  { key: "exercise", label: "Exercise", icon: "🏋️", desc: "30 min / day", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  { key: "sleep", label: "Sleep 8h", icon: "😴", desc: "Consistent schedule", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)" },
];

const HabitTracker = () => {
  const [habits, setHabits] = useState<Record<string, boolean>>({ water: false, exercise: false, sleep: false });

  const toggle = (key: string) => setHabits((p) => ({ ...p, [key]: !p[key] }));

  const completedCount = Object.values(habits).filter(Boolean).length;
  const progress = (completedCount / habitList.length) * 100;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-xl">
            🏃
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Daily Habits</h2>
            <p className="text-xs text-slate-500">Monitor daily wellness</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{completedCount}<span className="text-slate-600 text-lg">/{habitList.length}</span></p>
          <p className="text-xs text-slate-500">completed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: progress === 100
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
            }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-emerald-400 mt-1.5 animate-fade-in-up">🎉 All habits complete!</p>
        )}
      </div>

      {/* Habit items */}
      <div className="space-y-2">
        {habitList.map(({ key, label, icon, desc, color, bg, border }) => {
          const done = habits[key];
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left group"
              style={{
                background: done ? bg : 'rgba(15,23,42,0.6)',
                borderColor: done ? border : 'rgba(51,65,85,0.5)',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-all"
                style={{ background: done ? bg : 'rgba(30,41,59,0.8)' }}
              >
                {icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{label}</p>
                <p className="text-xs text-slate-600">{desc}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                style={{
                  borderColor: done ? color : '#334155',
                  background: done ? color : 'transparent',
                }}
              >
                {done && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;