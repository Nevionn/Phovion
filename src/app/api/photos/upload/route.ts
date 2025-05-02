import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";

// Отключаем bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Проверяем и создаем папку для загрузки
const uploadDir = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Ошибка при создании папки uploads:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Неверный тип содержимого" },
        { status: 400 }
      );
    }

    // Получаем данные формы
    const formData = await request.formData();
    const albumId = formData.get("albumId") as string;
    const file = formData.get("photo") as File;

    if (!albumId || !file) {
      return NextResponse.json(
        { error: "albumId и файл обязательны" },
        { status: 400 }
      );
    }

    // Проверяем и создаем папку uploads
    await ensureUploadDir();

    // Генерируем уникальное имя файла
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);
    const relativePath = `/uploads/${filename}`;

    // Сохраняем файл
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Получаем количество существующих фото для порядка
    const photoCount = await prisma.photo.count({
      where: { albumId: Number(albumId) },
    });

    // Создаем запись в базе данных
    const photo = await prisma.photo.create({
      data: {
        albumId: Number(albumId),
        path: relativePath,
        order: photoCount + 1,
      },
    });

    return NextResponse.json(photo);
  } catch (err) {
    console.error("Ошибка при загрузке файла:", err);
    return NextResponse.json(
      { error: "Ошибка при загрузке файла" },
      { status: 500 }
    );
  }
}
