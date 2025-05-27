// Утилита для преобразования Data URL в File
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

// Утилита для загрузки файла через прокси
export async function proxyToFile(
  url: string,
  filename: string
): Promise<File> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    console.log("Запрос прокси для URL:", url);
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Ошибка прокси: ${response.statusText}`);
    }
    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error("Получен пустой Blob");
    }
    return new File([blob], filename, { type: blob.type });
  } finally {
    clearTimeout(timeout);
  }
}
