import { pgTable, serial, varchar, integer, bigint, text, timestamp, index } from 'drizzle-orm/pg-core';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabel folder - mendukung nested tak terbatas via parent_id + path materialized
export const folders = pgTable(
  'folders',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    // Self-referential FK - pakai lambda untuk hindari circular ref
    parentId: integer('parent_id').references((): AnyPgColumn => folders.id, {
      onDelete: 'cascade',
    }),
    // Materialized path: "/1/5/12/" - efisien untuk query ancestor/descendant
    path: text('path').notNull().default('/'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('folders_parent_id_idx').on(t.parentId),
    index('folders_path_idx').on(t.path),
    index('folders_name_idx').on(t.name),
  ],
);

export const files = pgTable(
  'files',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    folderId: integer('folder_id')
      .notNull()
      .references(() => folders.id, { onDelete: 'cascade' }),
    size: bigint('size', { mode: 'number' }).default(0),
    mimeType: varchar('mime_type', { length: 100 }).default('application/octet-stream'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('files_folder_id_idx').on(t.folderId),
    index('files_name_idx').on(t.name),
  ],
);

// Relasi untuk Drizzle query builder
export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'folder_children',
  }),
  children: many(folders, { relationName: 'folder_children' }),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));
