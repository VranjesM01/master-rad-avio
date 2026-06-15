const prisma = require("../config/prisma");

const createBooking = async ({ userId, scheduleId, passengerCount }) => {
  const passengers = Number(passengerCount);

  return await prisma.$transaction(async (tx) => {
    const schedule = await tx.flightSchedule.findUnique({
      where: {
        id: Number(scheduleId),
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

    if (!schedule) {
      const error = new Error("Termin leta nije pronađen.");
      error.statusCode = 404;
      throw error;
    }

    if (schedule.availableSeats < passengers) {
      const error = new Error("Nema dovoljno dostupnih mesta za ovaj let.");
      error.statusCode = 400;
      throw error;
    }

    const totalPrice = Number(schedule.basePrice) * passengers;

    const booking = await tx.booking.create({
      data: {
        userId: Number(userId),
        scheduleId: Number(scheduleId),
        passengerCount: passengers,
        totalPrice,
        currency: schedule.currency,
        status: "CONFIRMED",
      },
      include: {
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
    });

    await tx.flightSchedule.update({
      where: {
        id: Number(scheduleId),
      },
      data: {
        availableSeats: {
          decrement: passengers,
        },
      },
    });

    return booking;
  });
};

const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
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
      createdAt: "desc",
    },
  });
};

module.exports = {
  createBooking,
  getUserBookings,
};
