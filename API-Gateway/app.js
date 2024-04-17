const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const Consul = require("consul");

const app = express();

app.get("/api/gateway/health-check", (req, res) => {
  res.status(200).json({ message: "API Gateway is Healthy" });
});

const routes = {
  "/api/product": "http://localhost:8081",
  "/api/inventory": "http://localhost:8082",
  "/api/user": "http://localhost:8083",
  "/api/cart": "http://localhost:8084",
};

for (const route in routes) {
  const target = routes[route];
  app.use(route, createProxyMiddleware({ target }));
}

const consul = new Consul({ host: "127.0.0.1", port: 8500 });
const serviceName = "API-Gateway";
const serviceId = `${serviceName}-8080`;

try {
  consul.agent.service.register({
    name: serviceName,
    id: serviceId,
    address: "localhost",
    port: 8080,
    check: {
      http: `http://localhost:8080/api/gateway/health-check`,
      interval: "10s",
      timeout: "5s",
    },
  });
  console.log(`Service ${serviceName} registered with Consul`);
} catch (error) {
  console.error("Error Registering with Consul:", error);
}

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`API GATEWAY STARTED ${PORT}`);
});
