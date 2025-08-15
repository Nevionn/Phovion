import { useCallback } from "react";
import { Photo } from "../types/photoTypes";

/**
 * Хук для скачивания изображений выбранного альбома
 *
 * @param photos Все изображения альбома
 * @param albumName
 * @param albumId
 * @returns колбек функция downloadAlbum, цепочка передачи и вызова: page -> HeaderItems -> DownloadAlbumModal
 */

export const useDownloadAlbum = (
  photos: Photo[],
  albumName?: string,
  albumId?: string | string[] | undefined
) => {
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
    if (!("showDirectoryPicker" in window)) {
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
  }, [photos, albumName, albumId]);

  return downloadAlbum;
};
