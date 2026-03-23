import { useState } from "react";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Pointed to your Render backend
      const res = await fetch("https://medule-main.onrender.com/parse-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("PDF Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-white">📄 Medical Report AI</h2>

      <input 
        type="file" 
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])} 
        className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20"
      />

      <button
        onClick={upload}
        disabled={loading || !file}
        className="mt-3 bg-green-500 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {data && (
        <div className="mt-4 text-sm opacity-80 text-slate-200 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          <p className="mb-2"><b>Summary:</b> {data.summary}</p>
          <p><b>Keywords:</b> {data.keywords.length > 0 ? data.keywords.join(", ") : "No health keywords detected"}</p>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;