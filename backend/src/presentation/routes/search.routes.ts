import Elysia, { t } from 'elysia';
import type { FolderService } from '../../application/services/folder.service';
import { errorSchema, searchQuerySchema, searchResponseSchema } from '../schemas';

// Route pencarian - prefix /api/v1/search
export const searchRoutes = (folderService: FolderService) =>
  new Elysia({ prefix: '/api/v1' })
    // GET /api/v1/search?q=kata - cari folder dan file
    .get(
      '/search',
      async ({ query }) => {
        const q = query.q?.trim() ?? '';

        if (q.length < 1) {
          return {
            success: true,
            data: { folders: [], files: [] },
            meta: { query: q, total: 0 },
          };
        }

        const data = await folderService.search(q);
        const total = data.folders.length + data.files.length;

        return { success: true, data, meta: { query: q, total } };
      },
      {
        query: searchQuerySchema,
        detail: {
          tags: ['Search'],
          summary: 'Cari folder dan file',
          description: 'Mencari folder dan file berdasarkan kata kunci.',
        },
        response: t.Union([searchResponseSchema, errorSchema]),
      },
    );
