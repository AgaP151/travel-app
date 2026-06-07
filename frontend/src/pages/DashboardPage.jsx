import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addTrip,
  deleteTrip,
  getTrips,
  inviteUserToTrip,
  removeUserFromTrip,
  copyTripToMyTrips,
  getTripParticipants,
} from "../services/tripService";
import { getDestinationDetails } from "../services/destinationService";
import { getTasks, addTask, toggleTask } from "../services/taskService";
import { getAdminUsers } from "../services/adminService";

function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [destinationDetails, setDestinationDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [trips, setTrips] = useState([]);

  const [newTrip, setNewTrip] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    price: "",
  });

  const [selectedTripId, setSelectedTripId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const [participants, setParticipants] = useState([]);
  const [participantsError, setParticipantsError] = useState("");

  const [adminUsers, setAdminUsers] = useState([]);
  const [adminError, setAdminError] = useState("");

  const myTrips = trips.filter((trip) => trip.publicDemo !== true);
  const demoTrips = trips.filter((trip) => trip.publicDemo === true);
  const selectedTrip = trips.find((trip) => trip.id === selectedTripId);
  const selectedTripIsPublicDemo = selectedTrip?.publicDemo === true;
  const loggedUser = getLoggedUser();

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

  useEffect(() => {
    async function loadAdminUsers() {
      if (loggedUser?.role !== "ROLE_ADMIN") {
        return;
      }

      try {
        const users = await getAdminUsers();
        setAdminUsers(users);
      } catch (error) {
        console.error(error);
        setAdminError(t("dashboard.couldNotLoadUsers"));
      }
    }

    loadAdminUsers();
  }, [loggedUser?.role]);

  function getLoggedUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      let role = "";

      if (typeof payload.role === "string") {
        role = payload.role;
      } else if (Array.isArray(payload.authorities)) {
        role = payload.authorities
          .map((authority) =>
            typeof authority === "string" ? authority : authority.authority
          )
          .filter(Boolean)
          .join(", ");
      }

      return {
        email: payload.sub || payload.email || "",
        role,
      };
    } catch {
      return null;
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function formatTripDates(trip) {
    if (trip.startDate && trip.endDate) {
      return `${trip.startDate} - ${trip.endDate}`;
    }

    if (trip.startDate) {
      return trip.startDate;
    }

    return t("dashboard.noDate");
  }

  function isLongTermForecastUnavailable() {
    if (!selectedTrip?.startDate) {
      return false;
    }

    const today = new Date();
    const startDate = new Date(selectedTrip.startDate);
    const diffInMs = startDate - today;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays > 5;
  }

  async function loadTripParticipants(tripId) {
    try {
      const participantsData = await getTripParticipants(tripId);
      setParticipants(participantsData);
      setParticipantsError("");
    } catch (error) {
      console.error(error);
      setParticipants([]);
      setParticipantsError(
        t(
          "dashboard.couldNotLoadParticipants",
          "Nie udało się pobrać uczestników."
        )
      );
    }
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

    if (
      newTrip.startDate &&
      newTrip.endDate &&
      newTrip.endDate < newTrip.startDate
    ) {
      alert(t("dashboard.invalidDateRange"));
      return;
    }

    try {
      const createdTrip = await addTrip({
        ...newTrip,
        price: Number(newTrip.price),
      });

      setTrips((prevTrips) => [...prevTrips, createdTrip]);

      setNewTrip({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        description: "",
        price: "",
      });

      await handleSelectTrip(createdTrip.id, createdTrip.destination);
    } catch (error) {
      console.error(error);
      alert(t("dashboard.couldNotAddTrip"));
    }
  }

  async function handleCopyTripToMyTrips(tripId) {
    try {
      const copiedTrip = await copyTripToMyTrips(tripId);
      setTrips((prevTrips) => [...prevTrips, copiedTrip]);
      alert(t("dashboard.tripCopied"));
    } catch (error) {
      console.error(error);
      alert(t("dashboard.couldNotCopyTrip"));
    }
  }

  async function handleDeleteTrip(id) {
    try {
      await deleteTrip(id);

      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));

      if (selectedTripId === id) {
        setDestinationDetails(null);
        setSelectedTripId(null);
        setTasks([]);
        setParticipants([]);
        setParticipantsError("");
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
    setInviteMessage("");
    setParticipants([]);
    setParticipantsError("");

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

    await loadTripParticipants(tripId);
  }

  async function handleAddTask(e) {
    e.preventDefault();

    if (!newTaskTitle.trim() || !selectedTripId || selectedTripIsPublicDemo) {
      return;
    }

    try {
      const createdTask = await addTask(selectedTripId, newTaskTitle.trim());
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error(error);
      alert(t("dashboard.couldNotAddTask"));
    }
  }

  async function handleToggleTask(taskId) {
    if (selectedTripIsPublicDemo) {
      return;
    }

    try {
      const updatedTask = await toggleTask(selectedTripId, taskId);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error(error);
      alert(t("dashboard.couldNotUpdateTask"));
    }
  }

  async function handleInviteUser(e) {
  e.preventDefault();

  if (!selectedTripId || !inviteEmail.trim() || selectedTripIsPublicDemo) {
    return;
  }

  const normalizedEmail = inviteEmail.trim().toLowerCase();

  const userAlreadyAssigned = participants.some(
    (participant) => participant.email.toLowerCase() === normalizedEmail
  );

  if (userAlreadyAssigned) {
    setInviteMessage(
      t(
        "dashboard.userAlreadyAssigned",
        "Ten użytkownik jest już uczestnikiem tej podróży."
      )
    );
    return;
  }

  try {
    await inviteUserToTrip(selectedTripId, inviteEmail.trim());
    setInviteMessage(t("dashboard.userInvited"));
    setInviteEmail("");
    await loadTripParticipants(selectedTripId);
  } catch (error) {
    if (error.message === "USER_ALREADY_ASSIGNED") {
      setInviteMessage(
        t(
          "dashboard.userAlreadyAssigned",
          "Ten użytkownik jest już uczestnikiem tej podróży."
        )
      );
    } else {
      console.error(error);
      setInviteMessage(t("dashboard.couldNotInvite"));
    }
  }
}

  async function handleRemoveUserFromTrip() {
    if (!selectedTripId || !inviteEmail.trim() || selectedTripIsPublicDemo) {
      return;
    }

    try {
      await removeUserFromTrip(selectedTripId, inviteEmail.trim());
      setInviteMessage(t("dashboard.userRemoved"));
      setInviteEmail("");
      await loadTripParticipants(selectedTripId);
    } catch (error) {
      console.error(error);
      setInviteMessage(t("dashboard.couldNotRemove"));
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero__subtitle">
            {t("dashboard.heroSubtitle")}
          </p>

          <h1>
            {t("dashboard.heroTitleStart")}{" "}
            <span>{t("dashboard.heroTitleHighlight")}</span>
          </h1>

          <p>{t("dashboard.heroDescription")}</p>
        </div>

        {loggedUser && (
          <div className="dashboard-user">
            <span>{t("dashboard.loggedAs")}</span>
            <strong>{loggedUser.email}</strong>
            {loggedUser.role === "ROLE_ADMIN" && <small>ADMIN</small>}
          </div>
        )}
      </section>

      {loggedUser?.role === "ROLE_ADMIN" && (
        <section className="dashboard-card admin-panel">
          <h2>{t("dashboard.adminPanel")}</h2>

          {adminError && <p>{adminError}</p>}

          {adminUsers.length === 0 ? (
            <p>{t("dashboard.noUsers")}</p>
          ) : (
            <ul className="admin-users-list">
              {adminUsers.map((user) => (
                <li key={user.id} className="admin-users-list__item">
                  <strong>{user.email}</strong>
                  <span>{user.name || "-"}</span>
                  <small>{user.role}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="dashboard-card">
        <h2>{t("dashboard.travelInspirations")}</h2>

        {demoTrips.length === 0 ? (
          <p>{t("dashboard.noInspirations")}</p>
        ) : (
          <ul className="inspirations-slider">
            {demoTrips.map((trip) => (
              <li key={trip.id} className="inspiration-card">
                <button
                  className="inspiration-card__button"
                  type="button"
                  onClick={() => handleSelectTrip(trip.id, trip.destination)}
                >
                  <strong>{trip.title}</strong>
                  <span>{trip.destination}</span>
                </button>

                <span className="trip-list__badge">
                  {t("dashboard.inspiration")}
                </span>

                <button
                  className="inspiration-card__copy"
                  type="button"
                  onClick={() => handleCopyTripToMyTrips(trip.id)}
                >
                  {t("dashboard.addToMyTrips")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-card">
        <h2>{t("dashboard.addTrip")}</h2>

        <form onSubmit={handleAddTrip} className="trip-form">
          <input
            type="text"
            placeholder={t("dashboard.tripTitle")}
            value={newTrip.title}
            onChange={(e) =>
              setNewTrip({ ...newTrip, title: e.target.value })
            }
          />

          <input
            type="text"
            placeholder={t("dashboard.destination")}
            value={newTrip.destination}
            onChange={(e) =>
              setNewTrip({ ...newTrip, destination: e.target.value })
            }
          />

          <input
            type="date"
            value={newTrip.startDate}
            onChange={(e) =>
              setNewTrip({ ...newTrip, startDate: e.target.value })
            }
          />

          <input
            type="date"
            value={newTrip.endDate}
            min={newTrip.startDate || undefined}
            onChange={(e) =>
              setNewTrip({ ...newTrip, endDate: e.target.value })
            }
          />

          <input
            type="number"
            placeholder={t("dashboard.price")}
            value={newTrip.price}
            onChange={(e) =>
              setNewTrip({ ...newTrip, price: e.target.value })
            }
          />

          <textarea
            placeholder={t("dashboard.description")}
            value={newTrip.description}
            onChange={(e) =>
              setNewTrip({ ...newTrip, description: e.target.value })
            }
          />

          <button type="submit">{t("dashboard.addTrip")}</button>
        </form>
      </section>

      <section className="dashboard-card">
        <h2>{t("dashboard.yourTrips")}</h2>

        {myTrips.length === 0 ? (
          <p>{t("dashboard.noTrips")}</p>
        ) : (
          <ul className="trip-list">
            {myTrips.map((trip) => (
              <li key={trip.id} className="trip-list__item">
                <button
                  className="trip-list__details"
                  type="button"
                  onClick={() => handleSelectTrip(trip.id, trip.destination)}
                >
                  <strong>{trip.title}</strong>
                  <span>{trip.destination}</span>
                  <small>
                    {formatTripDates(trip)}
                    {trip.price ? ` · ${trip.price} PLN` : ""}
                  </small>
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

              {selectedTrip && (
                <div className="selected-trip-meta">
                  <p>
                    <strong>{t("dashboard.date")}:</strong>{" "}
                    {formatTripDates(selectedTrip)}
                  </p>
                  <p>
                    <strong>{t("dashboard.price")}:</strong>{" "}
                    {selectedTrip.price ? `${selectedTrip.price} PLN` : "-"}
                  </p>
                </div>
              )}

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

                    {isLongTermForecastUnavailable() && (
                      <p className="forecast-note">
                        {t("dashboard.longTermForecastUnavailable")}
                      </p>
                    )}

                    <div className="info-box__grid">
                      <p>
                        <span>🌡️</span>
                        {t("dashboard.temperature")}:{" "}
                        {destinationDetails.weather.temperature}°C
                      </p>
                      <p>
                        <span>💧</span>
                        {t("dashboard.humidity")}:{" "}
                        {destinationDetails.weather.humidity}%
                      </p>
                      <p>
                        <span>💨</span>
                        {t("dashboard.windSpeed")}:{" "}
                        {destinationDetails.weather.windSpeed} km/h
                      </p>
                      <p>
                        <span>☁️</span>
                        {t("dashboard.weatherDescription")}:{" "}
                        {destinationDetails.weather.description}
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
                      <p>
                        <strong>EUR</strong>{" "}
                        {destinationDetails.conversionRates.EUR} PLN
                      </p>
                      <p>
                        <strong>USD</strong>{" "}
                        {destinationDetails.conversionRates.USD} PLN
                      </p>
                      <p>
                        <strong>GBP</strong>{" "}
                        {destinationDetails.conversionRates.GBP} PLN
                      </p>
                      <p>
                        <strong>CZK</strong>{" "}
                        {destinationDetails.conversionRates.CZK} PLN
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="trip-participants-section">
                <h3>
                  {t("dashboard.tripParticipants", "Uczestnicy podróży")}
                </h3>

                {participantsError && <p>{participantsError}</p>}

                {participants.length === 0 ? (
                  <p>
                    {selectedTripIsPublicDemo
                      ? t(
                          "dashboard.noParticipantsForPublicDemo",
                          "Publiczna inspiracja nie ma przypisanych uczestników."
                        )
                      : t(
                          "dashboard.noParticipants",
                          "Brak uczestników przypisanych do tej podróży."
                        )}
                  </p>
                ) : (
                  <ul className="trip-participants-list">
                    {participants.map((participant) => (
                      <li
                        key={participant.id}
                        className="trip-participants-list__item"
                      >
                        <strong>{participant.email}</strong>
                        <span>{participant.name || "-"}</span>
                        {participant.role === "ROLE_ADMIN" && (
                          <small>ADMIN</small>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="trip-invite-section">
                <h3>{t("dashboard.inviteUser")}</h3>

                {selectedTripIsPublicDemo && (
                  <p>{t("dashboard.copyTripBeforeInvite")}</p>
                )}

                <form onSubmit={handleInviteUser} className="trip-invite-form">
                  <input
                    type="email"
                    placeholder={t("dashboard.userEmail")}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="trip-invite-form__input"
                    disabled={selectedTripIsPublicDemo}
                  />

                  <button
                    type="submit"
                    className="trip-invite-form__button"
                    disabled={selectedTripIsPublicDemo}
                  >
                    {t("dashboard.invite")}
                  </button>

                  <button
                    type="button"
                    className="trip-invite-form__button"
                    onClick={handleRemoveUserFromTrip}
                    disabled={selectedTripIsPublicDemo}
                  >
                    {t("dashboard.remove")}
                  </button>
                </form>

                {inviteMessage && <p>{inviteMessage}</p>}
              </div>

              <div className="destination-tasks-section">
                <h3>{t("dashboard.tripChecklist")}</h3>

                {selectedTripIsPublicDemo && (
                  <p>{t("dashboard.copyTripBeforeTasks")}</p>
                )}

                <form onSubmit={handleAddTask} className="task-form">
                  <input
                    type="text"
                    placeholder={t("dashboard.addTaskPlaceholder")}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    disabled={selectedTripIsPublicDemo}
                    className="task-form__input"
                  />

                  <button
                    type="submit"
                    className="task-form__button"
                    disabled={selectedTripIsPublicDemo}
                  >
                    {t("dashboard.add")}
                  </button>
                </form>

                {tasks.length === 0 ? (
                  <p className="no-tasks">{t("dashboard.noTasks")}</p>
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