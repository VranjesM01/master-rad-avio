require("dotenv").config();

const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});

server.on("error", (error) => {
  console.error("Greška pri pokretanju servera:", error);
});

server.on("close", () => {
  console.log("Server je zatvoren.");
});
