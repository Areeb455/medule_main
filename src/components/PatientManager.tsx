import { useState, useEffect } from "react";

interface Patient {
  name: string;
  age: number;
}

const PatientManager = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const addPatient = async () => {
    if (!name || !age) return;
    setAdding(true);
    try {
      await fetch("http://127.0.0.1:8000/add-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: parseInt(age) }),
      });
      setName("");
      setAge("");
      loadPatients();
    } finally {
      setAdding(false);
    }
  };

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/patients");
      const data = await res.json();
      setPatients(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const avatarColor = (n: string) => {
    const colors = ["#0d9488", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-xl">
            🏥
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Patient Management</h2>
            <p className="text-xs text-slate-500">Manage patient records</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span className="text-xs text-slate-400">{patients.length} patients</span>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-3 mb-6">
        <input
          value={name}
          placeholder="Patient name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPatient()}
          className="flex-1 bg-slate-900/80 border border-slate-700/60 focus:border-teal-500/50 outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-colors"
        />
        <input
          value={age}
          placeholder="Age"
          type="number"
          onChange={(e) => setAge(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPatient()}
          className="w-24 bg-slate-900/80 border border-slate-700/60 focus:border-teal-500/50 outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-colors"
        />
        <button
          onClick={addPatient}
          disabled={!name || !age || adding}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
            border: '1px solid rgba(20,184,166,0.3)',
          }}
        >
          {adding ? '...' : '+ Add'}
        </button>
      </div>

      {/* Patient list */}
      {loading ? (
        <div className="text-center py-8 text-slate-600 text-sm">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
          <p className="text-slate-600 text-sm">No patients yet</p>
          <p className="text-slate-700 text-xs mt-1">Add your first patient above</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2">
          {patients.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/60 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: avatarColor(p.name) }}
              >
                {initials(p.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{p.name}</p>
                <p className="text-xs text-slate-500">{p.age} years old</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500/60 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientManager;