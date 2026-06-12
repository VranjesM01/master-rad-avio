const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
