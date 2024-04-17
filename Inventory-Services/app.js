const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./connection");
const Consul = require("consul");

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/inventory", require("./src/route/Inventory"));

app.get("/api/inventory/health-check", (req, res) => {
  res.status(200).json({ message: "User service is healthy" });
});

const PORT = process.env.PORT;
const CONSUL_PORT = 8500;

app.listen(PORT, async () => {
  console.log(`Inventory-Services is running on port ${PORT}`);

  const consul = new Consul({ host: "127.0.0.1", port: CONSUL_PORT });
  const serviceName = "inventory-service";
  const serviceId = `${serviceName}-${PORT}`;

  try {
    await consul.agent.service.register({
      name: serviceName,
      id: serviceId,
      address: "localhost",
      port: parseInt(PORT),
      check: {
        http: `http://localhost:${PORT}/api/inventory/health-check`,
        interval: "10s",
        timeout: "5s",
      },
    });
    console.log(`Service ${serviceName} registered with Consul`);
  } catch (error) {
    console.error("Error registering with Consul:", error);
  }
});
