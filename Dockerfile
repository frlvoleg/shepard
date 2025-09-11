# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# ВАЖЛИВО: копіюємо і package.json, і yarn.lock
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
# має бути скрипт "build" у package.json
RUN yarn build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
RUN yarn global add serve
# якщо твій білд у /build (CRA/trebble-scripts) — лишаємо так;
# якщо у /dist — заміни шлях нижче на /app/dist
COPY --from=build /app/build ./build

# Платформа зазвичай дає PORT — слухай його
ENV PORT=8080
EXPOSE 8080
CMD ["serve", "-s", "build", "-l", "8080"]