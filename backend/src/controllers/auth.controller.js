const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Ime, prezime, email i lozinka su obavezni.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Lozinka mora imati najmanje 6 karaktera.",
      });
    }

    const user = await authService.registerUser({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      message: "Korisnik je uspešno registrovan.",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Greška prilikom registracije.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email i lozinka su obavezni.",
      });
    }

    const result = await authService.loginUser({
      email,
      password,
    });

    res.json({
      message: "Korisnik je uspešno prijavljen.",
      data: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Greška prilikom prijave.",
    });
  }
};

const profile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Korisnik nije pronađen.",
      });
    }

    res.json({
      message: "Profil korisnika je uspešno učitan.",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja profila.",
    });
  }
};

module.exports = {
  register,
  login,
  profile,
};
