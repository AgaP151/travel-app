import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addTrip, deleteTrip, getTrips, inviteUserToTrip, removeUserFromTrip } from "../services/tripService";
import { getDestinationDetails } from "../services/destinationService";
import { getTasks, addTask, toggleTask } from "../services/taskService";

function DashboardPage() {
  const navigate = useNavigate();
  const [destinationDetails, setDestinationDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({
    title: "",
    destination: "",
    description: "",
    price: "",
  });

  const [selectedTripId, setSelectedTripId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
 const [inviteEmail, setInviteEmail] = useState("");
const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error(error);
        alert("Could not load trips.");
      }
    }

    loadTrips();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleAddTrip(e) {
    e.preventDefault();
    if (
      !newTrip.title.trim() ||
      !newTrip.destination.trim() ||
      Number(newTrip.price) <= 0
    ) {
      alert("Title, destination and price are required.");
      return;
    }
    try {
      const createdTrip = await addTrip({
        ...newTrip,
        price: Number(newTrip.price),
      });

      setTrips([...trips, createdTrip]);

      setNewTrip({
        title: "",
        destination: "",
        description: "",
        price: "",
      });
    } catch (error) {
      console.error(error);
      alert("Could not add trip.");
    }
  }

  async function handleDeleteTrip(id) {
    try {
      await deleteTrip(id);
      setTrips(trips.filter((trip) => trip.id !== id));
      if (selectedTripId === id) {
        setDestinationDetails(null);
        setSelectedTripId(null);
        setTasks([]);
      }
    } catch (error) {
      console.error(error);
      alert("Could not delete trip.");
    }
  }
  async function handleSelectTrip(tripId, destination) {
    console.log("CLICKED TRIP:", tripId, destination);

    setDetailsLoading(true);
    setDetailsError("");
    setDestinationDetails(null);
    setSelectedTripId(tripId);
    setTasks([]);

    try {
      const detailsData = await getDestinationDetails(destination);
      console.log("DETAILS DATA:", detailsData);
      setDestinationDetails(detailsData);
    } catch (error) {
      console.error(error);
      setDetailsError("Could not load destination details.");
    } finally {
      setDetailsLoading(false);
    }

    try {
      const tasksData = await getTasks(tripId);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
      setTasks([]);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedTripId) return;

    try {
      const createdTask = await addTask(selectedTripId, newTaskTitle.trim());
      setTasks([...tasks, createdTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error(error);
      alert("Could not add task.");
    }
  }

  async function handleToggleTask(taskId) {
    try {
      const updatedTask = await toggleTask(selectedTripId, taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error(error);
      alert("Could not update task status.");
    }
  }
async function handleInviteUser(e) {
  e.preventDefault();

  if (!selectedTripId || !inviteEmail.trim()) {
    return;
  }

  try {
    await inviteUserToTrip(selectedTripId, inviteEmail.trim());
    setInviteMessage("User invited to trip.");
    setInviteEmail("");
  } catch (error) {
    console.error(error);
    setInviteMessage("Could not invite user.");
  }
}

async function handleRemoveUserFromTrip() {

  if (!selectedTripId || !inviteEmail.trim()) {
    return;
  }

  try {
    await removeUserFromTrip(selectedTripId, inviteEmail.trim());
    setInviteMessage("User removed from trip.");
    setInviteEmail("");
  } catch (error) {
    console.error(error);
    setInviteMessage("Could not remove user from trip.");
  }
}
  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <p className="dashboard-hero__subtitle">Discover amazing places</p>
        <h1>
          Where to <span>next?</span>
        </h1>
        <p>Plan your next journey and manage your trips.</p>
      </section>

      <section className="dashboard-card">
        <h2>Add new trip</h2>

        <form className="trip-form" onSubmit={handleAddTrip}>
          <input
            className="trip-form__field"
            type="text"
            placeholder="Title"
            value={newTrip.title}
            onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
          />

          <input
            className="trip-form__field"
            type="text"
            placeholder="Destination"
            value={newTrip.destination}
            onChange={(e) =>
              setNewTrip({ ...newTrip, destination: e.target.value })
            }
          />

          <textarea
            className="trip-form__field"
            placeholder="Description"
            value={newTrip.description}
            onChange={(e) =>
              setNewTrip({ ...newTrip, description: e.target.value })
            }
          />

          <input
            className="trip-form__field"
            type="number"
            placeholder="Price"
            value={newTrip.price}
            onChange={(e) => setNewTrip({ ...newTrip, price: e.target.value })}
          />

          <button className="trip-form__button " type="submit">
            Add trip
          </button>
        </form>
      </section>

      <section className="dashboard-card">
        <h2>Your trips</h2>

        {trips.length === 0 ? (
          <p>No trips yet.</p>
        ) : (
          <ul>
            {trips.map((trip) => (
              <li key={trip.id} className="trip-list__item">
                <button
                  className="trip-list__details"
                  type="button"
                  onClick={() => handleSelectTrip(trip.id, trip.destination)}
                >
                  <strong>{trip.title}</strong> — {trip.destination}
                </button>

                <button
                  className="trip-list__delete"
                  type="button"
                  onClick={() => handleDeleteTrip(trip.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(detailsLoading || detailsError || destinationDetails) && (
        <section className="dashboard-card destination-details">
          {detailsLoading && <p>Loading destination details...</p>}

          {detailsError && <p>{detailsError}</p>}

          {!detailsLoading && destinationDetails && (
            <>
              <h2>{destinationDetails.query}</h2>

              {destinationDetails.imageUrl && (
                <div className="destination-details__image-wrapper">
                  <img
                    src={destinationDetails.imageUrl}
                    alt={destinationDetails.query}
                    className="destination-details__image"
                  />
                </div>
              )}

              <div className="destination-details__meta">
                {destinationDetails.weather && (
                  <div className="weather-box">
                    <h3>Current Weather</h3>
                    <p>
                      Temperature: {destinationDetails.weather.temperature}°C
                    </p>
                    <p>Humidity: {destinationDetails.weather.humidity}%</p>
                    <p>
                      Wind speed: {destinationDetails.weather.windSpeed} km/h
                    </p>
                    <p>Description: {destinationDetails.weather.description}</p>
                  </div>
                )}

                {destinationDetails.conversionRates && (
                  <div className="currency-box">
                    <h3>Currency Rates (1 PLN equals)</h3>
                    <p>EUR: {destinationDetails.conversionRates.EUR}</p>
                    <p>USD: {destinationDetails.conversionRates.USD}</p>
                    <p>GBP: {destinationDetails.conversionRates.GBP}</p>
                    <p>CZK: {destinationDetails.conversionRates.CZK}</p>
                  </div>
                )}
              </div>
<div className="trip-invite-section">
  <h3>Invite user to this trip</h3>

  <form onSubmit={handleInviteUser} className="trip-invite-form">
    <input
      type="email"
      placeholder="User email"
      value={inviteEmail}
      onChange={(e) => setInviteEmail(e.target.value)}
      className="trip-invite-form__input"
    />

    <button type="submit" className="trip-invite-form__button">
      Invite
    </button>
    <button
  type="button"
  className="trip-invite-form__button"
  onClick={handleRemoveUserFromTrip}
>
  Remove
</button>
  </form>

  {inviteMessage && <p>{inviteMessage}</p>}
</div>
              <div className="destination-tasks-section">
                <h3>Trip Checklist / Packing List</h3>

                <form onSubmit={handleAddTask} className="task-form">
                  <input
                    type="text"
                    placeholder="Add item to pack or task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="task-form__input"
                  />
                  <button type="submit" className="task-form__button">
                    Add
                  </button>
                </form>

                {tasks.length === 0 ? (
                  <p className="no-tasks">
                    No tasks for this trip yet. Add some above!
                  </p>
                ) : (
                  <ul className="task-list">
                    {tasks.map((task) => (
                      <li key={task.id} className="task-list__item">
                        <label className="task-list__label">
                          <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleToggleTask(task.id)}
                            className="task-list__checkbox"
                          />
                          <span
                            className={
                              task.isCompleted
                                ? "task-list__text--completed"
                                : "task-list__text"
                            }
                          >
                            {task.title}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      )}

      <button type="button" onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </main>
  );
}

export default DashboardPage;
