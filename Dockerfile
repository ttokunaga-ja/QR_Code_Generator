# syntax=docker/dockerfile:1

###
# Frontend build stage
###
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Allow callers to override registry / retry settings / proxies at build time
ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG NPM_FETCH_RETRIES=5
ARG NPM_FETCH_RETRY_MAXTIMEOUT=120000
ARG NPM_FETCH_TIMEOUT=60000
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}
ENV NPM_CONFIG_FETCH_RETRIES=${NPM_FETCH_RETRIES}
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=${NPM_FETCH_RETRY_MAXTIMEOUT}
ENV NPM_CONFIG_FETCH_TIMEOUT=${NPM_FETCH_TIMEOUT}
ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY src ./src
COPY index.html vite.config.ts ./
RUN npm run build

###
# Go server build stage
###
FROM golang:1.22-alpine AS server-builder
WORKDIR /app

COPY go.mod ./
COPY server ./server
RUN go build -o /bin/server ./server

###
# Final runtime image
###
FROM alpine:3.20
WORKDIR /app

ENV PORT=8080
ENV STATIC_DIR=/app/build

COPY --from=frontend-builder /app/build ./build
COPY --from=server-builder /bin/server ./server

EXPOSE 8080
ENTRYPOINT ["./server"]
