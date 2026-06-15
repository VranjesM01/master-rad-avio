const prisma = require("../config/prisma");
const openai = require("../config/openai");

const defaultQuestions = [
  {
    id: "travel_style",
    question: "Kakav tip putovanja najviše želiš?",
    type: "single_choice",
    options: [
      "Grad i kultura",
      "More i plaža",
      "Hrana i istorija",
      "Luksuz i kupovina",
      "Opušten odmor",
    ],
  },
  {
    id: "budget",
    question: "Koliki budžet planiraš za putovanje?",
    type: "single_choice",
    options: ["Nizak", "Srednji", "Visok"],
  },
  {
    id: "climate",
    question: "Kakvu klimu preferiraš?",
    type: "single_choice",
    options: ["Topla", "Umerena", "Hladnija", "Veoma topla"],
  },
  {
    id: "activities",
    question: "Šta ti je najvažnije na putovanju?",
    type: "multiple_choice",
    options: [
      "Muzeji",
      "Plaža",
      "Noćni život",
      "Kupovina",
      "Hrana",
      "Istorijske znamenitosti",
      "Moderan grad",
    ],
  },
  {
    id: "duration",
    question: "Koliko dana planiraš da putuješ?",
    type: "single_choice",
    options: ["2-3 dana", "4-6 dana", "7+ dana"],
  },
];

const getQuestions = async () => {
  if (!openai) {
    return {
      source: "fallback",
      questions: defaultQuestions,
    };
  }

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Ti generišeš pitanja za web aplikaciju koja preporučuje turističke destinacije. Vrati isključivo validan JSON.",
        },
        {
          role: "user",
          content:
            'Generiši 5 pitanja za korisnika koji želi preporuku destinacije za putovanje. Svako pitanje mora imati id, question, type i options. type može biti single_choice ili multiple_choice. Vrati JSON u formatu {"questions": [...]}',
        },
      ],
    });

    const parsed = JSON.parse(response.output_text);

    return {
      source: "openai",
      questions: parsed.questions,
    };
  } catch (error) {
    console.error("OpenAI questions fallback:", error.message);

    return {
      source: "fallback",
      questions: defaultQuestions,
    };
  }
};

const buildFallbackRecommendations = (destinations, answers) => {
  const answerText = JSON.stringify(answers).toLowerCase();

  return destinations
    .map((destination) => {
      let score = 50;

      const combined =
        `${destination.city} ${destination.country} ${destination.description} ${destination.climate} ${destination.budgetLevel} ${destination.travelType}`.toLowerCase();

      if (answerText.includes("more") || answerText.includes("plaža")) {
        if (
          combined.includes("beach") ||
          combined.includes("ocean") ||
          combined.includes("more")
        ) {
          score += 25;
        }
      }

      if (answerText.includes("kultura") || answerText.includes("muzej")) {
        if (
          combined.includes("culture") ||
          combined.includes("museums") ||
          combined.includes("kulturu")
        ) {
          score += 20;
        }
      }

      if (answerText.includes("istorija") || answerText.includes("hrana")) {
        if (
          combined.includes("history") ||
          combined.includes("food") ||
          combined.includes("istorije")
        ) {
          score += 20;
        }
      }

      if (answerText.includes("luksuz") || answerText.includes("kupovina")) {
        if (combined.includes("luxury") || combined.includes("shopping")) {
          score += 25;
        }
      }

      if (answerText.includes("visok")) {
        if (destination.budgetLevel === "high") {
          score += 10;
        }
      }

      if (answerText.includes("srednji")) {
        if (destination.budgetLevel === "medium") {
          score += 10;
        }
      }

      if (answerText.includes("nizak")) {
        if (destination.budgetLevel === "low") {
          score += 10;
        }
      }

      return {
        destinationId: destination.id,
        city: destination.city,
        country: destination.country,
        score: Math.min(score, 100),
        reason: `Destinacija ${destination.city} odgovara na osnovu unetih preferencija i karakteristika destinacije iz baze.`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

const getRecommendations = async ({ userId, answers }) => {
  const destinations = await prisma.destination.findMany({
    orderBy: {
      city: "asc",
    },
  });

  if (destinations.length === 0) {
    const error = new Error("U bazi nema destinacija za preporuku.");
    error.statusCode = 400;
    throw error;
  }

  let recommendationResult;

  if (openai) {
    try {
      const destinationsForPrompt = destinations.map((destination) => ({
        id: destination.id,
        city: destination.city,
        country: destination.country,
        description: destination.description,
        climate: destination.climate,
        budgetLevel: destination.budgetLevel,
        travelType: destination.travelType,
      }));

      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "Ti si AI modul za preporuku turističkih destinacija u web aplikaciji za avionske karte. Koristi samo destinacije koje su prosleđene iz baze. Vrati isključivo validan JSON.",
          },
          {
            role: "user",
            content: JSON.stringify({
              task: "Na osnovu korisničkih odgovora rangiraj najbolje 3 destinacije.",
              answers,
              availableDestinations: destinationsForPrompt,
              requiredOutput: {
                summary: "kratak opis preporuke",
                recommendations: [
                  {
                    destinationId: "id destinacije iz baze",
                    city: "grad",
                    country: "država",
                    score: "broj od 0 do 100",
                    reason: "objašnjenje zašto je destinacija preporučena",
                  },
                ],
              },
            }),
          },
        ],
      });

      const parsed = JSON.parse(response.output_text);

      recommendationResult = {
        summary: parsed.summary,
        recommendations: parsed.recommendations.map((item) => ({
          destinationId: Number(item.destinationId),
          city: item.city,
          country: item.country,
          score: Number(item.score),
          reason: item.reason,
        })),
      };
    } catch (error) {
      console.error("OpenAI recommendations fallback:", error.message);

      recommendationResult = {
        summary:
          "Preporuke su generisane lokalnim fallback algoritmom jer OpenAI odgovor nije bio dostupan.",
        recommendations: buildFallbackRecommendations(destinations, answers),
      };
    }
  } else {
    recommendationResult = {
      summary:
        "Preporuke su generisane lokalnim fallback algoritmom jer OpenAI API ključ nije podešen.",
      recommendations: buildFallbackRecommendations(destinations, answers),
    };
  }

  const session = await prisma.recommendationSession.create({
    data: {
      userId: userId ? Number(userId) : null,
      answers,
      summary: recommendationResult.summary,
      recommendations: {
        create: recommendationResult.recommendations.map((recommendation) => ({
          destinationId: recommendation.destinationId || null,
          city: recommendation.city,
          country: recommendation.country,
          score: recommendation.score,
          reason: recommendation.reason,
        })),
      },
    },
    include: {
      recommendations: {
        orderBy: {
          score: "desc",
        },
      },
    },
  });

  return session;
};

const getUserRecommendationSessions = async (userId) => {
  return await prisma.recommendationSession.findMany({
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
      createdAt: "desc",
    },
  });
};

module.exports = {
  getQuestions,
  getRecommendations,
  getUserRecommendationSessions,
};
