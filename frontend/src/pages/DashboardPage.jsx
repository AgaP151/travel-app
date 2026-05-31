import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTrips } from "../services/tripService";

function DashboardPage() {
  const navigate = useNavigate();
const [trips, setTrips] = useState([]);

useEffect(() => {
  async function loadTrips() {
    const data = await getTrips();
    setTrips(data);
  }

  loadTrips();
}, []);
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>You are logged in.</p>
<section>
  <h2>Your trips</h2>

  {trips.length === 0 ? (
    <p>No trips yet.</p>
  ) : (
    <ul>
      {trips.map((trip) => (
        <li key={trip.id}>
          <strong>{trip.title}</strong> — {trip.destination}
        </li>
      ))}
    </ul>
  )}
</section>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}

export default DashboardPage;