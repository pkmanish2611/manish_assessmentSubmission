import React, { useState } from "react";

const BookingControls = ({ bookRooms, randomizeRooms, resetRooms }) => {
  const [roomCount, setRoomCount] = useState(1);

  return (
    <div className="booking-controls">
      <label htmlFor="roomCount" className="room-label">Number of Rooms:</label>
      <input
        id="roomCount"
        type="number"
        value={roomCount}
        onChange={(e) => setRoomCount(e.target.value)}
        min="1"
        max="5"
        className="room-input"
      />
      <div className="button-group">
        <button className="btn book-btn" onClick={() => bookRooms(roomCount)}>Book</button>
        <button className="btn reset-btn" onClick={resetRooms}>Reset</button>
        <button className="btn random-btn" onClick={randomizeRooms}>Random</button>
      </div>
    </div>
  );
};

export default BookingControls;