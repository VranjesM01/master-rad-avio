const airportService = require("../services/airport.service");

const getAllAirports = async (req, res) => {
  try {
    const airports = await airportService.getAllAirports();

    res.json({
      message: "Aerodromi su uspešno učitani.",
      data: airports,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja aerodroma.",
    });
  }
};

const getAirportById = async (req, res) => {
  try {
    const { id } = req.params;

    const airport = await airportService.getAirportById(id);

    if (!airport) {
      return res.status(404).json({
        message: "Aerodrom nije pronađen.",
      });
    }

    res.json({
      message: "Aerodrom je uspešno učitan.",
      data: airport,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja aerodroma.",
    });
  }
};

module.exports = {
  getAllAirports,
  getAirportById,
};
