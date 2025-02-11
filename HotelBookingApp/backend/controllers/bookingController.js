const { rooms, initializeRooms } = require("../models/roomModel");

/**
 * Get all rooms with their status
 */
const getRooms = (req, res) => {
  try {
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

/**
 * Calculate total travel time for a booking
 */
const calculateTravelTime = (bookedRooms) => {
  if (bookedRooms.length <= 1) return 0;

  bookedRooms.sort((a, b) => (a.floor - b.floor) || (a.number - b.number));

  let totalTravelTime = 0;

  let currentFloor = bookedRooms[0].floor;
  let firstRoomOnFloor = bookedRooms[0].number;
  let lastRoomOnFloor = bookedRooms[0].number;

  for (let i = 1; i < bookedRooms.length; i++) {
    const currentRoom = bookedRooms[i];

    if (currentRoom.floor === currentFloor) {
      lastRoomOnFloor = currentRoom.number;
    } else {
      // totalTravelTime += Math.abs(lastRoomOnFloor - firstRoomOnFloor);

      const liftRoom = (100 * currentFloor) + 1;
      totalTravelTime += Math.abs(firstRoomOnFloor - liftRoom);

      totalTravelTime += Math.abs(currentRoom.floor - currentFloor) * 2;

      const newFloorLiftRoom = (100 * currentRoom.floor) + 1;
      totalTravelTime += Math.abs(currentRoom.number - newFloorLiftRoom);

      currentFloor = currentRoom.floor;
      firstRoomOnFloor = currentRoom.number;
      lastRoomOnFloor = currentRoom.number;
    }
  }

  totalTravelTime += Math.abs(lastRoomOnFloor - firstRoomOnFloor);

  return totalTravelTime;
};






const findBestRooms = (numRooms) => {
  const availableRooms = rooms.filter((room) => !room.booked);
  const floorGroups = {};

  availableRooms.forEach((room) => {
    if (!floorGroups[room.floor]) {
      floorGroups[room.floor] = [];
    }
    floorGroups[room.floor].push(room);
  });

  const sortedFloors = Object.keys(floorGroups).map(Number).sort((a, b) => a - b);

  let selectedRooms = [];
  let remainingRoomsNeeded = numRooms;

  for (let floor of sortedFloors) {
    if (remainingRoomsNeeded === 0) break;

    const availableOnFloor = floorGroups[floor];

    if (selectedRooms.length === 0 || selectedRooms[0].floor === floor) {
      const toTake = availableOnFloor.slice(0, remainingRoomsNeeded);
      selectedRooms.push(...toTake);
      remainingRoomsNeeded -= toTake.length;
    } else {
      const toTake = availableOnFloor.slice(0, remainingRoomsNeeded);
      selectedRooms.push(...toTake);
      remainingRoomsNeeded -= toTake.length;
    }
  }

  return selectedRooms;
};

/**
 * Book rooms based on the optimized booking rules
 */
const bookRooms = (req, res) => {
  try {
    const { count } = req.body;
    const numRooms = parseInt(count, 10);

    if (numRooms < 1 || numRooms > 5) {
      return res.status(400).json({ message: "You can book between 1 to 5 rooms only." });
    }

    const bestRooms = findBestRooms(numRooms);

    if (bestRooms.length < numRooms) {
      return res.status(400).json({ message: "Not enough rooms available." });
    }

    bestRooms.forEach((room) => (room.booked = true));

    res.json({
      bookedRooms: bestRooms.map((room) => room.number),
      travelTime: calculateTravelTime(bestRooms),
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking rooms", error: error.message });
  }
};

/**
 * Randomly book rooms (for testing)
 */
const randomizeRooms = (req, res) => {
  try {
    rooms.forEach((room) => {
      room.booked = Math.random() > 0.7;
    });
    res.json({ message: "Rooms randomized.", rooms });
  } catch (error) {
    res.status(500).json({ message: "Error randomizing rooms", error: error.message });
  }
};

/**
 * Reset all rooms
 */
const resetRooms = (req, res) => {
  try {
    initializeRooms();
    res.json({ message: "Rooms reset successfully", rooms });
  } catch (error) {
    res.status(500).json({ message: "Error resetting rooms", error: error.message });
  }
};

module.exports = { getRooms, bookRooms, randomizeRooms, resetRooms };
