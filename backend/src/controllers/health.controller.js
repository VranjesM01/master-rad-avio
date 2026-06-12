const prisma = require("../config/prisma");

const getHealthStatus = (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API radi ispravno.",
    project: "Flight AI Recommender",
  });
};

const getDatabaseStatus = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      message: "Konekcija sa PostgreSQL bazom radi ispravno.",
      database: "PostgreSQL",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "ERROR",
      message: "Backend ne može da se poveže sa bazom.",
    });
  }
};

module.exports = {
  getHealthStatus,
  getDatabaseStatus,
};
