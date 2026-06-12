const express = require("express");

const healthRoutes = require("./health.routes");
const airportRoutes = require("./airport.routes");
const destinationRoutes = require("./destination.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/airports", airportRoutes);
router.use("/destinations", destinationRoutes);

module.exports = router;
