import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/**
 * Обработчик GET-запроса для получения размера папки uploads.
 * Выполняет расчёт общего размера файлов и вложенных папок в директории public/uploads
 * и возвращает результат в формате JSON, используя ГБ, если размер превышает 1024 МБ.
 *
 * @returns {Promise<NextResponse>} Объект ответа с размером папки в мегабайтах или ошибкой.
 * @throws {Error} Выбрасывает ошибку, если не удаётся определить размер папки.
 */
export async function GET(req: NextRequest, res: NextResponse) {
  const uploadsPath = path.join(process.cwd(), "public", "uploads");
  try {
    const sizeInBytes = getFolderSize(uploadsPath);
    if (sizeInBytes >= 1024 * 1024 * 1024) {
      const sizeInGB = (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2);
      return NextResponse.json({ size: `${sizeInGB} GB` }, { status: 200 });
    } else if (sizeInBytes >= 1024 * 1024) {
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      return NextResponse.json({ size: `${sizeInMB} MB` }, { status: 200 });
    } else if (sizeInBytes >= 1024) {
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      return NextResponse.json({ size: `${sizeInKB} KB` }, { status: 200 });
    } else {
      return NextResponse.json(
        { size: `${sizeInBytes} bytes` },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Ошибка при измерении размера папки:", error);
    return NextResponse.json(
      { error: "Не удалось определить размер папки" },
      { status: 500 }
    );
  }
}

/**
 * Рекурсивно вычисляет общий размер файлов и вложенных папок в указанной директории.
 *
 * @param {string} dir - Путь к директории для анализа.
 * @returns {number} Общий размер в байтах.
 */
const getFolderSize = (dir: string): number => {
  let totalSize = 0;
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        totalSize += getFolderSize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  }
  return totalSize;
};
