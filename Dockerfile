
# Stage 1: Build Stage
FROM --platform=linux/aarch64 node:23-alpine AS build

WORKDIR /app 

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM nginx:1.27-alpine-slim

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
