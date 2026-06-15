const bookingService = require("../services/booking.service");

const createBooking = async (req, res) => {
  try {
    const { scheduleId, passengerCount } = req.body;

    if (!scheduleId) {
      return res.status(400).json({
        message: "Termin leta je obavezan.",
      });
    }

    if (!passengerCount || Number(passengerCount) < 1) {
      return res.status(400).json({
        message: "Broj putnika mora biti najmanje 1.",
      });
    }

    const booking = await bookingService.createBooking({
      userId: req.user.id,
      scheduleId,
      passengerCount,
    });

    res.status(201).json({
      message: "Rezervacija je uspešno kreirana.",
      data: booking,
    });
  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Greška prilikom kreiranja rezervacije.",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);

    res.json({
      message: "Rezervacije su uspešno učitane.",
      data: bookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja rezervacija.",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
};
