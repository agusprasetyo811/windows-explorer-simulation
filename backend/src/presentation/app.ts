import Elysia from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { DrizzleFolderRepository } from '../infrastructure/repositories/folder.drizzle.repository';
import { DrizzleFileRepository } from '../infrastructure/repositories/file.drizzle.repository';
import { FolderService } from '../application/services/folder.service';
import { folderRoutes } from './routes/folder.routes';
import { searchRoutes } from './routes/search.routes';
import { fileRoutes } from './routes/file.routes';
import { config } from '../config/env';
import { healthResponseSchema } from './schemas';

// Inisialisasi dependensi (dependency injection manual)
const folderRepo = new DrizzleFolderRepository();
const fileRepo = new DrizzleFileRepository();
const folderService = new FolderService(folderRepo, fileRepo);

// Buat instance Elysia dengan semua plugin dan route
export function createApp() {
  return new Elysia()
    .use(
      swagger({
        provider: 'swagger-ui',
        path: '/swagger',
        specPath: '/swagger/json',
        exclude: ['/swagger', '/swagger/json'],
        documentation: {
          openapi: '3.0.3',
          info: {
            title: 'Windows Explorer API',
            version: '1.0.0',
            description: 'Dokumentasi API backend Windows Explorer.',
          },
          servers: [
            {
              url: `http://localhost:${config.port}`,
              description: 'Development server',
            },
          ],
          tags: [
            { name: 'System', description: 'Endpoint sistem dan health check' },
            { name: 'Folders', description: 'Manajemen folder' },
            { name: 'Files', description: 'Preview file' },
            { name: 'Search', description: 'Pencarian folder dan file' },
          ],
        },
        swaggerOptions: {
          docExpansion: 'list',
        },
      }),
    )
    .use(
      cors({
        origin: true,
        methods: ['GET', 'POST', 'OPTIONS'],
      }),
    )
    // Health check
    .get(
      '/health',
      () => ({ status: 'ok' }),
      {
        detail: {
          tags: ['System'],
          summary: 'Health check API',
          description: 'Memastikan backend API berjalan normal.',
        },
        response: healthResponseSchema,
      },
    )
    // Route utama
    .use(folderRoutes(folderService))
    .use(searchRoutes(folderService))
    .use(fileRoutes(folderService))
    // Handler error global
    .onError(({ code, error, set }) => {
      if (code === 'NOT_FOUND') {
        set.status = 404;
        return { success: false, message: 'Endpoint tidak ditemukan' };
      }
      if (code === 'VALIDATION' || (error && (error as any).status === 400)) {
        set.status = 400;
        return { success: false, message: error.message || 'Input tidak valid' };
      }
      set.status = 500;
      console.error('Error tidak terduga:', error);
      return { success: false, message: 'Terjadi kesalahan server' };
    });
}