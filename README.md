# Food Ordering Website

A full-stack food ordering website built with Spring Boot and React.js.

## Features

- User authentication (signup, login)
- Browse restaurants
- View restaurant details and menu
- Add items to cart
- Checkout process
- Order tracking
- Order history

## Tech Stack

### Backend
- Java 11
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT Authentication

### Frontend
- React.js
- Material-UI
- React Router
- Axios

## Project Structure

```
.
├── backend/                  # Spring Boot backend
│   └── online-food-ordering/ # Main backend application
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/adi/
│       │   │   │   ├── config/       # Configuration classes
│       │   │   │   ├── controller/   # REST controllers
│       │   │   │   ├── dto/          # Data Transfer Objects
│       │   │   │   ├── model/        # Entity models
│       │   │   │   ├── repository/   # JPA repositories
│       │   │   │   └── service/      # Business logic
│       │   │   └── resources/        # Application properties
│       │   └── test/                 # Test classes
│       └── pom.xml                   # Maven dependencies
└── frontend/                 # React.js frontend
    └── food-ordering-app/    # Main frontend application
        ├── public/           # Static files
        ├── src/
        │   ├── components/   # Reusable components
        │   ├── pages/        # Page components
        │   ├── App.js        # Main application component
        │   └── index.js      # Entry point
        └── package.json      # NPM dependencies
```

## Getting Started

### Prerequisites
- Java 11 or higher
- Node.js and npm
- MySQL

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend/online-food-ordering
   ```
2. Configure the database connection in `src/main/resources/application.properties`
3. Run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   The backend will start on http://localhost:5454

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend/food-ordering-app
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   The frontend will start on http://localhost:3000

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Login a user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `GET /api/restaurants/search/{name}` - Search restaurants by name
- `POST /api/restaurants` - Create a new restaurant (for restaurant owners)

### Food Items
- `GET /api/foods/restaurant/{restaurantId}` - Get all food items for a restaurant
- `GET /api/foods/{id}` - Get food item by ID
- `GET /api/foods/search/{name}` - Search food items by name
- `POST /api/foods/restaurant/{restaurantId}` - Add a food item to a restaurant

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/{cartItemId}` - Update cart item quantity
- `DELETE /api/cart/{cartItemId}` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/` - Create a new order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/{orderId}` - Get order by ID
- `GET /api/orders/restaurant/{restaurantId}` - Get restaurant orders
- `POST /api/orders/{orderId}/status` - Update order status

## License
This project is licensed under the MIT License. 