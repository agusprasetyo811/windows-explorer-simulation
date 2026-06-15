// Entitas file - merepresentasikan file di dalam folder
export interface File {
  id: number;
  name: string;
  folderId: number;
  size: number;
  mimeType: string;
  createdAt: Date;
}
