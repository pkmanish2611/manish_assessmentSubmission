import React from "react";
import "../Styles/Styles.css";

const RoomGrid = ({ rooms }) => {
  const groupedByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <div className="room-container">
      <div className="building">
        {Object.keys(groupedByFloor)
          .sort((a, b) => b - a)
          .map((floor) => (
            <div key={floor} className="floor">
              <div className="room-row">
                {groupedByFloor[floor]
                  .sort((a, b) => a.number - b.number)
                  .map((room) => (
                    <div
                      key={room.number}
                      className={`room ${room.booked ? "booked" : ""}`}
                      title={`Room ${room.number}`}
                    >
                      {room.number}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomGrid;
