const bookingService = require("../services/booking.service");

const createBooking = async (req, res) => {
  try {
    const { scheduleId, passengerCount } = req.body;

    const booking = await bookingService.createBooking({
      userId: req.user.id,
      scheduleId,
      passengerCount,
    });

    res.status(201).json({
      message: "Rezervacija je uspešno kreirana i čeka potvrdu plaćanja.",
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
    const bookings = await bookingService.getMyBookings(req.user.id);

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

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookingService.cancelBooking({
      bookingId: id,
      userId: req.user.id,
    });

    res.json({
      message: "Rezervacija je uspešno otkazana.",
      data: booking,
    });
  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Greška prilikom otkazivanja rezervacije.",
    });
  }
};

const confirmBookingPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookingService.confirmBookingPayment({
      bookingId: id,
      userId: req.user.id,
    });

    res.json({
      message: "Plaćanje je uspešno potvrđeno.",
      data: booking,
    });
  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Greška prilikom potvrde plaćanja.",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  confirmBookingPayment,
};
