FROM maven:3.8.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

# Install Nginx and Supervisor
RUN apk update && apk add --no-cache nginx supervisor

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar backend.jar

# Remove the default Nginx config if it exists
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy Nginx and Supervisor config
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create log directories
RUN mkdir -p /var/log/java /var/log/nginx

# Start Supervisor
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
