// Konfigurasi env - validasi saat startup
export const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/explorer_db',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;
