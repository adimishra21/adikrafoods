# Online Food Ordering Backend

This is the backend service for the Online Food Ordering application, built with Spring Boot and MySQL.

## About the Project

This backend provides RESTful APIs for:
- User authentication and registration
- Restaurant and menu management
- Food ordering
- Cart functionality
- Order processing

## Tech Stack

- Java 21
- Spring Boot 3.4.3
- Spring Security with JWT authentication
- Spring Data JPA
- MySQL
- Flyway for database migrations
- Docker for containerization

## Project Structure

The application follows a standard Spring Boot application structure:
- `src/main/java/com/adi/controller`: REST API endpoints
- `src/main/java/com/adi/service`: Business logic
- `src/main/java/com/adi/repository`: Data access
- `src/main/java/com/adi/model`: Domain models
- `src/main/java/com/adi/dto`: Data transfer objects
- `src/main/java/com/adi/config`: Configuration classes
- `src/main/resources`: Properties and migrations

## Getting Started

### Prerequisites

- Java 21
- Maven
- MySQL (or Docker)

### Local Development

1. Clone the repository
2. Configure the database in `application.properties`
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. The API will be available at http://localhost:5454

### Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t food-ordering-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 5454:5454 food-ordering-backend
   ```

### Running with Docker Compose

This will start both the application and a MySQL database:

```bash
docker-compose up -d
```

## Deployment

For detailed deployment instructions, refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Frontend Integration

The frontend is already deployed at https://foodorderingsiteadi.netlify.app/ and is configured to connect to this backend running at https://adikrafoods-api.onrender.com.

## API Documentation

### Authentication

- `POST /auth/signup`: Register a new user
- `POST /auth/signin`: Login and get JWT token

### Restaurants

- `GET /api/restaurants`: Get all restaurants
- `GET /api/restaurants/{id}`: Get restaurant by ID
- `GET /api/restaurants/search`: Search restaurants

### Menu Items

- `GET /api/restaurants/{id}/menu`: Get restaurant menu
- `GET /api/restaurants/menu/search`: Search menu items

### Cart

- `GET /api/cart`: Get user's cart
- `POST /api/cart/add`: Add item to cart
- `DELETE /api/cart/remove`: Remove item from cart

### Orders

- `POST /api/orders`: Create order
- `GET /api/orders/{id}`: Get order by ID
- `GET /api/orders/user`: Get user's orders

## License

This project is licensed under the MIT License. 