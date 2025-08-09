import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Photo } from "@/app/album/[id]/types/photoTypes";

const prisma = new PrismaClient();

/**
 * Обрабатывает загрузку фотографий для альбома, сохраняет файлы и обновляет базу данных.
 * @param {string} albumId - Идентификатор альбома, в который загружаются фото.
 * @param {File[]} files - Массив файлов для загрузки.
 * @returns {Promise<NextResponse>} Объект ответа с массивом созданных фотографий или ошибкой.
 */
async function processPhotoUpload(
  request: Request,
  albumId: string,
  files: File[]
) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  // Создаём директорию, если она не существует
  await mkdir(uploadDir, { recursive: true });

  const createdPhotos: Photo[] = [];

  for (const file of files) {
    if (file.size === 0) {
      console.warn("Пропущен пустой файл:", file.name);
      continue;
    }

    // Очищаем имя файла от параметров и недопустимых символов, и добавляем уникальный суффикс
    const originalName = file.name.split("?")[0]; // Убираем параметры URL
    const fileExtension = path.extname(originalName) || ".jpg";
    const baseName = path.basename(originalName, fileExtension); // Базовое имя без расширения (например, "forest")
    const uniqueSuffix = randomUUID().split("-")[0];
    const cleanFileName = `${baseName}_${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(uploadDir, cleanFileName);
    const fileUrl = `/uploads/${cleanFileName}`;

    console.log(
      `Сохраняем файл: ${cleanFileName}, оригинальное имя: ${originalName}, размер: ${file.size} байт`
    );

    // Сохраняем файл
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Получаем текущий максимальный order для альбома
    const maxOrder = await prisma.photo.findFirst({
      where: { albumId: Number(albumId) },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const photo = await prisma.photo.create({
      data: {
        path: fileUrl,
        albumId: Number(albumId),
        order: (maxOrder?.order ?? -1) + 1, // Увеличиваем order
      },
    });

    createdPhotos.push({
      id: photo.id,
      path: photo.path,
      order: photo.order,
    });
  }

  if (createdPhotos.length === 0) {
    return NextResponse.json(
      { error: "Не удалось сохранить ни один файл" },
      { status: 400 }
    );
  }

  return NextResponse.json(createdPhotos);
}

/**
 * Обработчик POST-запроса для загрузки фотографий в альбом.
 * Проверяет входные данные и вызывает функцию обработки загрузки.
 * @returns {Promise<NextResponse>} Объект ответа с массивом созданных фотографий или ошибкой.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const albumId = formData.get("albumId") as string;
    const files = formData.getAll("photos") as File[];

    console.log("Получен albumId:", albumId);
    console.log(
      "Получены файлы:",
      files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
    );

    if (!albumId) {
      return NextResponse.json(
        { error: "albumId обязателен" },
        { status: 400 }
      );
    }

    if (
      !files ||
      files.length === 0 ||
      files.every((file) => file.size === 0)
    ) {
      return NextResponse.json(
        { error: "Файлы не выбраны или пусты" },
        { status: 400 }
      );
    }

    return await processPhotoUpload(request, albumId, files);
  } catch (error) {
    console.error("Ошибка при загрузке фотографий:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
