FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 5454

# Add wait-for-it script to check database availability
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5454/actuator/health || exit 1

# Wait for MySQL and then start the application
CMD ["/bin/sh", "-c", "/wait-for-it.sh $MYSQL_HOST:3306 -- java -jar app.jar"] 