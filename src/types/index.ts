// Extend Window interface for File System Access API
declare global {
  interface Window {
    showOpenFilePicker: (options?: {
      types?: Array<{
        description?: string;
        accept: Record<string, string[]>;
      }>;
      multiple?: boolean;
      excludeAcceptAllOption?: boolean;
    }) => Promise<FileSystemFileHandle[]>;
  }
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Prompt {
  id: string;
  title: string;
  text: string;
  folderId: string;
  order: number;
  fileData: string | null;
  fileName: string | null;
  fileType: string | null;
}

export interface AppData {
  folders: Folder[];
  prompts: Prompt[];
}

export interface StorageData {
  data: AppData;
  viewMode: 'grid' | 'list';
  expandedFolderIds: string[];
}

export type ViewMode = 'grid' | 'list';
