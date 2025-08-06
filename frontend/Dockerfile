# Build Phase
FROM node:latest AS builder

WORKDIR /app/
COPY . .

RUN npm i
ENV VITE_BACKENDURL=/api
RUN npm run build


# Actual Server
FROM nginx:latest

WORKDIR /usr/share/nginx/html/

RUN rm -rf ./*
COPY --from=builder /app/dist/ .

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx"]