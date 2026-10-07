import { Directory, File, Paths } from 'expo-file-system';

import type { FileStorageContract } from './types';

export type * from './types';

export class FileStorage implements FileStorageContract {
  private readonly directory: Directory;

  constructor(folderName: string, base: Directory = Paths.document) {
    this.directory = new Directory(base, folderName);
  }

  list(): string[] {
    if (!this.directory.exists) return [];
    return this.directory
      .list()
      .filter((entry): entry is File => entry instanceof File)
      .map((file) => file.name);
  }

  uri(fileName: string): string {
    return new File(this.directory, fileName).uri;
  }

  async moveIn(sourceUri: string, fileName: string): Promise<string> {
    if (!this.directory.exists) this.directory.create({ intermediates: true, idempotent: true });
    await new File(sourceUri).move(new File(this.directory, fileName), { overwrite: true });
    return fileName;
  }

  remove(fileName: string): void {
    const file = new File(this.directory, fileName);
    try {
      if (file.exists) file.delete();
    } catch (error) {
      console.warn('Failed to delete file', file.uri, error);
    }
  }
}
