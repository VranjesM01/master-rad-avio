const prisma = require("../config/prisma");

/* =========================
   AIRPORT ADMIN LOGIC
========================= */

const getAllAirports = async () => {
  return await prisma.airport.findMany({
    orderBy: {
      city: "asc",
    },
  });
};

const createAirport = async (data) => {
  const { name, city, country, code } = data;

  return await prisma.airport.create({
    data: {
      name,
      city,
      country,
      code: code.toUpperCase(),
    },
  });
};

const updateAirport = async (id, data) => {
  const { name, city, country, code } = data;

  return await prisma.airport.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      city,
      country,
      code: code.toUpperCase(),
    },
  });
};

const deleteAirport = async (id) => {
  return await prisma.airport.delete({
    where: {
      id: Number(id),
    },
  });
};

/* =========================
   DESTINATION ADMIN LOGIC
========================= */

const getAllDestinations = async () => {
  return await prisma.destination.findMany({
    orderBy: {
      city: "asc",
    },
  });
};

const createDestination = async (data) => {
  const {
    city,
    country,
    description,
    climate,
    budgetLevel,
    travelType,
    imageUrl,
  } = data;

  return await prisma.destination.create({
    data: {
      city,
      country,
      description,
      climate,
      budgetLevel,
      travelType,
      imageUrl: imageUrl || null,
    },
  });
};

const updateDestination = async (id, data) => {
  const {
    city,
    country,
    description,
    climate,
    budgetLevel,
    travelType,
    imageUrl,
  } = data;

  return await prisma.destination.update({
    where: {
      id: Number(id),
    },
    data: {
      city,
      country,
      description,
      climate,
      budgetLevel,
      travelType,
      imageUrl: imageUrl || null,
    },
  });
};

const deleteDestination = async (id) => {
  return await prisma.destination.delete({
    where: {
      id: Number(id),
    },
  });
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
