const prisma = require("../config/prisma");

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

const getFlightById = async (id) => {
  return await prisma.flight.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      originAirport: true,
      destinationAirport: true,
      schedules: {
        orderBy: {
          departureTime: "asc",
        },
      },
    },
  });
};

const searchFlightSchedules = async ({ from, to, date }) => {
  const where = {};

  if (from || to) {
    where.flight = {};

    if (from) {
      where.flight.originAirport = {
        code: from.toUpperCase(),
      };
    }

    if (to) {
      where.flight.destinationAirport = {
        code: to.toUpperCase(),
      };
    }
  }

  if (date) {
    const startDate = new Date(`${date}T00:00:00`);
    const endDate = new Date(`${date}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);

    where.departureTime = {
      gte: startDate,
      lt: endDate,
    };
  }

  return await prisma.flightSchedule.findMany({
    where,
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

module.exports = {
  getAllFlights,
  getFlightById,
  searchFlightSchedules,
};
