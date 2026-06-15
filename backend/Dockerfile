# Tahap build: install dependensi
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Tahap runtime
FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
