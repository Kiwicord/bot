# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /app

# Paketdateien kopieren und installieren (Cache nutzt das optimal aus)
COPY package*.json ./
RUN npm install

# Restlichen Code kopieren
COPY . .

# TypeScript builden
RUN npm run build


# --- Production Stage ---
FROM node:18-alpine AS production

WORKDIR /app

# Nur production dependencies installieren
COPY package*.json ./
RUN npm install --only=production

# Build aus dem Builder übernehmen
COPY --from=builder /app/dist ./dist

# Optional: wenn du Commands o.ä. als JSON/Assets brauchst
# COPY --from=builder /app/commands ./commands

# ENV Variablen werden von außen übergeben (Docker / docker-compose)
CMD ["node", "dist/index.js"]
