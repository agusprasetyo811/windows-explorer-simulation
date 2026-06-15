import { t } from 'elysia';

export const folderIdParamsSchema = t.Object(
  {
    id: t.String({ pattern: '^[0-9]+$', description: 'ID folder dalam bentuk string angka' }),
  },
  { description: 'Parameter ID folder' },
);

export const fileIdParamsSchema = t.Object(
  {
    id: t.String({ pattern: '^[0-9]+$', description: 'ID file dalam bentuk string angka' }),
  },
  { description: 'Parameter ID file' },
);

export const searchQuerySchema = t.Object(
  {
    q: t.Optional(t.String({ description: 'Kata kunci pencarian' })),
  },
  { description: 'Query pencarian' },
);

export const createFolderBodySchema = t.Object(
  {
    name: t.String({ minLength: 1, description: 'Nama folder baru' }),
    parentId: t.Optional(t.Union([t.Number({ minimum: 1, description: 'ID parent folder' }), t.Null()])),
  },
  { description: 'Body untuk membuat folder baru' },
);

export const folderSchema = t.Object(
  {
    id: t.Integer({ minimum: 1, description: 'ID folder' }),
    name: t.String({ minLength: 1, description: 'Nama folder' }),
    parentId: t.Nullable(t.Integer({ minimum: 1, description: 'ID parent folder' })),
    path: t.String({ description: 'Materialized path folder' }),
    createdAt: t.Date({ description: 'Waktu folder dibuat' }),
  },
  { description: 'Data folder' },
);

export const fileSchema = t.Object(
  {
    id: t.Integer({ minimum: 1, description: 'ID file' }),
    name: t.String({ minLength: 1, description: 'Nama file' }),
    folderId: t.Integer({ minimum: 1, description: 'ID folder pemilik file' }),
    size: t.Integer({ minimum: 0, description: 'Ukuran file dalam byte' }),
    mimeType: t.String({ description: 'Tipe MIME file' }),
    createdAt: t.Date({ description: 'Waktu file dibuat' }),
  },
  { description: 'Data file' },
);

export const errorSchema = t.Object(
  {
    success: t.Literal(false),
    message: t.String({ description: 'Pesan error' }),
  },
  { description: 'Response error' },
);

export const healthResponseSchema = t.Object(
  {
    status: t.String({ description: 'Status aplikasi' }),
  },
  { description: 'Response health check' },
);

export const listFoldersResponseSchema = t.Object(
  {
    success: t.Literal(true),
    data: t.Array(folderSchema),
  },
  { description: 'Response daftar folder' },
);

export const folderContentsResponseSchema = t.Object(
  {
    success: t.Literal(true),
    data: t.Object({
      folder: folderSchema,
      folders: t.Array(folderSchema),
      files: t.Array(fileSchema),
    }),
  },
  { description: 'Response isi folder' },
);

export const createFolderResponseSchema = t.Object(
  {
    success: t.Literal(true),
    data: folderSchema,
  },
  { description: 'Response folder yang dibuat' },
);

export const searchResponseSchema = t.Object(
  {
    success: t.Literal(true),
    data: t.Object({
      folders: t.Array(folderSchema),
      files: t.Array(fileSchema),
    }),
    meta: t.Object({
      query: t.String({ description: 'Kata kunci pencarian' }),
      total: t.Integer({ minimum: 0, description: 'Total hasil pencarian' }),
    }),
  },
  { description: 'Response pencarian folder dan file' },
);

export const previewFileResponseSchema = t.Object(
  {
    success: t.Literal(true),
    data: t.Object({
      id: t.Integer({ minimum: 1, description: 'ID file' }),
      content: t.String({ description: 'Konten preview file' }),
    }),
  },
  { description: 'Response preview file' },
);
