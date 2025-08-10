import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Определяем, что params может быть промисом
interface Context {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * Обработчик DELETE-запроса для очистки альбома.
 * Удаляет все фотографии, связанные с альбомом, и их файлы, но оставляет сам альбом.
 * @param {NextRequest} req - Объект запроса от Next.js.
 * @param {Context} context - Контекст запроса, содержащий параметры.
 * @returns {Promise<NextResponse>} Объект ответа с сообщением об успехе или ошибкой.
 */

export async function DELETE(req: NextRequest, context: Context) {
  // Ждём разрешения params, если это промис
  const params = await (context.params as Promise<{ id: string }>);

  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Неверный ID" }, { status: 400 });
  }

  try {
    const album = await prisma.album.findUnique({ where: { id } });
    if (!album) {
      return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
    }

    const photos = await prisma.photo.findMany({ where: { albumId: id } });

    // Удаляем файлы фотографий из public/uploads
    for (const photo of photos) {
      const filePath = path.join(process.cwd(), "public", photo.path);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Ошибка удаления файла ${filePath}:`, err);
      }
    }

    await prisma.photo.deleteMany({ where: { albumId: id } });

    return NextResponse.json({ message: "Альбом очищен, фотографии удалены" });
  } catch (error) {
    console.error("Ошибка при очистке альбома:", error);
    return NextResponse.json(
      { error: "Ошибка очистки альбома" },
      { status: 500 }
    );
  }
}
