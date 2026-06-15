# Windows Explorer

Project ini adalah aplikasi Windows Explorer berbasis web yang terdiri dari:

- **Backend**: Elysia + Bun + Drizzle ORM + PostgreSQL
- **Frontend**: Vue 3 + Vite
- **Database**: PostgreSQL 16

## Prasyarat

Pastikan sudah terinstall:

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) dan Docker Compose
- Node.js minimal v20 jika ingin menjalankan tanpa Docker

## Struktur Project

```txt
.
├── backend/        # API backend
├── frontend/       # UI Vue
├── docker-compose.yml
├── package.json
└── .env.example
```

## Instalasi Cepat dengan Docker

1. Clone atau buka project ini di terminal.

2. Salin file environment:

```bash
cp .env.example .env
```

3. Jalankan database, backend, dan frontend:

```bash
bun run docker:up
```

4. Akses aplikasi:

- Frontend: http://localhost:8080
- Backend health check: http://localhost:3000/health
- Swagger UI: http://localhost:3000/swagger
- OpenAPI JSON: http://localhost:3000/swagger/json
- API base URL: `http://localhost:3000/api/v1`

5. Hentikan aplikasi:

```bash
bun run docker:down
```

6. Reset database dan container:

```bash
bun run docker:reset
```

## Instalasi Manual

### 1. Jalankan Database

Pastikan PostgreSQL tersedia. Untuk development lokal, gunakan Docker Compose hanya untuk database:

```bash
docker compose up db
```

Atau jalankan PostgreSQL lain dengan kredensial sesuai `.env`.

### 2. Setup Environment

Salin file environment:

```bash
cp .env.example .env
```

Sesuaikan nilai berikut jika diperlukan:

```env
DB_NAME=explorer_db
DB_USER=explorer_user
DB_PASSWORD=explorer_pass
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://explorer_user:explorer_pass@localhost:5432/explorer_db
```

### 3. Install Dependensi

Install semua dependensi root, backend, dan frontend:

```bash
bun install
```

Jika gagal karena workspace, install masing-masing folder:

```bash
cd backend && bun install
cd ../frontend && bun install
```

### 4. Generate dan Jalankan Migrasi Database

```bash
cd backend
bun run db:generate
bun run db:push
```

### 5. Jalankan Backend

```bash
bun run dev:backend
```

Backend akan berjalan di:

```txt
http://localhost:3000
```

Endpoint health check:

```txt
http://localhost:3000/health
```

Swagger UI:

```txt
http://localhost:3000/swagger
```

OpenAPI JSON:

```txt
http://localhost:3000/swagger/json
```

### 6. Jalankan Frontend

Buka terminal baru, lalu jalankan:

```bash
bun run dev:frontend
```

Frontend akan berjalan di:

```txt
http://localhost:5173
```

Vite akan mem-proxy request `/api` ke backend di `http://localhost:3000`.

## Perintah Tersedia

Dari root project:

```bash
bun run dev:backend      # Menjalankan backend development
bun run dev:frontend     # Menjalankan frontend development
bun run docker:up        # Menjalankan semua service via Docker Compose
bun run docker:down      # Menghentikan Docker Compose
bun run docker:reset     # Reset database dan jalankan ulang Docker Compose
```

Dari folder `backend`:

```bash
bun run dev              # Development backend
bun run start            # Start backend production
bun run test             # Jalankan backend tests
bun run db:generate      # Generate migrasi Drizzle
bun run db:push          # Push schema ke database
```

Dari folder `frontend`:

```bash
bun run dev              # Development frontend
bun run build            # Build frontend production
bun run preview          # Preview build frontend
bun run test             # Jalankan frontend tests
bun run test:ui          # Jalankan frontend tests dengan UI
```

## Swagger / OpenAPI

Backend menyediakan dokumentasi API otomatis menggunakan Swagger UI:

- Swagger UI: http://localhost:3000/swagger
- OpenAPI JSON: http://localhost:3000/swagger/json

Dokumentasi mencakup endpoint health check, folder, file, dan search dengan tag:

- `System`: health check API
- `Folders`: list folder, detail isi folder, dan create folder
- `Files`: preview file
- `Search`: pencarian folder dan file

## API Endpoint

Backend menyediakan endpoint berikut:

```txt
GET /health
GET /swagger
GET /swagger/json

GET  /api/v1/folders
GET  /api/v1/folders/:id/contents
POST /api/v1/folders

GET /api/v1/files/:id/preview

GET /api/v1/search?q=keyword
```

## Troubleshooting

### Port 5432 sudah digunakan

Ubah port database di `docker-compose.yml` atau hentikan service PostgreSQL lain yang sedang berjalan.

### Port 3000 sudah digunakan

Ubah `PORT` di `.env` dan sesuaikan proxy backend di `frontend/vite.config.ts`.

### Port 5173 sudah digunakan

Ubah `server.port` di `frontend/vite.config.ts`.

### Database belum ada tabel

Jalankan migrasi backend:

```bash
cd backend
bun run db:generate
bun run db:push
```

### Frontend gagal request ke backend

Pastikan backend sudah berjalan di `http://localhost:3000` dan endpoint `/health` bisa diakses.
