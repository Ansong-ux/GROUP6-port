# Use a Maven image with OpenJDK 21
FROM maven:3.9.8-openjdk-21

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies to leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY src ./src

# Build the application
RUN mvn clean install
