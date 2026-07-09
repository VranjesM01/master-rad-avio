const prisma = require("../config/prisma");

const createBooking = async ({ userId, scheduleId, passengerCount }) => {
  const passengers = Number(passengerCount);

  if (!scheduleId) {
    const error = new Error("Termin leta je obavezan.");
    error.statusCode = 400;
    throw error;
  }

  if (!passengers || passengers < 1) {
    const error = new Error("Broj putnika mora biti najmanje 1.");
    error.statusCode = 400;
    throw error;
  }

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
        status: "PENDING",
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

const getMyBookings = async (userId) => {
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
      id: "desc",
    },
  });
};

const cancelBooking = async ({ bookingId, userId }) => {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: {
        id: Number(bookingId),
        userId: Number(userId),
      },
      include: {
        schedule: true,
      },
    });

    if (!booking) {
      const error = new Error("Rezervacija nije pronađena.");
      error.statusCode = 404;
      throw error;
    }

    if (booking.status === "CANCELLED") {
      const error = new Error("Rezervacija je već otkazana.");
      error.statusCode = 400;
      throw error;
    }

    const cancelledBooking = await tx.booking.update({
      where: {
        id: Number(bookingId),
      },
      data: {
        status: "CANCELLED",
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
        id: booking.scheduleId,
      },
      data: {
        availableSeats: {
          increment: booking.passengerCount,
        },
      },
    });

    return cancelledBooking;
  });
};

const confirmBookingPayment = async ({ bookingId, userId }) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: Number(bookingId),
      userId: Number(userId),
    },
  });

  if (!booking) {
    const error = new Error("Rezervacija nije pronađena.");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status === "CANCELLED") {
    const error = new Error("Otkazana rezervacija ne može biti plaćena.");
    error.statusCode = 400;
    throw error;
  }

  if (booking.status === "CONFIRMED") {
    const error = new Error("Rezervacija je već potvrđena.");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.booking.update({
    where: {
      id: Number(bookingId),
    },
    data: {
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
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  confirmBookingPayment,
};
