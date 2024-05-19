# Microservices E-commerce Project

This repository contains a Node.js project for building microservices for e-commerce web services. The project includes the following microservices:

- **User Service**: Manages user profiles, authentication, and authorization.
- **Cart Service**: Handles shopping cart functionality, including adding, removing, and updating items in the cart.
- **Inventory Service**: Manages product inventory, including stock levels and availability.
- **Product Service**: Manages the product catalog, including CRUD operations on products.

## Features

- **Modular Architecture**: Each microservice is designed to handle a specific aspect of the e-commerce platform, promoting modularity and scalability.
  
- **RESTful APIs**: All microservices expose RESTful APIs, allowing seamless communication between services and clients.

- **Node.js**: The backend services are developed using Node.js, leveraging its asynchronous, event-driven architecture for high performance.

- **Dockerized Environment**: Docker containers are used for deployment, providing consistency across different environments and facilitating scalability.

- **Load Balancer and API Gateway**: Utilizes a load balancer to distribute incoming traffic across multiple instances of microservices, improving performance and reliability. An API gateway is employed to manage the entry point for all client requests, providing routing, authentication, and rate limiting.

- **Service Discovery**: Consul services are used for service discovery, enabling dynamic registration and discovery of microservices within the architecture.

## Prerequisites

- Node.js and npm installed on your machine.
- Docker and Docker Compose  installed to run the application locally.

## Getting Started

1. Clone this repository to your local machine.
2. Navigate to the root directory of the repository.
3. Run `docker-compose up` to start the application and spin up the required Docker containers.
4. Access the individual microservices using their respective endpoints.

## Usage

- Each microservice has its own endpoints for performing CRUD operations and other functionalities.
- Use the API gateway endpoint to access the microservices from the client application.
- Monitor the health and performance of the services using Consul services and other monitoring tools.

## Contributing

Contributions are welcome! Please feel free to submit a pull request for any improvements or additional features.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.
