import "./App.css";
import FoodPredictor from "./components/FoodPredictor";
import PdfUpload from "./components/PdfUpload";
import DiseasePredictor from "./components/DiseasePredictor";
import HabitTracker from "./components/HabitTracker";
import PatientManager from "./components/PatientManager";

function App() {
  return (
    <>
      <div className="app-bg" />
      <div className="relative z-10 min-h-screen p-6 md:p-10">

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 text-teal-400 text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            AI Health Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
            <span className="text-white">Medule</span>
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"> AI</span>
            <span className="ml-3"></span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Powerful AI-driven tools to manage and understand your health data
          </p>
        </header>

        {/* Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="card"><FoodPredictor /></div>
          <div className="card"><PdfUpload /></div>
          <div className="card"><DiseasePredictor /></div>
          <div className="card"><HabitTracker /></div>
          <div className="card lg:col-span-2"><PatientManager /></div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-slate-600 text-sm">
          © {new Date().getFullYear()} Medule AI · Built for better health
        </footer>
      </div>
    </>
  );
}

export default App;