FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

RUN useradd -u 10001 -m appuser

COPY --from=build /app/target/*.jar app.jar

RUN chown -R 10001:10001 /app

USER 10001

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]