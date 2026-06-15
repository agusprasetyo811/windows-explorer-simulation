import Elysia, { t } from 'elysia';
import type { FolderService } from '../../application/services/folder.service';
import { errorSchema, fileIdParamsSchema, previewFileResponseSchema } from '../schemas';

// Route file - prefix /api/v1/files
export const fileRoutes = (folderService: FolderService) =>
  new Elysia({ prefix: '/api/v1/files' })
    // GET /api/v1/files/:id/preview - preview file (simulasi)
    .get(
      '/:id/preview',
      async ({ params, error }) => {
        const id = Number(params.id);
        if (!Number.isInteger(id) || id <= 0) {
          return error(400, { success: false, message: 'ID file tidak valid' });
        }

        // Simulasi: generate preview content
        const content = `// File ID: ${id}
// Type: text/plain
// Size: 1 KB
// 
// This is a simulated file preview.
// In a real implementation, this would read the actual file content.`;

        return { success: true, data: { id, content } };
      },
      {
        params: fileIdParamsSchema,
        detail: {
          tags: ['Files'],
          summary: 'Preview file',
          description: 'Mengambil preview teks simulasi untuk file.',
        },
        response: t.Union([previewFileResponseSchema, errorSchema]),
      },
    );