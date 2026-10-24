# Multi-stage Dockerfile for Placera Backend (Java 21 Spring Boot)

# Stage 1: Build JAR with Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy POM and download dependencies to optimize caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal hardened runtime image
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Run as non-privileged system user for container security
RUN addgroup -S placera && adduser -S placera -G placera
USER placera:placera

# Copy built artifact
COPY --from=builder /build/target/*.jar app.jar

# Configure uploads volume mount
RUN mkdir -p /app/uploads/resumes

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q -O - http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
