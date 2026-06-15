const express = require("express");

const {
  createBooking,
  getMyBookings,
} = require("../controllers/booking.controller");

const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createBooking);
router.get("/my", authenticate, getMyBookings);

module.exports = router;
