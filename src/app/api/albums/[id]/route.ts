import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface Context {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Context) {
  const id = Number(params.id);

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      photos: true, // Включаем связанные фотографии
    },
  });

  if (!album) {
    return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
  }

  return NextResponse.json(album);
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Неверный ID" }, { status: 400 });
  }

  try {
    // Проверяем существование альбома
    const album = await prisma.album.findUnique({ where: { id } });
    if (!album) {
      return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
    }

    // Получаем все фотографии альбома
    const photos = await prisma.photo.findMany({ where: { albumId: id } });

    // Удаляем файлы фотографий из public/uploads
    for (const photo of photos) {
      const filePath = path.join(process.cwd(), "public", photo.path);
      try {
        await fs.unlink(filePath); // Удаляем файл
      } catch (err) {
        console.error(`Ошибка удаления файла ${filePath}:`, err);
        // Можно продолжить, если файл не существует, или обработать ошибку иначе
      }
    }

    // Удаляем записи фотографий из базы данных
    await prisma.photo.deleteMany({ where: { albumId: id } });

    // Удаляем альбом
    await prisma.album.delete({ where: { id } });

    return NextResponse.json({ message: "Альбом и связанные файлы удалены" });
  } catch (error) {
    console.error("Ошибка при удалении альбома:", error);
    return NextResponse.json(
      { error: "Ошибка удаления альбома" },
      { status: 500 }
    );
  }
}
