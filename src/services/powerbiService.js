export async function getPowerBIEmbedInfo() {
  // const response = await fetch("http://127.0.0.1:8000/embed-info");
  const response = await fetch("http://localhost:5047/api/powerbi/embed-token");
  if (!response.ok) throw new Error("Failed to fetch embend info");
  return response.json();
}
