import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addTrip, deleteTrip, getTrips } from "../services/tripService";
import { getDestinationDetails } from "../services/destinationService";

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
    } catch (error) {
      console.error(error);
      alert("Could not delete trip.");
    }
  }
  async function handleShowDestinationDetails(destination) {
    try {
      setDetailsLoading(true);
      setDetailsError("");
      setDestinationDetails(null);

      const data = await getDestinationDetails(destination);
      setDestinationDetails(data);
    } catch (error) {
      console.error(error);
      setDetailsError("Could not load destination details.");
    } finally {
      setDetailsLoading(false);
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

      <section className="dashboard-card destination-details">
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

          <button className="trip-form__button" type="submit">
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
                  onClick={() => handleShowDestinationDetails(trip.destination)}
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
      {detailsLoading && <p>Loading destination details...</p>}

      {detailsError && <p>{detailsError}</p>}

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
                <p>{destinationDetails.weather}</p>
                <p>{destinationDetails.currency}</p>
              </div>
            </>
          )}
        </section>
      )}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}

export default DashboardPage;
