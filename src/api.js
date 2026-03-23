export const predictFood = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:8000/predict-food", {
    method: "POST",
    body: formData,
  });

  return response.json();
};