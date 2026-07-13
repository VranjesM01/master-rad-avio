const express = require("express");

const {
  getAllAirports,
  createAirport,
  updateAirport,
  deleteAirport,

  getAllDestinations,
  createDestination,
  updateDestination,
  deleteDestination,

  getAllFlights,
  createFlight,
  updateFlight,
  deleteFlight,

  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,

  getAllBookings,
} = require("../controllers/admin.controller");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles("ADMIN"));

/* Airport admin routes */
router.get("/airports", getAllAirports);
router.post("/airports", createAirport);
router.put("/airports/:id", updateAirport);
router.delete("/airports/:id", deleteAirport);

/* Destination admin routes */
router.get("/destinations", getAllDestinations);
router.post("/destinations", createDestination);
router.put("/destinations/:id", updateDestination);
router.delete("/destinations/:id", deleteDestination);

/* Flight admin routes */
router.get("/flights", getAllFlights);
router.post("/flights", createFlight);
router.put("/flights/:id", updateFlight);
router.delete("/flights/:id", deleteFlight);

/* Flight schedule admin routes */
router.get("/schedules", getAllSchedules);
router.post("/schedules", createSchedule);
router.put("/schedules/:id", updateSchedule);
router.delete("/schedules/:id", deleteSchedule);

/* Booking admin routes */
router.get("/bookings", getAllBookings);

module.exports = router;
