# Railway Deployment Guide

## Prerequisites
1. A Railway account (https://railway.app/)
2. Git installed on your local machine
3. Railway CLI installed (optional)

## Deployment Steps

1. **Prepare Your Application**
   - Ensure your application is using environment variables for configuration
   - Make sure your `application.properties` or `application.yml` is configured to use environment variables
   - The application should be configured to use the `PORT` environment variable provided by Railway

2. **Deploy to Railway**
   - Go to Railway Dashboard (https://railway.app/dashboard)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect it's a Java application

3. **Configure Environment Variables**
   Add the following environment variables in Railway:
   ```
   SPRING_DATASOURCE_URL=your_database_url
   SPRING_DATASOURCE_USERNAME=your_database_username
   SPRING_DATASOURCE_PASSWORD=your_database_password
   JWT_SECRET=your_jwt_secret
   ```

4. **Build and Deploy**
   - Railway will automatically build and deploy your application
   - You can monitor the build process in the Railway dashboard
   - Once deployed, Railway will provide you with a URL for your application

5. **Verify Deployment**
   - Check the logs in Railway dashboard for any errors
   - Test your API endpoints using the provided Railway URL
   - Update your frontend application with the new backend URL

## Important Notes
- Railway will automatically detect the Java version from your `pom.xml`
- The application will be built using Maven
- Make sure your `pom.xml` has the correct Java version and dependencies
- Railway provides automatic HTTPS
- You can set up custom domains in the Railway dashboard

## Troubleshooting
1. If the build fails:
   - Check the build logs in Railway dashboard
   - Verify your `pom.xml` configuration
   - Ensure all dependencies are correctly specified

2. If the application fails to start:
   - Check the application logs
   - Verify environment variables are correctly set
   - Ensure the database connection is working

3. If you need to restart the application:
   - Go to Railway dashboard
   - Select your project
   - Click "Restart" button

## Support
For more help, refer to:
- Railway Documentation: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway 