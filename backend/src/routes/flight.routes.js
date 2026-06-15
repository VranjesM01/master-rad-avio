const express = require("express");

const {
  getAllFlights,
  getFlightById,
  searchFlightSchedules,
} = require("../controllers/flight.controller");

const router = express.Router();

router.get("/", getAllFlights);
router.get("/schedules/search", searchFlightSchedules);
router.get("/:id", getFlightById);

module.exports = router;
