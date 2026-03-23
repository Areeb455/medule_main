export const predictFood = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://medule-main.onrender.com", {
    method: "POST",
    body: formData,
  });

  return response.json();
};