# Step-by-Step Deployment Guide

This guide will walk you through deploying the backend service and connecting it to the already deployed frontend at https://foodorderingsiteadi.netlify.app/.

## Deploying the Backend on Render.com (Recommended)

### 1. Prepare Your Repository

Ensure the following files are in your repository:
- Dockerfile (in the backend/online-food-ordering directory)
- render.yaml (in the project root)
- Updated CORS configuration with the Netlify URL

### 2. Create a Render Account

1. Sign up at [Render.com](https://render.com) if you haven't already.
2. Verify your email and set up your account.

### 3. Deploy the Backend

1. From the Render dashboard, click "New" and select "Blueprint".
2. Connect your GitHub repository.
3. Render will detect the render.yaml configuration.
4. Review the services and databases that will be created.
5. Click "Apply Blueprint".
6. Render will create and deploy your services automatically.

### 4. Verify the Deployment

1. Once the deployment is complete, you'll get a URL like https://adikrafoods-api.onrender.com.
2. Test the API by visiting https://adikrafoods-api.onrender.com/api/restaurants (or another public endpoint).
3. If you see data or a valid response, your backend is working correctly.

## Connecting to the Frontend

Your frontend is already configured to use https://adikrafoods-api.onrender.com as the backend API URL in the .env.production file. If you've deployed the backend to a different URL:

1. Update the frontend configuration:
   ```
   REACT_APP_API_URL=https://your-new-backend-url
   REACT_APP_ENV=production
   ```

2. Redeploy your frontend on Netlify:
   - Push changes to your GitHub repository, or
   - Trigger a new deploy from the Netlify dashboard

## Alternative Deployment Options

### Deploy with Docker on a VPS

If you prefer to use your own server:

1. Get a VPS from DigitalOcean, AWS, Google Cloud, etc.
2. Install Docker and Docker Compose:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   apt install docker-compose
   ```

3. Upload your code to the server:
   ```bash
   git clone <your-repo-url>
   cd <repo-directory>/backend/online-food-ordering
   ```

4. Start the services:
   ```bash
   docker-compose up -d
   ```

5. Set up Nginx as a reverse proxy (optional but recommended):
   ```bash
   apt install nginx
   ```

6. Configure Nginx (/etc/nginx/sites-available/default):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5454;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. Restart Nginx:
   ```bash
   systemctl restart nginx
   ```

8. Update your frontend to use your new backend URL.

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Verify that your backend's CORS configuration includes your frontend URL:
   ```java
   cfg.setAllowedOrigins(Arrays.asList(
       "https://foodorderingsiteadi.netlify.app",
       // other origins
   ));
   ```

2. Ensure your backend is properly handling OPTIONS requests.

### Database Connection Issues

If your backend can't connect to the database:

1. Check the environment variables are set correctly.
2. Verify database credentials.
3. Check if the database server is accessible from your backend service.

### JWT Authentication Issues

If users can't log in:

1. Check JWT token configuration.
2. Verify that the frontend is correctly storing and sending the JWT token in requests.

## Need More Help?

If you encounter any issues during deployment, please:

1. Check the logs of your backend service.
2. Review the CORS configuration.
3. Ensure all environment variables are set correctly.
4. Test the API endpoints directly using tools like Postman or curl.