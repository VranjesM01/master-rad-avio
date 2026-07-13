const recommendationService = require("../services/recommendation.service");

const getQuestions = async (req, res) => {
  try {
    const questions = recommendationService.getRecommendationQuestions();

    res.json({
      message: "Pitanja su uspešno učitana.",
      data: questions,
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

    const result = await recommendationService.createRecommendation({
      userId: req.user.id,
      answers,
    });

    res.status(201).json({
      message: "AI preporuke su uspešno generisane.",
      data: result,
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
    const sessions = await recommendationService.getMyRecommendations(
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
