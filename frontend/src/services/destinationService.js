const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getDestinationDetails(query) {
  const token = localStorage.getItem("token");

  const response = await fetch(
`${API_URL}/destinations/details?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Could not load destination details");
  }

  return response.json();
}