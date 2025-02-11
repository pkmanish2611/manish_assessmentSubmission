const express = require("express");
const {
  getRooms,
  bookRooms,
  randomizeRooms,
  resetRooms,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/rooms", getRooms);

router.post("/book", bookRooms);

router.post("/randomize", randomizeRooms);

router.post("/reset", resetRooms);

module.exports = router;
