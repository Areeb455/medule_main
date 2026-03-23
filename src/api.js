// 1. Food Prediction
export const predictFood = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://medule-main.onrender.com/predict-food", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Food prediction failed");
  return response.json();
};

// 2. PDF Parser
export const parsePDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://medule-main.onrender.com/parse-pdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("PDF parsing failed");
  return response.json();
};

// 3. Disease Predictor
export const predictDisease = async (symptoms) => {
  // Expects JSON: { "fever": true, "cough": false, "fatigue": true }
  const response = await fetch("https://medule-main.onrender.com/predict-disease", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(symptoms),
  });

  if (!response.ok) throw new Error("Disease prediction failed");
  return response.json();
};

// 4. Add Patient
export const addPatient = async (patientData) => {
  // Expects JSON: { "name": "string", "age": 0 }
  const response = await fetch("https://medule-main.onrender.com/add-patient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) throw new Error("Failed to add patient");
  return response.json();
};

// 5. Get All Patients
export const getPatients = async () => {
  const response = await fetch("https://medule-main.onrender.com/patients", {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
};