import { waitForDatabase } from './infrastructure/database/connection';
import { runMigrations } from './infrastructure/database/migrate';
import { checkAndSeed } from './infrastructure/database/seed';
import { createApp } from './presentation/app';
import { config } from './config/env';

// Urutan startup: tunggu DB -> migrasi -> seed -> mulai server
await waitForDatabase();
await runMigrations();
await checkAndSeed();

const app = createApp();
app.listen(config.port);

console.log(`Server berjalan di http://localhost:${config.port}`);
