import { useState } from "react";

const symptoms = [
  { key: "fever", label: "Fever", icon: "🌡️", desc: "Elevated body temperature" },
  { key: "cough", label: "Cough", icon: "🫁", desc: "Persistent coughing" },
  { key: "fatigue", label: "Fatigue", icon: "😴", desc: "Unusual tiredness" },
];

const DiseasePredictor = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({ fever: false, cough: false, fatigue: false });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  const predict = async () => {
    setLoading(true);
    setResult(""); // Clear previous result
    try {
      // Swapped local URL for your Render production URL
      const res = await fetch("https://medule-main.onrender.com/predict-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked),
      });

      if (!res.ok) throw new Error("Failed to connect to server");

      const data = await res.json();
      setResult(data.disease);
    } catch (error) {
      console.error("Prediction Error:", error);
      setResult("Server error. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const activeCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-xl">
          🧠
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Disease Predictor</h2>
          <p className="text-xs text-slate-500">Identifies potential conditions</p>
        </div>
      </div>

      {/* Symptom cards */}
      <div className="space-y-2 mb-5">
        {symptoms.map(({ key, label, icon, desc }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left"
            style={{
              background: checked[key] ? 'rgba(168,85,247,0.1)' : 'rgba(15,23,42,0.6)',
              borderColor: checked[key] ? 'rgba(168,85,247,0.4)' : 'rgba(51,65,85,0.6)',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all"
              style={{ background: checked[key] ? 'rgba(168,85,247,0.2)' : 'rgba(30,41,59,0.8)' }}
            >
              {icon}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium transition-colors ${checked[key] ? 'text-purple-300' : 'text-slate-300'}`}>
                {label}
              </p>
              <p className="text-xs text-slate-600">{desc}</p>
            </div>
            <div
              className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                borderColor: checked[key] ? '#a855f7' : '#475569',
                background: checked[key] ? '#a855f7' : 'transparent',
              }}
            >
              {checked[key] && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeCount > 0 && (
        <p className="text-xs text-slate-500 mb-3">
          {activeCount} symptom{activeCount > 1 ? 's' : ''} selected
        </p>
      )}

      <button
        onClick={predict}
        disabled={activeCount === 0 || loading}
        className="w-full py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: activeCount === 0 ? 'rgba(15,23,42,0.8)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
          border: '1px solid rgba(168,85,247,0.25)',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analyzing...
          </span>
        ) : 'Predict Disease'}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 animate-fade-in-up">
          <p className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-1">Predicted Condition</p>
          <p className="text-white font-semibold">{result}</p>
          <p className="text-xs text-slate-500 mt-2">⚠️ Consult a doctor for accurate diagnosis</p>
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor;