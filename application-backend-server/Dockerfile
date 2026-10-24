# ===== Giai đoạn 1: BUILD =====
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ===== Giai đoạn 2: CHẠY =====
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8081
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY students.json ./students.json
EXPOSE 8081
CMD ["node", "dist/main.js"]