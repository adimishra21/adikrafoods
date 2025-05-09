# Deployment Guide for Online Food Ordering Backend

This guide provides instructions for deploying the backend service to work with your Netlify frontend at https://foodorderingsiteadi.netlify.app/

## Option 1: Deploy with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Basic knowledge of Docker
- A server/VPS (e.g., AWS EC2, DigitalOcean Droplet, Google Cloud VM)

### Deployment Steps

1. Clone the repository to your server:
   ```bash
   git clone <your-repo-url>
   cd online-food-ordering
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. The application will be running at `http://your-server-ip:5454`

## Option 2: Deploy to Render (Currently in Use)

Your application is already set up for Render deployment with the render.yaml file in the project root.

1. Sign up at [Render.com](https://render.com) (if you haven't already)
2. Create a new Web Service and connect your GitHub repository
3. Render will automatically detect the render.yaml configuration
4. Add the environment variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DATABASE_URL` (if using an external database)
   - `DATABASE_USERNAME` (if using an external database)
   - `DATABASE_PASSWORD` (if using an external database)
5. Deploy your application

The application will be accessible at https://adikrafoods-api.onrender.com

## Option 3: Deploy to Railway.app

Railway is a platform that makes it easy to deploy Spring Boot applications.

1. Sign up at [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add a MySQL database from the Railway dashboard
4. Configure the environment variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DATABASE_URL` (automatically set by Railway MySQL)
   - `DATABASE_USERNAME` (automatically set by Railway MySQL)
   - `DATABASE_PASSWORD` (automatically set by Railway MySQL)
5. Deploy your application

## Option 4: Traditional VPS Deployment

1. Set up a VPS with Java 21 installed
2. Install MySQL on the server
3. Create the database:
   ```sql
   CREATE DATABASE kra_foods;
   ```
4. Upload your JAR file to the server
5. Run the application:
   ```bash
   java -jar -Dspring.profiles.active=prod \
   -DDATABASE_URL=jdbc:mysql://localhost:3306/kra_foods \
   -DDATABASE_USERNAME=root \
   -DDATABASE_PASSWORD=yourpassword \
   online-food-ordering-0.0.1-SNAPSHOT.jar
   ```
6. Set up a systemd service for automatic startup (optional)

## Frontend Integration

Your frontend is already deployed at https://foodorderingsiteadi.netlify.app/ and is configured to connect to the backend at https://adikrafoods-api.onrender.com.

If you need to change the backend URL for the frontend:

1. Update the `.env.production` file in your frontend project:
   ```
   REACT_APP_API_URL=https://your-new-backend-url
   REACT_APP_ENV=production
   ```

2. Redeploy your frontend to Netlify

## Troubleshooting

1. **CORS Issues**: We've already added the Netlify URL to the CORS configuration:
   ```java
   cfg.setAllowedOrigins(Arrays.asList(
       "http://adi-food.vercel.app",
       "http://localhost:3000",
       "http://localhost:5173",
       "https://foodorderingsiteadi.netlify.app"
   ));
   ```
   
   If you encounter CORS issues, ensure that this configuration is present and that your backend is properly deployed.

2. **Database Connection Issues**: Verify that the database connection parameters are correct
3. **Application Not Starting**: Check the logs for errors:
   ```bash
   docker-compose logs -f app
   ```

## SSL Configuration (Already configured on Render)

If you're using Render.com, SSL is already configured for your application. If you're using a different hosting provider, you may need to set up SSL:

1. Get a domain name for your backend
2. Set up Nginx as a reverse proxy with SSL:
   ```nginx
   server {
       listen 443 ssl;
       server_name your-api-domain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:5454;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
3. Update your frontend to use the HTTPS URL 