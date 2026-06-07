const API_URL = `${import.meta.env.VITE_API_URL}/trips`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getTrips() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

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
      ...getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete trip");
  }
}

export async function inviteUserToTrip(tripId, email) {
  const response = await fetch(`${API_URL}/${tripId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("USER_ALREADY_ASSIGNED");
    }

    throw new Error("Failed to invite user to trip");
  }
}

export async function removeUserFromTrip(tripId, email) {
  const response = await fetch(`${API_URL}/${tripId}/users`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove user from trip");
  }
}

export async function copyTripToMyTrips(tripId) {
  const response = await fetch(`${API_URL}/${tripId}/copy`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to copy trip");
  }

  return response.json();
}

export async function getTripParticipants(tripId) {
  const response = await fetch(`${API_URL}/${tripId}/participants`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trip participants");
  }

  return response.json();
}