# ==============================================================================
# AI Mail Manager — Multi-stage Dockerfile
# ==============================================================================
# Stage 1: Build the React/Vite frontend
# Stage 2: Build the Spring Boot backend JAR (with frontend embedded)
# Stage 3: Slim JRE runtime image
#
# The frontend is built and copied into the backend s static resources so that
# Spring Boot serves both the API and the SPA from a single port (8080).
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1 — Frontend Builder (Node 22 Alpine)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies first (leverages Docker layer caching)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY frontend/ ./
RUN npm run build

# Output is in /app/frontend/dist

# ------------------------------------------------------------------------------
# Stage 2 — Backend Builder (Maven + JDK 21)
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-alpine AS backend-builder

WORKDIR /app/backend

# Copy POM first (layer cache for deps)
COPY backend/pom.xml ./

# Install Maven
RUN apk add --no-cache maven

# Download dependencies (only re-runs when pom.xml changes)
RUN mvn dependency:go-offline -B --no-transfer-progress

# Copy backend source
COPY backend/src ./src

# Copy built frontend dist into Spring Boot static resources folder
# Spring Boot automatically serves files from classpath:/static/
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static/

# Build the JAR (skip tests)
RUN mvn package -B --no-transfer-progress -DskipTests

# ------------------------------------------------------------------------------
# Stage 3 — Runtime (Slim JRE 21)
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime

# Install curl for health-check probe
RUN apk add --no-cache curl

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Copy the fat JAR from the builder stage
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Expose the port Spring Boot listens on
EXPOSE 8080

# JVM tuning for container environments
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
