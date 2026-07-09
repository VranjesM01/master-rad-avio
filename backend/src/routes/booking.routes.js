const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/booking.controller");

const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createBooking);
router.get("/my", authenticate, getMyBookings);
router.patch("/:id/cancel", authenticate, cancelBooking);

module.exports = router;
