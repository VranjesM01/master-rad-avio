const prisma = require("../config/prisma");

let openaiClient = null;

try {
  const openaiModule = require("../config/openai");
  openaiClient = openaiModule?.openai || openaiModule?.client || openaiModule;
} catch (error) {
  openaiClient = null;
}

const defaultQuestions = [
  {
    id: "travelStyle",
    text: "Kakav tip putovanja najviše želite?",
    type: "single",
    options: [
      "More i plaža",
      "Grad i kultura",
      "Istorija i muzeji",
      "Luksuz i kupovina",
      "Opuštanje i lagano putovanje",
    ],
  },
  {
    id: "budget",
    text: "Koliki budžet planirate?",
    type: "single",
    options: ["Nizak", "Srednji", "Visok"],
  },
  {
    id: "climate",
    text: "Kakvu klimu preferirate?",
    type: "single",
    options: ["Topla", "Umerena", "Hladna", "Veoma topla"],
  },
  {
    id: "activities",
    text: "Koje aktivnosti su vam važne?",
    type: "multiple",
    options: [
      "Plaža",
      "Muzeji",
      "Hrana",
      "Noćni život",
      "Kupovina",
      "Arhitektura",
      "Šetnja",
    ],
  },
  {
    id: "duration",
    text: "Koliko dana planirate putovanje?",
    type: "single",
    options: ["Vikend", "3-5 dana", "7 dana", "Više od 7 dana"],
  },
];

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim();
};

const buildAirportMap = async () => {
  const airports = await prisma.airport.findMany();

  const mapByCityCountry = new Map();
  const mapByCity = new Map();

  airports.forEach((airport) => {
    const city = normalizeText(airport.city);
    const country = normalizeText(airport.country);

    mapByCityCountry.set(`${city}-${country}`, airport.code);
    mapByCity.set(city, airport.code);
  });

  return {
    mapByCityCountry,
    mapByCity,
  };
};

const findAirportCodeForDestination = (destination, airportMaps) => {
  const city = normalizeText(destination.city);
  const country = normalizeText(destination.country);

  return (
    airportMaps.mapByCityCountry.get(`${city}-${country}`) ||
    airportMaps.mapByCity.get(city) ||
    null
  );
};

const buildReason = (destination, answerText, score) => {
  const reasons = [];

  const combined = normalizeText(
    `${destination.description} ${destination.climate} ${destination.budgetLevel} ${destination.travelType}`,
  );

  if (
    (answerText.includes("more") ||
      answerText.includes("plaža") ||
      answerText.includes("plaza")) &&
    (combined.includes("beach") ||
      combined.includes("ocean") ||
      combined.includes("sea") ||
      combined.includes("coast"))
  ) {
    reasons.push("odgovara želji za morem i plažom");
  }

  if (
    (answerText.includes("kultura") ||
      answerText.includes("muzej") ||
      answerText.includes("istorija")) &&
    (combined.includes("culture") ||
      combined.includes("museum") ||
      combined.includes("history") ||
      combined.includes("architecture"))
  ) {
    reasons.push("ima jak kulturni i istorijski sadržaj");
  }

  if (
    (answerText.includes("luksuz") || answerText.includes("kupovina")) &&
    (combined.includes("luxury") || combined.includes("shopping"))
  ) {
    reasons.push("pogodna je za luksuz, kupovinu i moderan gradski turizam");
  }

  if (
    answerText.includes("topla") &&
    (combined.includes("warm") || combined.includes("hot"))
  ) {
    reasons.push("klima se uklapa u izabrane preferencije");
  }

  if (answerText.includes("umerena") && combined.includes("moderate")) {
    reasons.push("ima umerenu klimu");
  }

  if (answerText.includes("nizak") && combined.includes("low")) {
    reasons.push("odgovara nižem budžetu");
  }

  if (answerText.includes("srednji") && combined.includes("medium")) {
    reasons.push("odgovara srednjem budžetu");
  }

  if (answerText.includes("visok") && combined.includes("high")) {
    reasons.push("odgovara višem budžetu");
  }

  if (reasons.length === 0) {
    return `Destinacija ${destination.city} je preporučena na osnovu ukupnog poklapanja sa unetim preferencijama.`;
  }

  return `Destinacija ${destination.city} je preporučena jer ${reasons.join(
    ", ",
  )}. Ukupno poklapanje je ${score}%.`;
};

const buildFallbackRecommendations = async (destinations, answers) => {
  const airportMaps = await buildAirportMap();
  const answerText = normalizeText(JSON.stringify(answers));

  return destinations
    .map((destination) => {
      let score = 50;

      const combined = normalizeText(
        `${destination.city} ${destination.country} ${destination.description} ${destination.climate} ${destination.budgetLevel} ${destination.travelType}`,
      );

      if (
        answerText.includes("more") ||
        answerText.includes("plaža") ||
        answerText.includes("plaza")
      ) {
        if (
          combined.includes("beach") ||
          combined.includes("ocean") ||
          combined.includes("sea") ||
          combined.includes("coast")
        ) {
          score += 25;
        }
      }

      if (
        answerText.includes("kultura") ||
        answerText.includes("muzej") ||
        answerText.includes("istorija")
      ) {
        if (
          combined.includes("culture") ||
          combined.includes("museum") ||
          combined.includes("history") ||
          combined.includes("architecture")
        ) {
          score += 20;
        }
      }

      if (answerText.includes("luksuz") || answerText.includes("kupovina")) {
        if (combined.includes("luxury") || combined.includes("shopping")) {
          score += 25;
        }
      }

      if (answerText.includes("topla")) {
        if (combined.includes("warm") || combined.includes("hot")) {
          score += 15;
        }
      }

      if (answerText.includes("umerena")) {
        if (combined.includes("moderate")) {
          score += 15;
        }
      }

      if (answerText.includes("nizak")) {
        if (combined.includes("low")) {
          score += 15;
        }
      }

      if (answerText.includes("srednji")) {
        if (combined.includes("medium")) {
          score += 15;
        }
      }

      if (answerText.includes("visok")) {
        if (combined.includes("high")) {
          score += 15;
        }
      }

      score = Math.min(score, 100);

      return {
        destinationId: destination.id,
        city: destination.city,
        country: destination.country,
        score,
        airportCode: findAirportCodeForDestination(destination, airportMaps),
        reason: buildReason(destination, answerText, score),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

const tryOpenAIRecommendations = async (destinations, answers) => {
  if (!openaiClient || !openaiClient.responses?.create) {
    return null;
  }

  try {
    const destinationList = destinations.map((destination) => ({
      id: destination.id,
      city: destination.city,
      country: destination.country,
      description: destination.description,
      climate: destination.climate,
      budgetLevel: destination.budgetLevel,
      travelType: destination.travelType,
    }));

    const response = await openaiClient.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You recommend travel destinations. Return only valid JSON array with three objects. Each object must have destinationId, city, country, score, reason.",
        },
        {
          role: "user",
          content: JSON.stringify({
            answers,
            availableDestinations: destinationList,
          }),
        },
      ],
    });

    const text =
      response.output_text || response.output?.[0]?.content?.[0]?.text || "";

    if (!text) {
      return null;
    }

    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      return null;
    }

    const airportMaps = await buildAirportMap();

    return parsed
      .slice(0, 3)
      .map((item) => ({
        destinationId: item.destinationId || null,
        city: item.city,
        country: item.country,
        score: Math.min(Number(item.score) || 70, 100),
        reason:
          item.reason ||
          `Destinacija ${item.city} odgovara na osnovu unetih preferencija.`,
        airportCode: findAirportCodeForDestination(item, airportMaps),
      }))
      .filter((item) => item.city && item.country);
  } catch (error) {
    console.error(
      "OpenAI preporuka nije uspela, koristi se fallback:",
      error.message,
    );
    return null;
  }
};

const getRecommendationQuestions = () => {
  return defaultQuestions;
};

const createRecommendation = async ({ userId, answers }) => {
  if (!answers || Object.keys(answers).length === 0) {
    const error = new Error("Odgovori korisnika su obavezni.");
    error.statusCode = 400;
    throw error;
  }

  const destinations = await prisma.destination.findMany({
    orderBy: {
      city: "asc",
    },
  });

  if (destinations.length === 0) {
    const error = new Error("Nema destinacija u bazi.");
    error.statusCode = 404;
    throw error;
  }

  let recommendations = await tryOpenAIRecommendations(destinations, answers);

  if (!recommendations || recommendations.length === 0) {
    recommendations = await buildFallbackRecommendations(destinations, answers);
  }

  const session = await prisma.recommendationSession.create({
    data: {
      userId: userId ? Number(userId) : null,
      answers,
      summary:
        "Preporuke su generisane na osnovu korisničkih preferencija i dostupnih destinacija.",
      recommendations: {
        create: recommendations.map((recommendation) => ({
          destinationId: recommendation.destinationId || null,
          city: recommendation.city,
          country: recommendation.country,
          score: recommendation.score,
          reason: recommendation.reason,
        })),
      },
    },
    include: {
      recommendations: true,
    },
  });

  return {
    id: session.id,
    userId: session.userId,
    answers: session.answers,
    summary: session.summary,
    createdAt: session.createdAt,
    recommendations,
  };
};

const getMyRecommendations = async (userId) => {
  const sessions = await prisma.recommendationSession.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      recommendations: {
        orderBy: {
          score: "desc",
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  const airportMaps = await buildAirportMap();

  return sessions.map((session) => ({
    ...session,
    recommendations: session.recommendations.map((recommendation) => ({
      ...recommendation,
      airportCode: findAirportCodeForDestination(recommendation, airportMaps),
    })),
  }));
};

module.exports = {
  getRecommendationQuestions,
  getQuestions: getRecommendationQuestions,
  getDefaultQuestions: getRecommendationQuestions,

  createRecommendation,
  generateRecommendations: createRecommendation,

  getMyRecommendations,
  getMyRecommendationSessions: getMyRecommendations,
};
