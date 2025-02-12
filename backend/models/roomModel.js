let rooms = [];

const initializeRooms = () => {
    rooms.length = 0;
    for (let floor = 1; floor <= 10; floor++) {
      const numRooms = floor === 10 ? 7 : 10;
      for (let room = 1; room <= numRooms; room++) {
        rooms.push({
          number: floor * 100 + room,
          floor: floor,
          booked: false,
        });
      }
    }
  };
  

initializeRooms();

module.exports = { rooms, initializeRooms };
