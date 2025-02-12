import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomGrid from "../components/RoomGrid";
import BookingControls from "../components/BookingControls";
import "../Styles/Styles.css";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [travelTime, setTravelTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/bookings/rooms");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRooms(data);
        setBookedRooms([]);
        setTravelTime(null);
      } else {
        console.error("Invalid response: Expected an array", data);
        setRooms([]);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Book Rooms
  const bookRooms = async (count) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
  
      if (data.bookedRooms) {
        setBookedRooms(data.bookedRooms);
  
        // ✅ Ensure rooms are updated correctly
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            data.bookedRooms.includes(room.number) // Ensure we're using the correct property
              ? { ...room, booked: true }  // ✅ Mark as booked
              : room
          )
        );
      }
  
      setTravelTime(data.travelTime || 0);
      setShowNotification(true);
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Randomize Rooms
  const randomizeRooms = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:5000/api/bookings/randomize", {
        method: "POST",
      });
      await fetchRooms();
    } catch (err) {
      console.error("Randomization failed:", err);
    } finally {
      setLoading(false);
    }
  };
  

  // Reset Rooms
  const resetRooms = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:5000/api/bookings/reset", { method: "POST" });
      setBookedRooms([]);
      setTravelTime(null);
      setShowNotification(false);
      await fetchRooms();
    } catch (err) {
      console.error("Failed to reset rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get Floor-Wise Room Count
  const getFloorStats = () => {
    if (bookedRooms.length === 0) return {};

    return bookedRooms.reduce((acc, room) => {
      const floor = Math.floor(room / 100) || 0; // Prevent NaN
      acc[floor] = (acc[floor] || 0) + 1;
      return acc;
    }, {});
  };

  const floorStats = getFloorStats();

  return (
    <div className="container">
      <Header />

      <main className="content">
        <div className="booking-section">
          <BookingControls bookRooms={bookRooms} resetRooms={resetRooms} randomizeRooms={randomizeRooms}/>
        </div>

        {/* Notification Popup */}
        {showNotification && bookedRooms.length > 0 && (
          <div className="notification">
            <button className="close-btn" onClick={() => setShowNotification(false)}>✖</button>
            <h3>Booking Summary</h3>
            <p><strong>Total Rooms Booked:</strong> {bookedRooms.length}</p>
            {Object.entries(floorStats).map(([floor, count]) => (
              <p key={floor}><strong>Floor {floor}:</strong> {count} rooms booked</p>
            ))}
            {travelTime !== null && (
              <p><strong>Distance between first and last booked rooms:</strong> {travelTime} units</p>
            )}
          </div>
        )}

        <div className="room-container">
          <div className="stairs-lift">
            <span>Stairs / Lift</span>
          </div>
          <div className="building">
            {loading ? <p>Loading rooms...</p> : <RoomGrid rooms={rooms} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
