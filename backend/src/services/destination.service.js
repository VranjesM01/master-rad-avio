const prisma = require("../config/prisma");

const getAllDestinations = async () => {
  return await prisma.destination.findMany({
    orderBy: {
      city: "asc",
    },
  });
};

const getDestinationById = async (id) => {
  return await prisma.destination.findUnique({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  getAllDestinations,
  getDestinationById,
};
