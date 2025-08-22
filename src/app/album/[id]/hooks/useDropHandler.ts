import { useState, useCallback } from "react";
import { dataURLtoFile, proxyToFile } from "../utils/utils";

/**
 * Хук для обработки перетаскивания (Drag-and-Drop) файлов и URL изображений в компонент.
 * Предоставляет функции и состояние для управления перетаскиванием файлов из локальной файловой системы,
 * межвкладочных URL и закодированных Data URL. Фильтрует данные, игнорируя текст из интерфейса (например, навигацию),
 * и обрабатывает ошибки загрузки через прокси.
 *
 * @param {boolean} isLoading - Флаг состояния загрузки, определяющий, доступна ли зона перетаскивания.
 * @param {function} setFiles - Функция для установки массива файлов (File[]) в родительском состоянии.
 * @param {function} setTriggerUpload - Функция для установки триггера загрузки (boolean), запускающего процесс upload.
 *
 * @returns {Object} Объект с методами и состоянием для управления Drag-and-Drop:
 *   - {function} handleDrop - Обработчик события перетаскивания (drop), асинхронно обрабатывает файлы и URL.
 *   - {function} handleDragOver - Обработчик события наведения (drag over), обновляет состояние перетаскивания.
 *   - {function} handleDragEnter - Обработчик события входа (drag enter), обновляет состояние перетаскивания.
 *   - {function} handleDragLeave - Обработчик события выхода (drag leave), сбрасывает состояние перетаскивания.
 *   - {boolean} isDraggingOver - Состояние, указывающее, находится ли объект над зоной перетаскивания.
 *   - {function} setIsDraggingOver - Функция для программного управления состоянием isDraggingOver.
 *
 *
 * @throws {Error} Ошибка может возникнуть при неудачной загрузке URL через прокси или преобразовании Data URL.
 * Возможные причины: сетевая ошибка, неверный формат данных, проблемы с сервером прокси.
 *
 * @dependencies
 * - `dataURLtoFile` - Утилита для преобразования Data URL в объект File.
 * - `proxyToFile` - Асинхронная утилита для загрузки изображения по URL через прокси.
 */

export const useDropHandler = (
  isLoading: boolean,
  setFiles: (files: File[]) => void,
  setTriggerUpload: (trigger: boolean) => void
) => {
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isLoading) {
        setIsDraggingOver(false);
        const droppedFiles: Set<File> = new Set();

        // Логируем все типы данных в DataTransfer для отладки
        console.log("DataTransfer types:", e.dataTransfer.types);
        for (const type of e.dataTransfer.types) {
          console.log(`Data for ${type}:`, e.dataTransfer.getData(type));
        }

        // 1. Проверяем локальные файлы (перетаскивание из проводника)
        const localFiles = Array.from(e.dataTransfer.files).filter((file) =>
          file.type.startsWith("image/")
        );
        if (localFiles.length > 0) {
          console.log("Найдены локальные файлы:", localFiles);
          localFiles.forEach((file) => droppedFiles.add(file));
        }

        // 2. Проверяем URL (перетаскивание из другой вкладки/сайта)
        const uriList = e.dataTransfer.getData("text/uri-list");
        const plainText = e.dataTransfer.getData("text/plain");
        const url = uriList || plainText;

        if (url && (url.startsWith("http") || url.startsWith("https"))) {
          console.log("Найден URL из другой вкладки:", url);
          // фильтр: игнорируем текст из интерфейса
          const baseUrl = url.split("?")[0];
          if (
            url.length > 20 &&
            !url.includes("album") && // Исключаем навигацию
            /\.(jpg|jpeg|png|gif|webp)$/i.test(baseUrl)
          ) {
            try {
              const filename =
                baseUrl.split("/").pop() || `image_from_${Date.now()}.jpg`;
              const file = await proxyToFile(url, filename);
              if (file.type.startsWith("image/")) {
                droppedFiles.add(file);
                console.log("Успешно загружен файл через прокси:", file);
              } else {
                console.log(
                  "URL не указывает на изображение, игнорируем:",
                  url
                );
              }
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error ? error.message : String(error);
              console.error(
                "Ошибка загрузки изображения через прокси:",
                errorMessage
              );
              if (
                errorMessage.includes("Failed to fetch") ||
                errorMessage.includes("NetworkError")
              ) {
                console.log(
                  "Скорее всего, это не валидный URL изображения, игнорируем."
                );
              } else {
                alert(
                  `Не удалось загрузить изображение по URL: ${errorMessage}`
                );
              }
            }
          } else {
            console.log(
              "URL выглядит как текст из интерфейса или невалиден, игнорируем:",
              url
            );
          }
        }

        // 3. Проверяем Data URL (перетаскивание закодированного изображения)
        if (plainText && plainText.startsWith("data:image/")) {
          console.log("Найден Data URL:", plainText);
          try {
            const file = dataURLtoFile(
              plainText,
              `image_from_data_${Date.now()}.jpg`
            );
            droppedFiles.add(file);
            console.log("Успешно преобразован Data URL в файл:", file);
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error("Ошибка преобразования Data URL:", errorMessage);
            alert(
              `Не удалось обработать Data URL изображения: ${errorMessage}`
            );
          }
        }

        // Преобразуем Set в массив
        const finalFiles: File[] = Array.from(droppedFiles);
        console.log("Итоговый список файлов для загрузки:", finalFiles);

        // Очищаем и устанавливаем новые файлы только если есть валидные данные
        if (finalFiles.length > 0) {
          setFiles(finalFiles);
          setTriggerUpload(true);
        } else {
          console.log("Нет валидных файлов для загрузки, игнорируем.");
        }
      }
    },
    [isLoading, setFiles, setTriggerUpload]
  );

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isLoading) setIsDraggingOver(true);
    },
    [isLoading]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isLoading) setIsDraggingOver(true);
    },
    [isLoading]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isLoading) setIsDraggingOver(false);
    },
    [isLoading]
  );

  return {
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    isDraggingOver,
    setIsDraggingOver,
  };
};
