import { useState } from "react";
// 1. Import the centralized API function
import { predictFood } from "../api"; 

const FoodPredictor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ prediction: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null); // Clear previous result before starting
    
    try {
      // 2. Use the predictFood function from api.js
      // This automatically uses the Render URL: https://medule-main.onrender.com/predict-food
      const data = await predictFood(file);
      setResult(data);
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Failed to connect to the AI server. It might be starting up—please try again in a minute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-xl">
          🍔
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Food AI</h2>
          <p className="text-xs text-slate-500">Analyzes dietary intake</p>
        </div>
      </div>

      {/* Upload area */}
      <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-teal-500/50 rounded-xl p-6 cursor-pointer transition-all duration-200 bg-slate-900/40 hover:bg-teal-500/5 mb-4">
        {preview ? (
          <img src={preview} alt="preview" className="h-28 w-full object-cover rounded-lg" />
        ) : (
          <>
            <div className="text-3xl mb-2 opacity-50 group-hover:opacity-80 transition-opacity">📷</div>
            <p className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">
              Click to upload food image
            </p>
            <p className="text-slate-600 text-xs mt-1">PNG, JPG up to 10MB</p>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      <button
        onClick={upload}
        disabled={!file || loading}
        className="w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: !file || loading ? undefined : 'linear-gradient(135deg, #0d9488, #06b6d4)',
          backgroundColor: !file || loading ? 'rgba(15,23,42,0.8)' : undefined,
          color: 'white',
          border: '1px solid rgba(20,184,166,0.2)',
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
        ) : 'Predict Food'}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold">{result.prediction}</p>
            <span className="text-xs text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded-full">
              {(result.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${result.confidence * 100}%`,
                background: 'linear-gradient(90deg, #0d9488, #06b6d4)',
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Confidence score</p>
        </div>
      )}
    </div>
  );
};

export default FoodPredictor;