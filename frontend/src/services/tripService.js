const API_URL = `${import.meta.env.VITE_API_URL}/trips`;

export async function getTrips() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
}

export async function addTrip(trip) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });

  if (!response.ok) {
    throw new Error("Failed to add trip");
  }

  return response.json();
}
export async function deleteTrip(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete trip");
  }
}