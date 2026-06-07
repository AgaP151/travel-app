const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function getAdminUsers() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not load users");
  }

  return response.json();
}