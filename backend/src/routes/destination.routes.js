const express = require("express");

const {
  getAllDestinations,
  getDestinationById,
} = require("../controllers/destination.controller");

const router = express.Router();

router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);

module.exports = router;
