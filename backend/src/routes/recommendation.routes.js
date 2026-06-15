const express = require("express");

const {
  getQuestions,
  createRecommendation,
  getMyRecommendations,
} = require("../controllers/recommendation.controller");

const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/", authenticate, createRecommendation);
router.get("/my", authenticate, getMyRecommendations);

module.exports = router;
