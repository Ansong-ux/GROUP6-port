# Stage 1: Build the Spring Boot application
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the backend directory contents
# Copy pom.xml first to download dependencies if it changes.
COPY backend/pom.xml .
COPY backend/src ./src

# Build the Spring Boot application.
# The 'package' goal will compile the code, run tests (if any), and create the JAR.
RUN mvn clean package -DskipTests

# Stage 2: Create the final lean image
# Use a smaller JRE image for production deployment
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/ug-student-portal-1.0.0.jar ug-student-portal.jar

# Expose the port your Spring Boot application runs on (default is 8080)
EXPOSE 8080

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "ug-student-portal.jar"]
