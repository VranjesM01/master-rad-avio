const adminService = require("../services/admin.service");

/* =========================
   AIRPORT CONTROLLERS
========================= */

const getAllAirports = async (req, res) => {
  try {
    const airports = await adminService.getAllAirports();

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

const createAirport = async (req, res) => {
  try {
    const { name, city, country, code } = req.body;

    if (!name || !city || !country || !code) {
      return res.status(400).json({
        message: "Sva polja su obavezna.",
      });
    }

    const airport = await adminService.createAirport(req.body);

    res.status(201).json({
      message: "Aerodrom je uspešno dodat.",
      data: airport,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Aerodrom sa ovom oznakom već postoji.",
      });
    }

    res.status(500).json({
      message: "Greška prilikom dodavanja aerodroma.",
    });
  }
};

const updateAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, country, code } = req.body;

    if (!name || !city || !country || !code) {
      return res.status(400).json({
        message: "Sva polja su obavezna.",
      });
    }

    const airport = await adminService.updateAirport(id, req.body);

    res.json({
      message: "Aerodrom je uspešno izmenjen.",
      data: airport,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Aerodrom nije pronađen.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Aerodrom sa ovom oznakom već postoji.",
      });
    }

    res.status(500).json({
      message: "Greška prilikom izmene aerodroma.",
    });
  }
};

const deleteAirport = async (req, res) => {
  try {
    const { id } = req.params;

    await adminService.deleteAirport(id);

    res.json({
      message: "Aerodrom je uspešno obrisan.",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Aerodrom nije pronađen.",
      });
    }

    res.status(500).json({
      message:
        "Aerodrom ne može biti obrisan ako je povezan sa postojećim letovima.",
    });
  }
};

/* =========================
   DESTINATION CONTROLLERS
========================= */

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await adminService.getAllDestinations();

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

const createDestination = async (req, res) => {
  try {
    const { city, country, description, climate, budgetLevel, travelType } =
      req.body;

    if (
      !city ||
      !country ||
      !description ||
      !climate ||
      !budgetLevel ||
      !travelType
    ) {
      return res.status(400).json({
        message: "Sva obavezna polja moraju biti popunjena.",
      });
    }

    const destination = await adminService.createDestination(req.body);

    res.status(201).json({
      message: "Destinacija je uspešno dodata.",
      data: destination,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Destinacija sa ovim gradom i državom već postoji.",
      });
    }

    res.status(500).json({
      message: "Greška prilikom dodavanja destinacije.",
    });
  }
};

const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, country, description, climate, budgetLevel, travelType } =
      req.body;

    if (
      !city ||
      !country ||
      !description ||
      !climate ||
      !budgetLevel ||
      !travelType
    ) {
      return res.status(400).json({
        message: "Sva obavezna polja moraju biti popunjena.",
      });
    }

    const destination = await adminService.updateDestination(id, req.body);

    res.json({
      message: "Destinacija je uspešno izmenjena.",
      data: destination,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Destinacija nije pronađena.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Destinacija sa ovim gradom i državom već postoji.",
      });
    }

    res.status(500).json({
      message: "Greška prilikom izmene destinacije.",
    });
  }
};

const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    await adminService.deleteDestination(id);

    res.json({
      message: "Destinacija je uspešno obrisana.",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Destinacija nije pronađena.",
      });
    }

    res.status(500).json({
      message:
        "Destinacija ne može biti obrisana ako je povezana sa AI preporukama.",
    });
  }
};

module.exports = {
  getAllAirports,
  createAirport,
  updateAirport,
  deleteAirport,
  getAllDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
};
