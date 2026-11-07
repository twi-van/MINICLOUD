FROM node:24-alpine AS build
WORKDIR /app
RUN npm install --global pnpm@12.6.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_DATA_SOURCE=api
ARG VITE_API_BASE_URL=/api
ARG VITE_AUTH_MODE=auto
ARG VITE_KEYCLOAK_URL=http://localhost/auth
ARG VITE_KEYCLOAK_REALM=realm_52400211
ARG VITE_KEYCLOAK_CLIENT_ID=web-frontend
ENV VITE_DATA_SOURCE=$VITE_DATA_SOURCE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AUTH_MODE=$VITE_AUTH_MODE
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
RUN pnpm build

FROM nginx:1.28-alpine
ENV BACKEND_UPSTREAM=application-backend-server-1:8081
ENV AUTH_UPSTREAM=authentication-identity-server:8080
ENV MINIO_UPSTREAM=object-storage-server:9000
ENV WEB_INSTANCE=web-frontend-server-1
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
RUN sed -i 's/\r$//' /usr/share/nginx/html/metrics.txt
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
