
# ==========================================
# COUAXIA — DOCKERFILE OPTIMISÉ
# ==========================================

# ÉTAPE 1 — BUILD
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --no-fund

COPY . .

# Variables publiques du frontend
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ==========================================
# ÉTAPE 2 — FRONTEND NGINX
# ==========================================
FROM nginx:alpine AS frontend

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vérification du frontend
HEALTHCHECK --interval=30s --timeout=5s \
    --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/nginx-health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ==========================================
# ÉTAPE 3 — BACKEND NODE.JS
# ==========================================
FROM node:22-alpine AS backend

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

COPY package*.json ./

RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/dist ./dist

# Exécuter le serveur sans privilèges root
USER node

# Vérification du backend avec Node.js
HEALTHCHECK --interval=30s --timeout=5s \
    --start-period=15s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:10000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

EXPOSE 10000

CMD ["node", "dist-server/server.js"]
