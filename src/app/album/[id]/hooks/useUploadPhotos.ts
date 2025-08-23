import { useState } from "react";
import { Photo } from "../types/photoTypes";
import { AlbumForViewPhotos } from "@/app/types/albumTypes";

/**
 * Хук для управления загрузкой фотографий в альбом.
 * Предоставляет функцию `uploadPhotos` для отправки файлов на сервер(next) и состояние `uploading` для отслеживания процесса загрузки.
 *
 * @param {string | string[] | undefined} id - Идентификатор альбома, в который загружаются фотографии.
 * @param {React.Dispatch<React.SetStateAction<File[]>>} setFiles - Функция для обновления состояния массива загружаемых файлов.
 * @param {React.Dispatch<React.SetStateAction<Photo[]>>} setPhotos - Функция для обновления состояния массива фотографий.
 * @param {React.Dispatch<React.SetStateAction<AlbumForViewPhotos | null>>} setAlbum - Функция для обновления состояния данных альбома.
 * @param {React.RefObject<HTMLInputElement | null>} fileInputRef - Ссылка на элемент ввода файлов для сброса значения после загрузки.
 * @returns {{ uploadPhotos: () => Promise<void>, uploading: boolean }} - Объект с функцией загрузки и состоянием процесса.
 */

export const useUploadPhotos = (
  id: string | string[] | undefined,
  setFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>,
  setAlbum: React.Dispatch<React.SetStateAction<AlbumForViewPhotos | null>>,
  fileInputRef: React.RefObject<HTMLInputElement | null>
) => {
  const [uploading, setUploading] = useState(false);

  async function uploadPhotos() {
    const files = await new Promise<File[]>((resolve) => {
      setFiles((prevFiles) => {
        resolve(prevFiles);
        return prevFiles;
      });
    });

    if (files.length === 0) {
      console.log("Нет файлов для загрузки.");
      return;
    }
    setUploading(true);

    console.log("Начинаем загрузку файлов:", files);

    const form = new FormData();
    form.append("albumId", String(id));
    files.forEach((file, index) => {
      if (file instanceof File && file.size > 0) {
        console.log(
          `Добавляем файл ${index + 1}:`,
          file.name,
          file.type,
          file.size
        );
        form.append("photos", file);
      } else {
        console.warn(`Файл ${index + 1} невалиден:`, file);
      }
    });

    try {
      console.log("Отправляем запрос на /api/photos/upload...");
      const controller = new AbortController();
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });

      if (res.ok) {
        const newPhotos: Photo[] = await res.json();
        console.log("Успешно загружено:", newPhotos);
        setFiles([]); // Чистка буфера
        setPhotos((prev) => [...prev, ...newPhotos]); // Обновляем список фотографий

        // Сбрасываем значение инпута
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          console.log("ИНПУТ СБРОШЕН");
        }

        // Получаем актуальный photoCount
        const countRes = await fetch(`/api/photos/countByAlbum?albumId=${id}`, {
          cache: "no-store",
        });
        if (countRes.ok) {
          const { photoCount } = await countRes.json();
          console.log("Получен актуальный photoCount:", photoCount);
          // Обновляем album с новым photoCount
          setAlbum((prev: AlbumForViewPhotos | null) => {
            if (prev) {
              return { ...prev, photoCount };
            }
            // Возвращаем полный объект или null
            return {
              id: id ? Number(id) : 0,
              name: "Unknown",
              description: null,
              photoCount: photoCount ?? 0,
              coverPhotoId: null,
            };
          });
        } else {
          console.error(
            "Ошибка при запросе countByAlbum:",
            countRes.statusText
          );
        }
      } else {
        throw new Error(`Ошибка загрузки фотографий: ${res.statusText}`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Ошибка загрузки:", errorMessage);
      alert(`Ошибка загрузки фотографий: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  }

  return { uploadPhotos, uploading };
};
