import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE() {
  try {
    const photos = await prisma.photo.findMany({
      select: { path: true },
    });

    // Удаляем файлы из папки public/uploads
    await Promise.all(
      photos.map(async (photo) => {
        const filePath = path.join(process.cwd(), "public", photo.path);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.warn(`Файл ${filePath} не найден, пропускаем:`, error);
        }
      })
    );

    await prisma.album.deleteMany({});

    return NextResponse.json({
      message: "Все альбомы, фотографии и файлы удалены",
    });
  } catch (error) {
    console.error("Ошибка при удалении альбомов и файлов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
