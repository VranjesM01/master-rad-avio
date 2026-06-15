const recommendationService = require("../services/recommendation.service");

const getQuestions = async (req, res) => {
  try {
    const result = await recommendationService.getQuestions();

    res.json({
      message: "Pitanja za preporuku su uspešno učitana.",
      source: result.source,
      data: result.questions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja pitanja.",
    });
  }
};

const createRecommendation = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        message: "Odgovori korisnika su obavezni.",
      });
    }

    const session = await recommendationService.getRecommendations({
      userId: req.user?.id || null,
      answers,
    });

    res.status(201).json({
      message: "Preporuke su uspešno generisane.",
      data: session,
    });
  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Greška prilikom generisanja preporuka.",
    });
  }
};

const getMyRecommendations = async (req, res) => {
  try {
    const sessions = await recommendationService.getUserRecommendationSessions(
      req.user.id,
    );

    res.json({
      message: "AI preporuke su uspešno učitane.",
      data: sessions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Greška prilikom učitavanja AI preporuka.",
    });
  }
};

module.exports = {
  getQuestions,
  createRecommendation,
  getMyRecommendations,
};
