/**
 * Метод для преобразования Data URL в File
 * @function
 * @returns {function}
 */

export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Метод для загрузки файла с внешнего сайта (межвкладочный трансфер)
 * Вызывается из handleDrop
 * @function
 * @returns {function}
 */

export async function proxyToFile(
  url: string,
  filename: string
): Promise<File> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    console.log("Запрос прокси для URL:", url);
    // Проверка: URL должен содержать домен и не быть слишком коротким
    if (url.length < 20 || !url.includes(".")) {
      throw new Error("Невалидный URL, игнорируем");
    }

    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
      method: "GET",
      headers: {
        Accept: "image/*", // Запрашиваем только изображения
      },
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка прокси: ${response.status} - ${response.statusText}`
      );
    }

    const contentType = response.headers.get("Content-Type");
    console.log("Получен Content-Type:", contentType);
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error(
        "URL не указывает на изображение (неверный Content-Type)"
      );
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error("Получен пустой Blob");
    }

    console.log("Успешно получен Blob, размер:", blob.size);
    return new File([blob], filename, { type: blob.type });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Ошибка в proxyToFile:", errorMessage);
    throw error; // Прокидываем ошибку дальше для обработки в handleDrop
  } finally {
    clearTimeout(timeout);
  }
}
