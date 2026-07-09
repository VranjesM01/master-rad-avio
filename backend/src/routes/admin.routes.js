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

module.exports = router;
