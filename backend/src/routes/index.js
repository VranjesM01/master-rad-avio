const express = require("express");

const healthRoutes = require("./health.routes");
const airportRoutes = require("./airport.routes");
const destinationRoutes = require("./destination.routes");
const authRoutes = require("./auth.routes");
const flightRoutes = require("./flight.routes");
const bookingRoutes = require("./booking.routes");
const recommendationRoutes = require("./recommendation.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/airports", airportRoutes);
router.use("/destinations", destinationRoutes);
router.use("/auth", authRoutes);
router.use("/flights", flightRoutes);
router.use("/bookings", bookingRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
