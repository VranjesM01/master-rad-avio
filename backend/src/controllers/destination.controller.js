const destinationService = require("../services/destination.service");

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await destinationService.getAllDestinations();

    res.json({
      message: "Destinacije su uspešno učitane.",
      data: destinations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja destinacija.",
    });
  }
};

const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await destinationService.getDestinationById(id);

    if (!destination) {
      return res.status(404).json({
        message: "Destinacija nije pronađena.",
      });
    }

    res.json({
      message: "Destinacija je uspešno učitana.",
      data: destination,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja destinacije.",
    });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
};
