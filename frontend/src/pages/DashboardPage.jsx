import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { addTrip, deleteTrip, getTrips, inviteUserToTrip, removeUserFromTrip } from "../services/tripService";
import { getDestinationDetails } from "../services/destinationService";
import { getTasks, addTask, toggleTask } from "../services/taskService";

function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [destinationDetails, setDestinationDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [trips, setTrips] = useState([]);
  const myTrips = trips.filter((trip) => !trip.publicDemo);
  const demoTrips = trips.filter((trip) => trip.publicDemo);
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
 const selectedTrip = trips.find((trip) => trip.id === selectedTripId);
  const selectedTripIsPublicDemo = selectedTrip?.publicDemo === true;
  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error(error);
        alert(t("dashboard.couldNotLoadTrips"));
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
      alert(t("dashboard.requiredTripFields"));
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
      alert(t("dashboard.couldNotAddTrip"));
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
      alert(t("dashboard.couldNotDeleteTrip"));
    }
  }
  async function handleSelectTrip(tripId, destination) {
    setDetailsLoading(true);
    setDetailsError("");
    setDestinationDetails(null);
    setSelectedTripId(tripId);
    setTasks([]);

    try {
      const detailsData = await getDestinationDetails(destination);
      setDestinationDetails(detailsData);
    } catch (error) {
      console.error(error);
      setDetailsError(t("dashboard.couldNotLoadDetails"));
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
      alert(t("dashboard.couldNotAddTask"));
    }
  }

  async function handleToggleTask(taskId) {
    try {
      const updatedTask = await toggleTask(selectedTripId, taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error(error);
      alert(t("dashboard.couldNotUpdateTask"));
    }
  }
async function handleInviteUser(e) {
  e.preventDefault();

  if (!selectedTripId || !inviteEmail.trim()) {
    return;
  }

  try {
    await inviteUserToTrip(selectedTripId, inviteEmail.trim());
    setInviteMessage(t("dashboard.userInvited"));
    setInviteEmail("");
  } catch (error) {
    console.error(error);
    setInviteMessage(t("dashboard.couldNotInvite"));
  }
}

async function handleRemoveUserFromTrip() {

  if (!selectedTripId || !inviteEmail.trim()) {
    return;
  }

  try {
    await removeUserFromTrip(selectedTripId, inviteEmail.trim());
    setInviteMessage(t("dashboard.userRemoved"));
    setInviteEmail("");
  } catch (error) {
    console.error(error);
    setInviteMessage(t("dashboard.couldNotRemove"));
  }
}
  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
  <p className="dashboard-hero__subtitle">
    {t("dashboard.heroSubtitle")}
  </p>
  <h1>
    {t("dashboard.heroTitleStart")}{" "}
    <span>{t("dashboard.heroTitleHighlight")}</span>
  </h1>
  <p>{t("dashboard.heroDescription")}</p>
</section>

    
<section className="dashboard-card">
  <h2>{t("dashboard.travelInspirations")}</h2>

  {demoTrips.length === 0 ? (
    <p>{t("dashboard.noInspirations")}</p>
  ) : (
    <ul>
      {demoTrips.map((trip) => (
        <li key={trip.id} className="trip-list__item">
          <button
            className="trip-list__details"
            type="button"
            onClick={() => handleSelectTrip(trip.id, trip.destination)}
          >
            <strong>{trip.title}</strong> — {trip.destination}
          </button>

          <span className="trip-list__badge">
            {t("dashboard.inspiration")}
          </span>
        </li>
      ))}
    </ul>
  )}
</section>

      <section className="dashboard-card">
        <h2>{t("dashboard.yourTrips")}</h2>

        {trips.length === 0 ? (
           <p>{t("dashboard.noTrips")}</p>
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
                  {t("dashboard.delete")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(detailsLoading || detailsError || destinationDetails) && (
        <section className="dashboard-card destination-details">
          {detailsLoading && <p>{t("dashboard.loadingDetails")}</p>}

          {detailsError && <p>{t("dashboard.couldNotLoadDetails")}</p>}

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
    <div className="info-box weather-box">
      <div className="info-box__header">
        <span className="info-box__icon">☀️</span>
        <h3>{t("dashboard.currentWeather")}</h3>
      </div>

      <div className="info-box__grid">
        <p>
          <span>🌡️</span>
          {t("dashboard.temperature")}: {destinationDetails.weather.temperature}°C
        </p>
        <p>
          <span>💧</span>
          {t("dashboard.humidity")}: {destinationDetails.weather.humidity}%
        </p>
        <p>
          <span>💨</span>
          {t("dashboard.windSpeed")}: {destinationDetails.weather.windSpeed} km/h
        </p>
        <p>
          <span>☁️</span>
          {t("dashboard.weatherDescription")}: {destinationDetails.weather.description}
        </p>
      </div>
      {destinationDetails.forecast?.length > 0 && (
  <div className="forecast-list">
    {destinationDetails.forecast.map((day) => (
      <div className="forecast-card" key={day.date}>
        <img
          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
          alt={day.description}
          className="forecast-card__icon"
        />
        <div>
          <strong>{day.date}</strong>
          <p>{day.temperature}°C</p>
          <span>{day.description}</span>
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  )}

  {destinationDetails.conversionRates && (
    <div className="info-box currency-box">
      <div className="info-box__header">
        <span className="info-box__icon">💱</span>
        <h3>{t("dashboard.currencyRates")}</h3>
      </div>

      <div className="currency-grid">
        <p><strong>EUR</strong> {destinationDetails.conversionRates.EUR} PLN</p>
        <p><strong>USD</strong> {destinationDetails.conversionRates.USD} PLN</p>
        <p><strong>GBP</strong> {destinationDetails.conversionRates.GBP} PLN</p>
        <p><strong>CZK</strong> {destinationDetails.conversionRates.CZK} PLN</p>
      </div>
    </div>
  )}
</div>
<div className="trip-invite-section">
  <h3>{t("dashboard.inviteUser")}</h3>

  <form onSubmit={handleInviteUser} className="trip-invite-form">
    <input
      type="email"
      placeholder={t("dashboard.userEmail")}
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
                    disabled={selectedTripIsPublicDemo}
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
                            disabled={selectedTripIsPublicDemo}
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
         {t("dashboard.logout")}
      </button>
    </main>
  );
}

export default DashboardPage;
