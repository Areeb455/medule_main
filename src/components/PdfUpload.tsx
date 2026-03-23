import { useState } from "react";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/parse-pdf", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setData(result);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">📄 Medical Report AI</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={upload}
        className="mt-3 bg-green-500 px-4 py-2 rounded-lg"
      >
        Analyze
      </button>

      {data && (
        <div className="mt-4 text-sm opacity-80">
          <p><b>Summary:</b> {data.summary}</p>
          <p><b>Keywords:</b> {data.keywords.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;