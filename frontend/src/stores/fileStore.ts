import { create } from 'zustand';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadProgress?: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  context: string;
  error?: string;
}

interface FileStore {
  files: FileItem[];
  isUploading: boolean;
  
  // Actions
  addFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  removeAllFiles: () => void;
  updateFileStatus: (id: string, status: FileItem['status'], error?: string) => void;
  updateUploadProgress: (id: string, progress: number) => void;
  setUploading: (isUploading: boolean) => void;
  setContext: (id: string, contextText: string) => void;
  
  // Computed
  getFileById: (id: string) => FileItem | undefined;
  getFilesByStatus: (status: FileItem['status']) => FileItem[];
  getTotalSize: () => number;
  getFileCount: () => number;
  reset: () => void
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  isUploading: false,

  addFile: (file: File) => {
    const fileItem: FileItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      context: '',
    };

    set((state) => ({
      files: [...state.files, fileItem],
    }));
  },

  addFiles: (files: File[]) => {
    const fileItems: FileItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      context: '',
    }));

    set((state) => ({
      files: [...state.files, ...fileItems],
    }));
  },

  removeFile: (id: string) => {
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    }));
  },

  removeAllFiles: () => {
    set({ files: [] });
  },

  updateFileStatus: (id: string, status: FileItem['status'], error?: string) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, status, error } : file
      ),
    }));
  },

  updateUploadProgress: (id: string, progress: number) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploadProgress: progress } : file
      ),
    }));
  },

  setUploading: (isUploading: boolean) => {
    set({ isUploading });
  },

  setContext: (id: string, contextText: string) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, context: contextText } : file
      ),
    }));
  },

  // Computed getters
  getFileById: (id: string) => {
    return get().files.find((file) => file.id === id);
  },

  getFilesByStatus: (status: FileItem['status']) => {
    return get().files.filter((file) => file.status === status);
  },

  getTotalSize: () => {
    return get().files.reduce((total, file) => total + file.size, 0);
  },

  getFileCount: () => {
    return get().files.length;
  },

  reset: () => {
    set({
      files: [],
      isUploading: false,
    });
  },
})); 