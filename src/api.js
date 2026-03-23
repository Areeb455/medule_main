const BASE_URL = "https://medule-main.onrender.com";

// 1. Food Prediction (Multipart/Form-Data)
export const predictFood = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/predict-food`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

// 2. PDF Parser (Multipart/Form-Data)
export const parsePDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/parse-pdf`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

// 3. Disease Predictor (JSON POST)
export const predictDisease = async (symptoms) => {
  // Expects symptoms object: { fever: true, cough: false, fatigue: true }
  const response = await fetch(`${BASE_URL}/predict-disease`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(symptoms),
  });
  return response.json();
};

// 4. Add Patient (JSON POST)
export const addPatient = async (patientData) => {
  // Expects patientData: { name: "John Doe", age: 30 }
  const response = await fetch(`${BASE_URL}/add-patient`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  });
  return response.json();
};

// 5. Get Patients (GET)
export const getPatients = async () => {
  const response = await fetch(`${BASE_URL}/patients`, {
    method: "GET",
  });
  return response.json();
};