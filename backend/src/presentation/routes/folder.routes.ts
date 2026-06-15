import Elysia, { t } from 'elysia';
import type { FolderService } from '../../application/services/folder.service';
import {
  createFolderBodySchema,
  createFolderResponseSchema,
  errorSchema,
  folderContentsResponseSchema,
  folderIdParamsSchema,
  listFoldersResponseSchema,
} from '../schemas';

// Route untuk operasi folder - prefix /api/v1/folders
export const folderRoutes = (folderService: FolderService) =>
  new Elysia({ prefix: '/api/v1/folders' })
    // GET /api/v1/folders - ambil semua folder (flat list untuk build tree di frontend)
    .get(
      '/',
      async () => {
        const data = await folderService.getAllFolders();
        return { success: true, data };
      },
      {
        detail: {
          tags: ['Folders'],
          summary: 'List semua folder',
          description: 'Mengambil semua folder untuk membangun tree di frontend.',
        },
        response: t.Union([listFoldersResponseSchema, errorSchema]),
      },
    )

    // GET /api/v1/folders/:id/contents - ambil subfolder + file langsung
    .get(
      '/:id/contents',
      async ({ params, error }) => {
        const id = Number(params.id);
        if (!Number.isInteger(id) || id <= 0) {
          return error(400, { success: false, message: 'ID folder tidak valid' });
        }

        const data = await folderService.getFolderContents(id);
        if (!data) {
          return error(404, { success: false, message: 'Folder tidak ditemukan' });
        }

        return { success: true, data };
      },
      {
        params: folderIdParamsSchema,
        detail: {
          tags: ['Folders'],
          summary: 'Ambil isi folder',
          description: 'Mengambil detail folder, subfolder langsung, dan file di dalamnya.',
        },
        response: t.Union([folderContentsResponseSchema, errorSchema]),
      },
    )

    // POST /api/v1/folders - buat folder baru
    .post(
      '/',
      async ({ body, error }) => {
        const { name, parentId } = body;
        
        if (parentId !== null && parentId !== undefined && (!Number.isInteger(parentId) || parentId <= 0)) {
          return error(400, { success: false, message: 'ID parent folder tidak valid' });
        }

        try {
          const data = await folderService.createFolder(name, parentId ?? null);
          return { success: true, data };
        } catch (e) {
          return error(400, { success: false, message: (e as Error).message });
        }
      },
      {
        body: createFolderBodySchema,
        detail: {
          tags: ['Folders'],
          summary: 'Buat folder baru',
          description: 'Membuat folder baru dengan nama wajib dan parent folder opsional.',
        },
        response: t.Union([createFolderResponseSchema, errorSchema]),
      },
    );
