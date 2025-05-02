import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      orderBy: { order: "asc" },
      include: {
        photos: {
          orderBy: { createdAt: "desc" }, // Сортируем по дате создания (последняя — первая)
          take: 1, // Берем только одну фотографию
          select: { path: true }, // Возвращаем только поле path
        },
      },
    });

    // Форматируем данные, чтобы вернуть плоский объект
    const formattedAlbums = albums.map((album) => ({
      id: album.id,
      name: album.name,
      avatar: album.photos.length > 0 ? album.photos[0].path : null, // Путь к последней фотографии или null
    }));

    return NextResponse.json(formattedAlbums);
  } catch (error) {
    console.error("Ошибка при получении альбомов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
