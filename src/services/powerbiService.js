export async function getPowerBIEmbedInfo() {
  const response = await fetch("http://127.0.0.1:8000/embed-info");
  if (!response.ok) throw new Error("Failed to fetch embend info");
  return response.json();
}
