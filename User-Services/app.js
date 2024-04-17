const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./connection");
const Consul = require("consul");
const app = express();

dotenv.config();
connectDb();

app.use(cors());
app.use(express.json());
app.use("/api/user", require("./src/routes/user"));

app.get("/api/user/health-check", (req, res) => {
  res.status(200).json({ message: "User service is Healthy" });
});

const PORT = process.env.PORT;
const CONSUL_PORT = 8500;

app.listen(PORT, async () => {
  console.log(`User-Service is Listening on port ${PORT}`);
  const consul = new Consul({ host: "127.0.0.1", port: CONSUL_PORT });
  const serviceName = "User-Services";
  const serviceId = `${serviceName}-${PORT}`;

  try {
    await consul.agent.service.register({
      name: serviceName,
      id: serviceId,
      address: "localhost",
      port: parseInt(PORT),
      check: {
        http: `http://localhost:${PORT}/api/user/health-check`,
        interval: "10s",
        timeout: "5s",
      },
    });
  } catch (error) {
    console.error("Error registering with Consul:", error);
  }
});
