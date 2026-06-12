const express = require("express");

const {
  getAllAirports,
  getAirportById,
} = require("../controllers/airport.controller");

const router = express.Router();

router.get("/", getAllAirports);
router.get("/:id", getAirportById);

module.exports = router;
