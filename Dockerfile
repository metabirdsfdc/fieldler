# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript → dist/
RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output
COPY --from=build /app/dist ./dist

# Environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start backend
CMD ["node", "dist/server.js"]
