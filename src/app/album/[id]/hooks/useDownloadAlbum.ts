import { useCallback } from "react";
import { Photo } from "../types/photoTypes";

/**
 * Интерфейс для параметров хука useDownloadAlbum
 */
interface DownloadAlbumParams {
  photos: Photo[]; // Массив фотографий альбома
  albumName?: string;
  albumId?: string | string[] | undefined;
}

/**
 * Интерфейс для возвращаемого значения хука useDownloadAlbum
 */
interface DownloadAlbumReturn {
  downloadAlbum: () => Promise<void>;
  isFsaSupported: boolean; // Флаг поддержки File System Access API
}

/**
 * Хук для скачивания изображений выбранного альбома
 * Цепочка передачи и вызова: page -> HeaderItems -> DownloadAlbumModal
 *
 * @param params Параметры хука
 * @returns { downloadAlbum: () => void, isFsaSupported: boolean } - Колбек функция для скачивания и флаг поддержки FSA API
 */
export const useDownloadAlbum = ({
  photos,
  albumName,
  albumId,
}: DownloadAlbumParams): DownloadAlbumReturn => {
  const isFsaSupported = "showDirectoryPicker" in window;

  const downloadAlbum = useCallback(async () => {
    console.log("Скачивание альбома, начало загрузки", {
      photos,
      albumName,
      albumId,
    });
    if (!photos || photos.length === 0) {
      alert("Альбом пуст или фотографии не загружены");
      return;
    }

    // Функция для запасной логики без FSA API
    const fallbackDownload = () => {
      photos.forEach((photo: any, index: number) => {
        try {
          const link = document.createElement("a");
          const fullPath = `${window.location.origin}${photo.path}`;
          link.href = fullPath;
          link.download = `${index + 1}_${
            photo.path.split("/").pop() || `photo${index + 1}.jpg`
          }`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error(`Ошибка загрузки фото ${index + 1}:`, error);
          alert(`Не удалось загрузить фото ${index + 1}. Проверь консоль.`);
        }
      });
    };

    // Проверка поддержки API
    if (!isFsaSupported) {
      console.log(
        "File System Access API не поддерживается, переключение на запасную логику"
      );
      fallbackDownload();
      return;
    }

    try {
      // Попытка с File System Access API
      const dirHandle = await window.showDirectoryPicker();
      const albumFolderHandle = await dirHandle.getDirectoryHandle(
        albumName || `album_${albumId}`,
        { create: true }
      );

      // Сохранение каждого фото
      for (const [index, photo] of photos.entries()) {
        const response = await fetch(`${window.location.origin}${photo.path}`);
        if (!response.ok) throw new Error(`Ошибка загрузки фото ${photo.path}`);
        const blob = await response.blob();
        const fileName = `${index + 1}_${
          photo.path.split("/").pop() || `photo${index + 1}.jpg`
        }`;
        const fileHandle = await albumFolderHandle.getFileHandle(fileName, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      }
    } catch (error) {
      console.error("Ошибка скачивания:", error);
    }
  }, [photos, albumName, albumId, isFsaSupported]);

  return { downloadAlbum, isFsaSupported };
};
