const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    message: "Flight AI Recommender backend radi!",
  });
});

module.exports = app;
