const flightService = require("../services/flight.service");

const getAllFlights = async (req, res) => {
  try {
    const flights = await flightService.getAllFlights();

    res.json({
      message: "Letovi su uspešno učitani.",
      data: flights,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja letova.",
    });
  }
};

const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await flightService.getFlightById(id);

    if (!flight) {
      return res.status(404).json({
        message: "Let nije pronađen.",
      });
    }

    res.json({
      message: "Let je uspešno učitan.",
      data: flight,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja leta.",
    });
  }
};

const searchFlightSchedules = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const schedules = await flightService.searchFlightSchedules({
      from,
      to,
      date,
    });

    res.json({
      message: "Termini letova su uspešno učitani.",
      data: schedules,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom pretrage letova.",
    });
  }
};

module.exports = {
  getAllFlights,
  getFlightById,
  searchFlightSchedules,
};
