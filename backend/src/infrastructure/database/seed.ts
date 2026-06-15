import { eq, count } from 'drizzle-orm';
import { db } from './connection';
import { folders, files } from './schema';

// Struktur data seed - [nama, anak[], file[]]
type SeedFile = { name: string; size: number; mimeType: string };
type SeedNode = { name: string; children?: SeedNode[]; files?: SeedFile[] };

const SEED_DATA: SeedNode[] = [
  {
    name: 'Documents',
    children: [
      {
        name: 'Work',
        children: [
          {
            name: 'Projects',
            children: [
              {
                name: 'Project Alpha',
                files: [
                  { name: 'README.md', size: 2048, mimeType: 'text/markdown' },
                  { name: 'proposal.docx', size: 524288, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
                  { name: 'timeline.xlsx', size: 204800, mimeType: 'application/vnd.ms-excel' },
                ],
              },
              {
                name: 'Project Beta',
                files: [
                  { name: 'requirements.txt', size: 1024, mimeType: 'text/plain' },
                  { name: 'architecture.pdf', size: 2097152, mimeType: 'application/pdf' },
                ],
              },
            ],
          },
          {
            name: 'Reports',
            children: [
              { name: 'Q1 2024', files: [{ name: 'Q1_report.pdf', size: 3145728, mimeType: 'application/pdf' }] },
              { name: 'Q2 2024', files: [{ name: 'Q2_report.pdf', size: 2097152, mimeType: 'application/pdf' }] },
              { name: 'Q3 2024', files: [{ name: 'Q3_report.pdf', size: 2621440, mimeType: 'application/pdf' }] },
              { name: 'Q4 2024', files: [{ name: 'Q4_report.pdf', size: 3670016, mimeType: 'application/pdf' }] },
            ],
          },
        ],
      },
      {
        name: 'Personal',
        children: [
          {
            name: 'Finance',
            files: [
              { name: 'budget_2024.xlsx', size: 204800, mimeType: 'application/vnd.ms-excel' },
              { name: 'tax_2023.pdf', size: 1048576, mimeType: 'application/pdf' },
            ],
          },
          {
            name: 'Health',
            files: [{ name: 'medical_records.pdf', size: 3145728, mimeType: 'application/pdf' }],
          },
          {
            name: 'Travel',
            files: [{ name: 'passport_scan.jpg', size: 512000, mimeType: 'image/jpeg' }],
          },
        ],
      },
      {
        name: 'Archive',
        children: [
          { name: '2022', files: [{ name: 'archive_2022.zip', size: 10485760, mimeType: 'application/zip' }] },
          { name: '2023', files: [{ name: 'archive_2023.zip', size: 15728640, mimeType: 'application/zip' }] },
        ],
      },
    ],
  },
  {
    name: 'Pictures',
    children: [
      {
        name: 'Vacation',
        children: [
          {
            name: 'Bali 2023',
            children: [
              {
                name: 'Day 1',
                files: [
                  { name: 'IMG_001.jpg', size: 3145728, mimeType: 'image/jpeg' },
                  { name: 'IMG_002.jpg', size: 2621440, mimeType: 'image/jpeg' },
                  { name: 'IMG_003.jpg', size: 3670016, mimeType: 'image/jpeg' },
                ],
              },
              {
                name: 'Day 2',
                files: [
                  { name: 'IMG_010.jpg', size: 2097152, mimeType: 'image/jpeg' },
                  { name: 'IMG_011.jpg', size: 3145728, mimeType: 'image/jpeg' },
                ],
              },
            ],
          },
          {
            name: 'Europe 2024',
            children: [
              {
                name: 'Paris',
                files: [
                  { name: 'eiffel_tower.jpg', size: 4194304, mimeType: 'image/jpeg' },
                  { name: 'louvre.jpg', size: 3670016, mimeType: 'image/jpeg' },
                ],
              },
              {
                name: 'Amsterdam',
                files: [{ name: 'canals.jpg', size: 2621440, mimeType: 'image/jpeg' }],
              },
            ],
          },
        ],
      },
      {
        name: 'Family',
        files: [
          { name: 'family_photo_2024.jpg', size: 5242880, mimeType: 'image/jpeg' },
          { name: 'birthday_2023.jpg', size: 3145728, mimeType: 'image/jpeg' },
        ],
      },
      {
        name: 'Screenshots',
        files: [
          { name: 'screenshot_001.png', size: 512000, mimeType: 'image/png' },
          { name: 'screenshot_002.png', size: 768000, mimeType: 'image/png' },
        ],
      },
    ],
  },
  {
    name: 'Videos',
    children: [
      {
        name: 'Movies',
        files: [{ name: 'movie_backup.mp4', size: 1073741824, mimeType: 'video/mp4' }],
      },
      {
        name: 'Tutorials',
        children: [
          {
            name: 'Programming',
            files: [
              { name: 'typescript_basics.mp4', size: 524288000, mimeType: 'video/mp4' },
              { name: 'vue3_course.mp4', size: 734003200, mimeType: 'video/mp4' },
            ],
          },
          {
            name: 'Design',
            files: [{ name: 'figma_intro.mp4', size: 209715200, mimeType: 'video/mp4' }],
          },
        ],
      },
      {
        name: 'Recordings',
        files: [{ name: 'meeting_2024_01.mp4', size: 104857600, mimeType: 'video/mp4' }],
      },
    ],
  },
  {
    name: 'Downloads',
    children: [
      {
        name: 'Software',
        files: [
          { name: 'vscode_installer.exe', size: 104857600, mimeType: 'application/octet-stream' },
          { name: 'chrome_installer.exe', size: 83886080, mimeType: 'application/octet-stream' },
        ],
      },
      {
        name: 'Documents',
        files: [
          { name: 'ebook_typescript.pdf', size: 5242880, mimeType: 'application/pdf' },
          { name: 'cheatsheet.pdf', size: 1048576, mimeType: 'application/pdf' },
        ],
      },
    ],
  },
  {
    name: 'Music',
    children: [
      {
        name: 'Pop',
        files: [
          { name: 'song_01.mp3', size: 5242880, mimeType: 'audio/mpeg' },
          { name: 'song_02.mp3', size: 4194304, mimeType: 'audio/mpeg' },
          { name: 'song_03.mp3', size: 6291456, mimeType: 'audio/mpeg' },
        ],
      },
      {
        name: 'Jazz',
        files: [
          { name: 'jazz_classics.mp3', size: 8388608, mimeType: 'audio/mpeg' },
          { name: 'smooth_jazz.mp3', size: 7340032, mimeType: 'audio/mpeg' },
        ],
      },
      {
        name: 'Rock',
        files: [{ name: 'rock_compilation.mp3', size: 10485760, mimeType: 'audio/mpeg' }],
      },
    ],
  },
  {
    name: 'System',
    children: [
      {
        name: 'Drivers',
        files: [
          { name: 'gpu_driver.exe', size: 524288000, mimeType: 'application/octet-stream' },
          { name: 'audio_driver.exe', size: 52428800, mimeType: 'application/octet-stream' },
        ],
      },
      {
        name: 'Logs',
        files: [
          { name: 'system.log', size: 2097152, mimeType: 'text/plain' },
          { name: 'error.log', size: 1048576, mimeType: 'text/plain' },
        ],
      },
      {
        name: 'Temp',
        files: [{ name: 'temp_cache.tmp', size: 4096, mimeType: 'application/octet-stream' }],
      },
    ],
  },
];

// Rekursif sisipkan node ke DB
async function insertNode(node: SeedNode, parentId: number | null, parentPath: string): Promise<void> {
  const [inserted] = await db
    .insert(folders)
    .values({ name: node.name, parentId, path: '/' })
    .returning();

  // Update path setelah dapat ID
  const path = `${parentPath}${inserted.id}/`;
  await db.update(folders).set({ path }).where(eq(folders.id, inserted.id));

  // Sisipkan file di folder ini
  if (node.files?.length) {
    await db.insert(files).values(
      node.files.map((f) => ({
        name: f.name,
        folderId: inserted.id,
        size: f.size,
        mimeType: f.mimeType,
      })),
    );
  }

  // Rekursif untuk subfolder
  if (node.children?.length) {
    for (const child of node.children) {
      await insertNode(child, inserted.id, path);
    }
  }
}

// Cek apakah data sudah ada, kalau belum isi data contoh
export async function checkAndSeed(): Promise<void> {
  const [result] = await db.select({ total: count() }).from(folders);
  if (result.total > 0) return;

  console.log('Mengisi data awal...');
  for (const root of SEED_DATA) {
    await insertNode(root, null, '/');
  }
  console.log('Data awal selesai diisi.');
}
