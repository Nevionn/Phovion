/// <reference types="typescript" />

// Расширение интерфейса Window
interface Window {
  showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
}

// Определение типов для File System Access API
interface FileSystemDirectoryHandle {
  getDirectoryHandle(
    name: string,
    options?: { create?: boolean }
  ): Promise<FileSystemDirectoryHandle>;
  getFileHandle(
    name: string,
    options?: { create?: boolean }
  ): Promise<FileSystemFileHandle>;
  [key: string]: any; // Для совместимости с динамическими свойствами
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}
