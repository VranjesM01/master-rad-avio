const prisma = require("../config/prisma");

const getAllAirports = async () => {
  return await prisma.airport.findMany({
    orderBy: {
      city: "asc",
    },
  });
};

const getAirportById = async (id) => {
  return await prisma.airport.findUnique({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getAllAirports,
  getAirportById,
};
