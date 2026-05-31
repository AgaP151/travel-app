const API_URL = `${import.meta.env.VITE_API_URL}/trips`;

export async function getTrips() {
  const response = await fetch(API_URL);

  return response.json();
}