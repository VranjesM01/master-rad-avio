const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addDays = (days, hours, minutes = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

async function main() {
  console.log("Pokreće se unos početnih podataka...");

  const airports = [
    {
      name: "Nikola Tesla Airport",
      city: "Belgrade",
      country: "Serbia",
      code: "BEG",
    },
    {
      name: "Barcelona El Prat Airport",
      city: "Barcelona",
      country: "Spain",
      code: "BCN",
    },
    {
      name: "Vienna International Airport",
      city: "Vienna",
      country: "Austria",
      code: "VIE",
    },
    {
      name: "Istanbul Airport",
      city: "Istanbul",
      country: "Turkey",
      code: "IST",
    },
    {
      name: "Charles de Gaulle Airport",
      city: "Paris",
      country: "France",
      code: "CDG",
    },
    {
      name: "Leonardo da Vinci Fiumicino Airport",
      city: "Rome",
      country: "Italy",
      code: "FCO",
    },
    {
      name: "Humberto Delgado Airport",
      city: "Lisbon",
      country: "Portugal",
      code: "LIS",
    },
    {
      name: "Amsterdam Schiphol Airport",
      city: "Amsterdam",
      country: "Netherlands",
      code: "AMS",
    },
    {
      name: "Dubai International Airport",
      city: "Dubai",
      country: "United Arab Emirates",
      code: "DXB",
    },
  ];

  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { code: airport.code },
      update: airport,
      create: airport,
    });
  }

  const destinations = [
    {
      city: "Barcelona",
      country: "Spain",
      description:
        "Barcelona je destinacija koja kombinuje more, arhitekturu, kulturu, dobru hranu i bogat noćni život.",
      climate: "warm",
      budgetLevel: "medium",
      travelType: "city_beach_culture",
      imageUrl: null,
    },
    {
      city: "Vienna",
      country: "Austria",
      description:
        "Beč je idealan za korisnike koji vole kulturu, muzeje, istoriju, sigurnost i kraća city break putovanja.",
      climate: "moderate",
      budgetLevel: "medium",
      travelType: "city_culture",
      imageUrl: null,
    },
    {
      city: "Istanbul",
      country: "Turkey",
      description:
        "Istanbul je pogodan za korisnike koji žele istoriju, tradicionalnu hranu, kupovinu i spoj Evrope i Azije.",
      climate: "moderate",
      budgetLevel: "low",
      travelType: "culture_food_shopping",
      imageUrl: null,
    },
    {
      city: "Paris",
      country: "France",
      description:
        "Pariz je destinacija za korisnike koje zanimaju umetnost, moda, romantika, gastronomija i poznate znamenitosti.",
      climate: "moderate",
      budgetLevel: "high",
      travelType: "city_culture_romantic",
      imageUrl: null,
    },
    {
      city: "Rome",
      country: "Italy",
      description:
        "Rim je odličan izbor za ljubitelje istorije, arhitekture, italijanske kuhinje i kulturnog turizma.",
      climate: "warm",
      budgetLevel: "medium",
      travelType: "history_food_culture",
      imageUrl: null,
    },
    {
      city: "Lisbon",
      country: "Portugal",
      description:
        "Lisabon odgovara korisnicima koji žele toplu klimu, okean, šetnju, dobru hranu i opuštenu atmosferu.",
      climate: "warm",
      budgetLevel: "medium",
      travelType: "city_ocean_relax",
      imageUrl: null,
    },
    {
      city: "Amsterdam",
      country: "Netherlands",
      description:
        "Amsterdam je dobar izbor za korisnike koji vole urbani turizam, muzeje, kanale, biciklizam i modernu kulturu.",
      climate: "cold",
      budgetLevel: "high",
      travelType: "city_museums_modern",
      imageUrl: null,
    },
    {
      city: "Dubai",
      country: "United Arab Emirates",
      description:
        "Dubai je destinacija za korisnike koji žele luksuz, toplo vreme, moderne atrakcije, kupovinu i hotele visokog standarda.",
      climate: "hot",
      budgetLevel: "high",
      travelType: "luxury_shopping_modern",
      imageUrl: null,
    },
  ];

  for (const destination of destinations) {
    await prisma.destination.upsert({
      where: {
        city_country: {
          city: destination.city,
          country: destination.country,
        },
      },
      update: destination,
      create: destination,
    });
  }

  const flights = [
    {
      code: "JU100",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "BCN",
      durationMinutes: 150,
    },
    {
      code: "JU200",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "VIE",
      durationMinutes: 80,
    },
    {
      code: "JU300",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "IST",
      durationMinutes: 105,
    },
    {
      code: "JU400",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "CDG",
      durationMinutes: 145,
    },
    {
      code: "JU500",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "FCO",
      durationMinutes: 90,
    },
    {
      code: "JU600",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "LIS",
      durationMinutes: 210,
    },
    {
      code: "JU700",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "AMS",
      durationMinutes: 160,
    },
    {
      code: "JU800",
      airline: "Air Serbia",
      originCode: "BEG",
      destinationCode: "DXB",
      durationMinutes: 330,
    },
  ];

  for (const flight of flights) {
    await prisma.flight.upsert({
      where: { code: flight.code },
      update: {
        airline: flight.airline,
        durationMinutes: flight.durationMinutes,
        originAirport: {
          connect: {
            code: flight.originCode,
          },
        },
        destinationAirport: {
          connect: {
            code: flight.destinationCode,
          },
        },
      },
      create: {
        code: flight.code,
        airline: flight.airline,
        durationMinutes: flight.durationMinutes,
        originAirport: {
          connect: {
            code: flight.originCode,
          },
        },
        destinationAirport: {
          connect: {
            code: flight.destinationCode,
          },
        },
      },
    });
  }

  const savedFlights = await prisma.flight.findMany();
  const flightMap = {};

  savedFlights.forEach((flight) => {
    flightMap[flight.code] = flight;
  });

  await prisma.flightSchedule.deleteMany();

  const departure1 = addDays(3, 9, 30);
  const departure2 = addDays(4, 14, 0);
  const departure3 = addDays(5, 18, 15);
  const departure4 = addDays(6, 7, 45);
  const departure5 = addDays(7, 12, 20);
  const departure6 = addDays(8, 16, 10);
  const departure7 = addDays(9, 10, 0);
  const departure8 = addDays(10, 22, 30);

  const schedules = [
    {
      flightId: flightMap["JU100"].id,
      departureTime: departure1,
      arrivalTime: addMinutes(departure1, 150),
      basePrice: 129.99,
      currency: "EUR",
      availableSeats: 120,
    },
    {
      flightId: flightMap["JU200"].id,
      departureTime: departure2,
      arrivalTime: addMinutes(departure2, 80),
      basePrice: 89.99,
      currency: "EUR",
      availableSeats: 90,
    },
    {
      flightId: flightMap["JU300"].id,
      departureTime: departure3,
      arrivalTime: addMinutes(departure3, 105),
      basePrice: 109.99,
      currency: "EUR",
      availableSeats: 110,
    },
    {
      flightId: flightMap["JU400"].id,
      departureTime: departure4,
      arrivalTime: addMinutes(departure4, 145),
      basePrice: 149.99,
      currency: "EUR",
      availableSeats: 100,
    },
    {
      flightId: flightMap["JU500"].id,
      departureTime: departure5,
      arrivalTime: addMinutes(departure5, 90),
      basePrice: 99.99,
      currency: "EUR",
      availableSeats: 130,
    },
    {
      flightId: flightMap["JU600"].id,
      departureTime: departure6,
      arrivalTime: addMinutes(departure6, 210),
      basePrice: 179.99,
      currency: "EUR",
      availableSeats: 95,
    },
    {
      flightId: flightMap["JU700"].id,
      departureTime: departure7,
      arrivalTime: addMinutes(departure7, 160),
      basePrice: 139.99,
      currency: "EUR",
      availableSeats: 105,
    },
    {
      flightId: flightMap["JU800"].id,
      departureTime: departure8,
      arrivalTime: addMinutes(departure8, 330),
      basePrice: 299.99,
      currency: "EUR",
      availableSeats: 140,
    },
  ];

  await prisma.flightSchedule.createMany({
    data: schedules,
  });

  console.log("Početni podaci su uspešno uneti.");
}

main()
  .catch((error) => {
    console.error("Greška prilikom unosa početnih podataka:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
