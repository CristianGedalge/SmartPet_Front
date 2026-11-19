# =============================================================================
# Etapa 1: Compilación de React + Vite (Builder)
# =============================================================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Variables de entorno en tiempo de compilación para Vite
ARG VITE_API_URL=http://localhost:3000/api/v1
ARG VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/liberty
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_MAP_STYLE_URL=${VITE_MAP_STYLE_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# =============================================================================
# Etapa 2: Servidor Web Nginx para Producción (SPA)
# =============================================================================
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
