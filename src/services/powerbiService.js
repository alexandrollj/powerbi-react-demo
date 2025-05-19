export async function getPowerBIEmbedInfo() {
  const response = await fecth("http://localhost:5047/api/powerbi/embed-token");
  if (!response.ok) throw new Error("Failed to fetch embend info");
  return response.json();
}
