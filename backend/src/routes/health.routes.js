const express = require("express");

const {
  getHealthStatus,
  getDatabaseStatus,
} = require("../controllers/health.controller");

const router = express.Router();

router.get("/", getHealthStatus);
router.get("/db", getDatabaseStatus);

module.exports = router;
