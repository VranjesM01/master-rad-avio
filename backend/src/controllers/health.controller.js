const getHealthStatus = (req, res) => {
  res.json({
    status: "OK",
    message: "Backend API radi ispravno.",
    project: "Flight AI Recommender",
  });
};

module.exports = {
  getHealthStatus,
};
