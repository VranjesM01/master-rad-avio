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

/* =========================
   FLIGHT ADMIN LOGIC
========================= */

const getAllFlights = async () => {
  return await prisma.flight.findMany({
    include: {
      originAirport: true,
      destinationAirport: true,
      schedules: {
        orderBy: {
          departureTime: "asc",
        },
      },
    },
    orderBy: {
      code: "asc",
    },
  });
};

const createFlight = async (data) => {
  const {
    code,
    airline,
    durationMinutes,
    originAirportId,
    destinationAirportId,
  } = data;

  return await prisma.flight.create({
    data: {
      code: code.toUpperCase(),
      airline,
      durationMinutes: Number(durationMinutes),
      originAirportId: Number(originAirportId),
      destinationAirportId: Number(destinationAirportId),
    },
    include: {
      originAirport: true,
      destinationAirport: true,
      schedules: true,
    },
  });
};

const updateFlight = async (id, data) => {
  const {
    code,
    airline,
    durationMinutes,
    originAirportId,
    destinationAirportId,
  } = data;

  return await prisma.flight.update({
    where: {
      id: Number(id),
    },
    data: {
      code: code.toUpperCase(),
      airline,
      durationMinutes: Number(durationMinutes),
      originAirportId: Number(originAirportId),
      destinationAirportId: Number(destinationAirportId),
    },
    include: {
      originAirport: true,
      destinationAirport: true,
      schedules: true,
    },
  });
};

const deleteFlight = async (id) => {
  return await prisma.flight.delete({
    where: {
      id: Number(id),
    },
  });
};

/* =========================
   FLIGHT SCHEDULE ADMIN LOGIC
========================= */

const getAllSchedules = async () => {
  return await prisma.flightSchedule.findMany({
    include: {
      flight: {
        include: {
          originAirport: true,
          destinationAirport: true,
        },
      },
    },
    orderBy: {
      departureTime: "asc",
    },
  });
};

const createSchedule = async (data) => {
  const {
    flightId,
    departureTime,
    arrivalTime,
    basePrice,
    currency,
    availableSeats,
  } = data;

  return await prisma.flightSchedule.create({
    data: {
      flightId: Number(flightId),
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      basePrice: Number(basePrice),
      currency: currency || "EUR",
      availableSeats: Number(availableSeats),
    },
    include: {
      flight: {
        include: {
          originAirport: true,
          destinationAirport: true,
        },
      },
    },
  });
};

const updateSchedule = async (id, data) => {
  const {
    flightId,
    departureTime,
    arrivalTime,
    basePrice,
    currency,
    availableSeats,
  } = data;

  return await prisma.flightSchedule.update({
    where: {
      id: Number(id),
    },
    data: {
      flightId: Number(flightId),
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      basePrice: Number(basePrice),
      currency: currency || "EUR",
      availableSeats: Number(availableSeats),
    },
    include: {
      flight: {
        include: {
          originAirport: true,
          destinationAirport: true,
        },
      },
    },
  });
};

const deleteSchedule = async (id) => {
  return await prisma.flightSchedule.delete({
    where: {
      id: Number(id),
    },
  });
};

/* =========================
   BOOKING ADMIN LOGIC
========================= */

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      schedule: {
        include: {
          flight: {
            include: {
              originAirport: true,
              destinationAirport: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "desc",
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

  getAllFlights,
  createFlight,
  updateFlight,
  deleteFlight,

  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,

  getAllBookings,
};
