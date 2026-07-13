const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function makeDateAt(daysFromToday, hour, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function upsertAirport({ name, city, country, code }) {
  return await prisma.airport.upsert({
    where: {
      code,
    },
    update: {
      name,
      city,
      country,
    },
    create: {
      name,
      city,
      country,
      code,
    },
  });
}

async function upsertDestination({
  city,
  country,
  description,
  climate,
  budgetLevel,
  travelType,
  imageUrl = null,
}) {
  const existingDestination = await prisma.destination.findFirst({
    where: {
      city,
      country,
    },
  });

  if (existingDestination) {
    return await prisma.destination.update({
      where: {
        id: existingDestination.id,
      },
      data: {
        description,
        climate,
        budgetLevel,
        travelType,
        imageUrl,
      },
    });
  }

  return await prisma.destination.create({
    data: {
      city,
      country,
      description,
      climate,
      budgetLevel,
      travelType,
      imageUrl,
    },
  });
}

async function upsertFlight({
  code,
  airline,
  durationMinutes,
  originAirportId,
  destinationAirportId,
}) {
  return await prisma.flight.upsert({
    where: {
      code,
    },
    update: {
      airline,
      durationMinutes,
      originAirportId,
      destinationAirportId,
    },
    create: {
      code,
      airline,
      durationMinutes,
      originAirportId,
      destinationAirportId,
    },
  });
}

async function upsertSchedule({
  flightId,
  departureTime,
  arrivalTime,
  basePrice,
  currency = "EUR",
  availableSeats,
}) {
  const existingSchedule = await prisma.flightSchedule.findFirst({
    where: {
      flightId,
      departureTime,
    },
  });

  if (existingSchedule) {
    return await prisma.flightSchedule.update({
      where: {
        id: existingSchedule.id,
      },
      data: {
        arrivalTime,
        basePrice,
        currency,
        availableSeats,
      },
    });
  }

  return await prisma.flightSchedule.create({
    data: {
      flightId,
      departureTime,
      arrivalTime,
      basePrice,
      currency,
      availableSeats,
    },
  });
}

async function main() {
  console.log("Dodavanje dodatnih podataka u bazu...");

  const airports = {};

  airports.BEG = await upsertAirport({
    name: "Belgrade Nikola Tesla Airport",
    city: "Belgrade",
    country: "Serbia",
    code: "BEG",
  });

  airports.BCN = await upsertAirport({
    name: "Barcelona El Prat Airport",
    city: "Barcelona",
    country: "Spain",
    code: "BCN",
  });

  airports.VIE = await upsertAirport({
    name: "Vienna International Airport",
    city: "Vienna",
    country: "Austria",
    code: "VIE",
  });

  airports.IST = await upsertAirport({
    name: "Istanbul Airport",
    city: "Istanbul",
    country: "Turkey",
    code: "IST",
  });

  airports.CDG = await upsertAirport({
    name: "Paris Charles de Gaulle Airport",
    city: "Paris",
    country: "France",
    code: "CDG",
  });

  airports.FCO = await upsertAirport({
    name: "Rome Fiumicino Airport",
    city: "Rome",
    country: "Italy",
    code: "FCO",
  });

  airports.LIS = await upsertAirport({
    name: "Lisbon Humberto Delgado Airport",
    city: "Lisbon",
    country: "Portugal",
    code: "LIS",
  });

  airports.AMS = await upsertAirport({
    name: "Amsterdam Schiphol Airport",
    city: "Amsterdam",
    country: "Netherlands",
    code: "AMS",
  });

  airports.DXB = await upsertAirport({
    name: "Dubai International Airport",
    city: "Dubai",
    country: "United Arab Emirates",
    code: "DXB",
  });

  airports.PRG = await upsertAirport({
    name: "Václav Havel Airport Prague",
    city: "Prague",
    country: "Czech Republic",
    code: "PRG",
  });

  airports.BUD = await upsertAirport({
    name: "Budapest Ferenc Liszt International Airport",
    city: "Budapest",
    country: "Hungary",
    code: "BUD",
  });

  airports.ATH = await upsertAirport({
    name: "Athens International Airport",
    city: "Athens",
    country: "Greece",
    code: "ATH",
  });

  await upsertDestination({
    city: "Barcelona",
    country: "Spain",
    description:
      "Barcelona is a Mediterranean destination known for beaches, architecture, food, culture and relaxed city tourism.",
    climate: "warm",
    budgetLevel: "medium",
    travelType: "city_beach_culture_food_architecture",
  });

  await upsertDestination({
    city: "Vienna",
    country: "Austria",
    description:
      "Vienna is a cultural city destination known for museums, classical music, architecture, history and elegant city tourism.",
    climate: "moderate",
    budgetLevel: "medium",
    travelType: "city_culture_history_museums_architecture",
  });

  await upsertDestination({
    city: "Istanbul",
    country: "Turkey",
    description:
      "Istanbul combines history, culture, food, shopping, architecture and a unique connection between Europe and Asia.",
    climate: "moderate",
    budgetLevel: "medium",
    travelType: "city_history_culture_food_shopping",
  });

  await upsertDestination({
    city: "Paris",
    country: "France",
    description:
      "Paris is a famous city destination for museums, culture, architecture, shopping, food and romantic travel.",
    climate: "moderate",
    budgetLevel: "high",
    travelType: "city_culture_museums_luxury_shopping_food",
  });

  await upsertDestination({
    city: "Rome",
    country: "Italy",
    description:
      "Rome is known for ancient history, museums, architecture, food, culture and walking city tours.",
    climate: "warm",
    budgetLevel: "medium",
    travelType: "city_history_culture_museums_food_architecture",
  });

  await upsertDestination({
    city: "Lisbon",
    country: "Portugal",
    description:
      "Lisbon is a warm coastal city destination with ocean views, food, culture, walking routes and relaxed tourism.",
    climate: "warm",
    budgetLevel: "medium",
    travelType: "city_ocean_coast_food_culture_relax",
  });

  await upsertDestination({
    city: "Amsterdam",
    country: "Netherlands",
    description:
      "Amsterdam is a city destination known for canals, museums, culture, architecture, walking and cycling.",
    climate: "moderate",
    budgetLevel: "medium",
    travelType: "city_culture_museums_architecture_walk",
  });

  await upsertDestination({
    city: "Dubai",
    country: "United Arab Emirates",
    description:
      "Dubai is a hot luxury destination known for shopping, modern architecture, beaches, hotels and entertainment.",
    climate: "hot",
    budgetLevel: "high",
    travelType: "luxury_shopping_beach_modern_city",
  });

  await upsertDestination({
    city: "Prague",
    country: "Czech Republic",
    description:
      "Prague is a city destination known for history, architecture, culture, bridges, museums and affordable tourism.",
    climate: "moderate",
    budgetLevel: "low",
    travelType: "city_history_culture_museums_architecture",
  });

  await upsertDestination({
    city: "Budapest",
    country: "Hungary",
    description:
      "Budapest is known for history, architecture, Danube river views, thermal baths, culture and lower budget city tourism.",
    climate: "moderate",
    budgetLevel: "low",
    travelType: "city_history_culture_relax_architecture",
  });

  await upsertDestination({
    city: "Athens",
    country: "Greece",
    description:
      "Athens is a warm historical destination known for ancient monuments, museums, culture, food and access to the sea.",
    climate: "warm",
    budgetLevel: "medium",
    travelType: "city_history_culture_museums_food_sea",
  });

  const flights = [];

  flights.push(
    await upsertFlight({
      code: "JU100",
      airline: "Air Serbia",
      durationMinutes: 160,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.BCN.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU200",
      airline: "Air Serbia",
      durationMinutes: 85,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.VIE.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU300",
      airline: "Air Serbia",
      durationMinutes: 105,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.IST.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU400",
      airline: "Air Serbia",
      durationMinutes: 150,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.CDG.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU500",
      airline: "Air Serbia",
      durationMinutes: 95,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.FCO.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU600",
      airline: "Air Serbia",
      durationMinutes: 210,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.LIS.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU700",
      airline: "Air Serbia",
      durationMinutes: 145,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.AMS.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU800",
      airline: "Air Serbia",
      durationMinutes: 320,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.DXB.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU900",
      airline: "Air Serbia",
      durationMinutes: 95,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.PRG.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU910",
      airline: "Air Serbia",
      durationMinutes: 70,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.BUD.id,
    }),
  );

  flights.push(
    await upsertFlight({
      code: "JU920",
      airline: "Air Serbia",
      durationMinutes: 110,
      originAirportId: airports.BEG.id,
      destinationAirportId: airports.ATH.id,
    }),
  );

  const scheduleTemplates = [
    {
      daysFromToday: 1,
      departureHour: 9,
      arrivalExtraMinutes: 0,
      priceMultiplier: 1,
    },
    {
      daysFromToday: 2,
      departureHour: 13,
      arrivalExtraMinutes: 15,
      priceMultiplier: 1.08,
    },
    {
      daysFromToday: 3,
      departureHour: 18,
      arrivalExtraMinutes: 25,
      priceMultiplier: 1.15,
    },
    {
      daysFromToday: 7,
      departureHour: 10,
      arrivalExtraMinutes: 10,
      priceMultiplier: 0.95,
    },
  ];

  const basePrices = {
    JU100: 139.99,
    JU200: 89.99,
    JU300: 119.99,
    JU400: 159.99,
    JU500: 109.99,
    JU600: 179.99,
    JU700: 149.99,
    JU800: 299.99,
    JU900: 99.99,
    JU910: 79.99,
    JU920: 129.99,
  };

  for (const flight of flights) {
    for (const template of scheduleTemplates) {
      const departureTime = makeDateAt(
        template.daysFromToday,
        template.departureHour,
        0,
      );

      const arrivalTime = new Date(
        departureTime.getTime() +
          (flight.durationMinutes + template.arrivalExtraMinutes) * 60 * 1000,
      );

      const basePrice = Number(
        (basePrices[flight.code] * template.priceMultiplier).toFixed(2),
      );

      await upsertSchedule({
        flightId: flight.id,
        departureTime,
        arrivalTime,
        basePrice,
        currency: "EUR",
        availableSeats: 120,
      });
    }
  }

  console.log("Dodatni podaci su uspešno ubačeni u bazu.");
  console.log("Dodati su aerodromi, destinacije, letovi i termini letova.");
}

main()
  .catch((error) => {
    console.error("Greška prilikom dodavanja dodatnih podataka:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
