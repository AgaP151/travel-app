const API_URL = import.meta.env.VITE_API_URL;

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getTasks(tripId) {
  const response = await fetch(`${API_URL}/trips/${tripId}/tasks`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

export async function addTask(tripId, title) {
  const response = await fetch(`${API_URL}/trips/${tripId}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error("Failed to add task");
  }
  return response.json();
}

export async function toggleTask(tripId, taskId) {
  const response = await fetch(`${API_URL}/trips/${tripId}/tasks/${taskId}/toggle`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to toggle task");
  }
  return response.json();
}