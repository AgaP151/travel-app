import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>You are logged in.</p>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}

export default DashboardPage;